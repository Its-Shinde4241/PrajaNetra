package com.app.prajanetraserver.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.prajanetraserver.DTO.ChangeStatusRequest;
import com.app.prajanetraserver.DTO.ComplaintResponse;
import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.DTO.UserResponse;
import com.app.prajanetraserver.Service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    final private AdminService adminService;

    AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/complaints/status")
    public ResponseEntity<?> changeComplaintStatus(@Valid @RequestBody ChangeStatusRequest request) {
        try {
            ComplaintStatus newStatus = request.getNewStatus();
            if (newStatus != ComplaintStatus.ACKNOWLEDGED && newStatus != ComplaintStatus.UNDER_REVIEW && newStatus != ComplaintStatus.REJECTED && newStatus != ComplaintStatus.IN_PROGRESS && newStatus != ComplaintStatus.RESOLVED && newStatus!=ComplaintStatus.SUBMITTED) {
                throw new IllegalArgumentException();
            }
            adminService.changeComplaintStatus(request.getComplaintId(), request.getNewStatus());
            return ResponseEntity.ok(Map.of("message", "ComplaintStatus changed fro complaint : " + request.getComplaintId()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/makestaff/{userId}")
    public ResponseEntity<?> makeStaff(@PathVariable String userId) {
        try {
            UserResponse userResponse = adminService.makeStaff(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("user", userResponse);
            response.put("message", "staff request approved  successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // USER MANAGEMENT ENDPOINTS
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            UserResponse user = adminService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/revokestaff/{userId}")
    public ResponseEntity<?> revokeStaffRole(@PathVariable String userId) {
        try {
            UserResponse userResponse = adminService.revokeStaffRole(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("user", userResponse);
            response.put("message", "Staff role revoked successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/staff")
    public ResponseEntity<?> getAllStaffMembers() {
        try {
            List<UserResponse> staff = adminService.getAllStaffMembers();
            return ResponseEntity.ok(staff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/regular")
    public ResponseEntity<?> getAllRegularUsers() {
        try {
            List<UserResponse> users = adminService.getAllRegularUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ANALYTICS & REPORTS ENDPOINTS
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/complaints/date-range")
    public ResponseEntity<?> getComplaintsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            List<ComplaintResponse> complaints = adminService.getComplaintsByDateRange(start, end);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/complaints/by-status/{status}")
    public ResponseEntity<?> getComplaintsByStatus(@PathVariable ComplaintStatus status) {
        try {
            List<ComplaintResponse> complaints = adminService.getComplaintsByStatus(status);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats/categories")
    public ResponseEntity<?> getCategoryStats() {
        try {
            Map<String, Long> stats = adminService.getCategoryStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats/status")
    public ResponseEntity<?> getStatusStats() {
        try {
            Map<ComplaintStatus, Long> stats = adminService.getStatusStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/complaints/recent")
    public ResponseEntity<?> getRecentComplaints(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<ComplaintResponse> complaints = adminService.getRecentComplaints(limit);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // BULK OPERATIONS ENDPOINTS
    @PutMapping("/complaints/bulk-status")
    public ResponseEntity<?> bulkUpdateStatus(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<String> complaintIds = (List<String>) request.get("complaintIds");
            ComplaintStatus status = ComplaintStatus.valueOf((String) request.get("status"));

            adminService.bulkUpdateStatus(complaintIds, status);
            return ResponseEntity.ok(Map.of("message", "Bulk status update completed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/complaints/bulk-delete")
    public ResponseEntity<?> bulkDeleteComplaints(@RequestBody Map<String, List<String>> request) {
        try {
            List<String> complaintIds = request.get("complaintIds");
            Map<String, Object> result = adminService.bulkDeleteComplaints(complaintIds);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // LOCATION-BASED ANALYSIS ENDPOINTS
    @GetMapping("/stats/locations")
    public ResponseEntity<?> getLocationStats() {
        try {
            Map<String, Long> stats = adminService.getLocationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats/top-locations")
    public ResponseEntity<?> getTopLocations(@RequestParam(defaultValue = "5") int limit) {
        try {
            List<Map.Entry<String, Long>> topLocations = adminService.getTopLocations(limit);
            return ResponseEntity.ok(topLocations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // USER ACTIVITY ANALYSIS ENDPOINTS
    @GetMapping("/users/most-active")
    public ResponseEntity<?> getMostActiveUsers(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<Map<String, Object>> activeUsers = adminService.getMostActiveUsers(limit);
            return ResponseEntity.ok(activeUsers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}/complaint-stats")
    public ResponseEntity<?> getUserComplaintStats(@PathVariable String userId) {
        try {
            Map<String, Object> stats = adminService.getUserComplaintStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ADVANCED SEARCH ENDPOINTS
    @GetMapping("/complaints/search")
    public ResponseEntity<?> searchComplaints(@RequestParam String keyword) {
        try {
            List<ComplaintResponse> complaints = adminService.searchComplaints(keyword);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/complaints/advanced-search")
    public ResponseEntity<?> advancedSearch(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<ComplaintResponse> complaints = adminService.advancedSearch(
                    keyword, status, category, startDate, endDate);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
