package com.app.prajanetraserver.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.prajanetraserver.DTO.ComplaintResponse;
import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.DTO.Role;
import com.app.prajanetraserver.DTO.UserResponse;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;

@Service
public class AdminService {

    final private ComplaintRepo complaintRepo;
    final private UserRepo userRepo;
    private final UserService userService;

    AdminService(ComplaintRepo complaintRepo, UserRepo userRepo, UserService userService) {
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
        this.userService = userService;
    }

    public void changeComplaintStatus(String complaintId, ComplaintStatus newStatus) {

        complaintRepo.changeStatus(complaintId, newStatus);
    }

    @Transactional
    public UserResponse makeStaff(String userId) {
        try {
            User user = userRepo.findUserByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("user not found for id : " + userId));
            user.getRoles().add(Role.MUNICIPAL_STAFF);
            System.out.println(user);
            userRepo.save(user);
            return userService.getUserResponse(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<UserResponse> getAllUsers() {
        return userRepo.findAll().stream()
                .map(userService::getUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(String userId) {
        User user = userRepo.findUserByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));
        return userService.getUserResponse(user);
    }

    @Transactional
    public UserResponse revokeStaffRole(String userId) {
        User user = userRepo.findUserByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));
        user.getRoles().remove(Role.MUNICIPAL_STAFF);
        userRepo.save(user);
        return userService.getUserResponse(user);
    }

    public List<UserResponse> getAllStaffMembers() {
        return userRepo.findAll().stream()
                .filter(user -> user.getRoles().contains(Role.MUNICIPAL_STAFF))
                .map(userService::getUserResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getAllRegularUsers() {
        return userRepo.findAll().stream()
                .filter(user -> !user.getRoles().contains(Role.MUNICIPAL_STAFF))
                .map(userService::getUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get comprehensive dashboard statistics
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Complaint statistics
        long totalComplaints = complaintRepo.count();
        long submittedComplaints = complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == ComplaintStatus.SUBMITTED)
                .count();
        long inProgressComplaints = complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS)
                .count();
        long resolvedComplaints = complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED)
                .count();
        long acknowledgedComplaints = complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == ComplaintStatus.ACKNOWLEDGED)
                .count();
        long rejectedComplaints = complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == ComplaintStatus.REJECTED)
                .count();

        stats.put("totalComplaints", totalComplaints);
        stats.put("submittedComplaints", submittedComplaints);
        stats.put("inProgressComplaints", inProgressComplaints);
        stats.put("resolvedComplaints", resolvedComplaints);
        stats.put("acknowledgedComplaints", acknowledgedComplaints);
        stats.put("rejectedComplaints", rejectedComplaints);

        // User statistics
        long totalUsers = userRepo.count();
        long totalStaff = userRepo.findAll().stream()
                .filter(user -> user.getRoles().contains(Role.MUNICIPAL_STAFF))
                .count();

        stats.put("totalUsers", totalUsers);
        stats.put("totalStaff", totalStaff);
        stats.put("regularUsers", totalUsers - totalStaff);

        // Resolution rate
        double resolutionRate = totalComplaints > 0
                ? (resolvedComplaints * 100.0 / totalComplaints)
                : 0.0;
        stats.put("resolutionRate", String.format("%.2f%%", resolutionRate));

        return stats;
    }

    public List<ComplaintResponse> getComplaintsByDateRange(LocalDateTime start, LocalDateTime end) {
        return complaintRepo.findAll().stream()
                .filter(c -> !c.getCreatedAt().isBefore(start) && !c.getCreatedAt().isAfter(end))
                .map(this::mapToComplaintResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepo.findAll().stream()
                .filter(c -> c.getStatus() == status)
                .map(this::mapToComplaintResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getCategoryStats() {
        return complaintRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getCategory,
                        Collectors.counting()
                ));
    }

    public Map<ComplaintStatus, Long> getStatusStats() {
        return complaintRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getStatus,
                        Collectors.counting()
                ));
    }

    public List<ComplaintResponse> getRecentComplaints(int limit) {
        return complaintRepo.findAll().stream()
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .limit(limit)
                .map(this::mapToComplaintResponse)
                .collect(Collectors.toList());
    }

    // BULK OPERATIONS
    @Transactional
    public void bulkUpdateStatus(List<String> complaintIds, ComplaintStatus status) {
        complaintIds.forEach(id -> {
            try {
                complaintRepo.changeStatus(id, status);
            } catch (Exception e) {
                System.err.println("Failed to update status for complaint: " + id);
            }
        });
    }

    @Transactional
    public Map<String, Object> bulkDeleteComplaints(List<String> complaintIds) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int failCount = 0;

        for (String complaintId : complaintIds) {
            try {
                complaintRepo.deleteByComplaintId(complaintId);
                successCount++;
            } catch (Exception e) {
                failCount++;
                System.err.println("Failed to delete complaint: " + complaintId);
            }
        }

        result.put("success", successCount);
        result.put("failed", failCount);
        result.put("total", complaintIds.size());
        return result;
    }

    // LOCATION-BASED ANALYSIS
    public Map<String, Long> getLocationStats() {
        return complaintRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getFormattedAddress,
                        Collectors.counting()
                ));
    }

    public List<Map.Entry<String, Long>> getTopLocations(int limit) {
        return complaintRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getFormattedAddress,
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMostActiveUsers(int limit) {
        Map<User, Long> userComplaintCount = complaintRepo.findAll().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getUser,
                        Collectors.counting()
                ));

        return userComplaintCount.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(limit)
                .map(entry -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("user", userService.getUserResponse(entry.getKey()));
                    userInfo.put("complaintCount", entry.getValue());
                    return userInfo;
                })
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserComplaintStats(String userId) {
        User user = userRepo.findUserByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComplaints", user.getComplaints().size());

        Map<ComplaintStatus, Long> statusBreakdown = user.getComplaints().stream()
                .collect(Collectors.groupingBy(
                        Complaint::getStatus,
                        Collectors.counting()
                ));

        stats.put("statusBreakdown", statusBreakdown);
        return stats;
    }

    // ADVANCED SEARCH
    public List<ComplaintResponse> searchComplaints(String keyword) {
        String lowerKeyword = keyword.toLowerCase();
        return complaintRepo.findAll().stream()
                .filter(c -> c.getTitle().toLowerCase().contains(lowerKeyword)
                || c.getDescription().toLowerCase().contains(lowerKeyword))
                .map(this::mapToComplaintResponse)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> advancedSearch(
            String keyword,
            ComplaintStatus status,
            String category,
            LocalDateTime startDate,
            LocalDateTime endDate) {

        return complaintRepo.findAll().stream()
                .filter(c -> {
                    boolean matches = true;

                    if (keyword != null && !keyword.isEmpty()) {
                        String lowerKeyword = keyword.toLowerCase();
                        matches = c.getTitle().toLowerCase().contains(lowerKeyword)
                                || c.getDescription().toLowerCase().contains(lowerKeyword);
                    }

                    if (status != null) {
                        matches = matches && c.getStatus() == status;
                    }

                    if (category != null && !category.isEmpty()) {
                        matches = matches && c.getCategory().equalsIgnoreCase(category);
                    }

                    if (startDate != null) {
                        matches = matches && !c.getCreatedAt().isBefore(startDate);
                    }

                    if (endDate != null) {
                        matches = matches && !c.getCreatedAt().isAfter(endDate);
                    }

                    return matches;
                })
                .map(this::mapToComplaintResponse)
                .collect(Collectors.toList());
    }

    // HELPER METHODS
    private ComplaintResponse mapToComplaintResponse(Complaint complaint) {
        return new ComplaintResponse(
                complaint.getComplaintId(),
                complaint.getUser().getUserId(),
                complaint.getTitle(),
                complaint.getCategory(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getFormattedAddress(),
                complaint.getDescription(),
                complaint.getLikes(),
                complaint.getImageUrls(),
                complaint.getStatus(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt()
        );
    }

}
