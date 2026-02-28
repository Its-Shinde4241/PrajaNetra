package com.app.prajanetraserver.Service;


import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.DTO.FeedResponse;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Repo.CommentRepo;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedService {
    private static final Logger log = LoggerFactory.getLogger(FeedService.class);

    private final ComplaintRepo complaintRepo;
    private final UserRepo userRepo;
    private final CommentRepo commentRepo;

    FeedService(ComplaintRepo complaintRepo, UserRepo userRepo, CommentRepo commentRepo) {
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
        this.commentRepo = commentRepo;
    }

    @Transactional(readOnly = true)
    public Page<FeedResponse> getFeed(int page, int size, String category, String status,
                                      String sortBy, String currentUserId) {

        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Complaint> complaintsPage = fetchComplaints(category, status, pageable);

        List<FeedResponse> feedResponses = complaintsPage.getContent()
                .stream()
                .map(complaint -> mapToFeedResponse(complaint, currentUserId))
                .toList();

        return new PageImpl<>(feedResponses, pageable, complaintsPage.getTotalElements());

    }

    @Transactional(readOnly = true)
    public List<FeedResponse> getTrendingPosts(int limit, String currentUserId) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "likes"));
        Page<Complaint> complaints = complaintRepo.findAll(pageable);

        return complaints.getContent()
                .stream()
                .map(complaint -> mapToFeedResponse(complaint, currentUserId))
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<FeedResponse> getUserFeed(String targetUserId, int page, int size, String currentUserId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        User targetUser = userRepo.findUserByUserId(targetUserId).orElseThrow();
        Page<Complaint> complaints = complaintRepo.findComplaintsByUser(targetUser, pageable);

        List<FeedResponse> feedResponses = complaints.getContent()
                .stream()
                .map(complaint -> mapToFeedResponse(complaint, currentUserId))
                .toList();

        return new PageImpl<>(feedResponses, pageable, complaints.getTotalElements());
    }

    private Sort buildSort(String sortBy) {
        if (sortBy == null) sortBy = "latest";

        return switch (sortBy.toLowerCase()) {
            case "popular" -> Sort.by(Sort.Direction.DESC, "likes");
            case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt"); // "latest"
        };
    }

    private Page<Complaint> fetchComplaints(String category, String status, Pageable pageable) {
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasStatus = status != null && !status.isBlank();

        if (hasCategory && hasStatus) {
            ComplaintStatus statusEnum = ComplaintStatus.valueOf(status.toUpperCase());
            return complaintRepo.findByCategoryAndStatus(category, statusEnum, pageable);
        } else if (hasStatus) {
            ComplaintStatus statusEnum = ComplaintStatus.valueOf(status.toUpperCase());
            return complaintRepo.findByStatus(statusEnum, pageable);
        } else if (hasCategory) {
            return complaintRepo.findByCategory(category, pageable);
        } else {
            return complaintRepo.findAll(pageable);
        }
    }

    private FeedResponse mapToFeedResponse(Complaint complaint, String currentUserId) {
        // Access the user directly via the ManyToOne relation —
        User complaintOwner = complaint.getUser();

        // Compute engagement for current user
        boolean liked = false;
        boolean saved = false;
        if (currentUserId != null && !currentUserId.isBlank()) {
            try {
                User currentUser = userRepo.findUserByUserId(currentUserId).orElse(null);
                if (currentUser != null) {
                    liked = currentUser.getLikedComplaints().contains(complaint.getComplaintId());
                    saved = currentUser.getSavedComplaints().contains(complaint.getComplaintId());
                }
            } catch (Exception e) {
                log.warn("Failed to check like/save status for user {} on complaintId {}: {}", currentUserId, complaint.getComplaintId(), e.getMessage());
            }
        }

        // Count comments via repo
        long commentsCount = 0;
        try {
            commentsCount = commentRepo.countByComplaint(complaint);
        } catch (Exception e) {
            log.warn("Failed to count comments for complaintId : {} Error : {}", complaint.getComplaintId(), e.getMessage());
        }

        return FeedResponse.builder()
                .complaintId(complaint.getComplaintId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .formattedAddress(complaint.getFormattedAddress())
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .status(complaint.getStatus())
                .imageUrls(complaint.getImageUrls() != null ? complaint.getImageUrls() : List.of())
                .userId(complaintOwner.getUserId())
                .userName(complaintOwner.getName())
                .userProfileImage(complaintOwner.getProfileImageUrl())
                .likesCount(complaint.getLikes())
                .commentsCount(commentsCount)
                .likedByCurrentUser(liked)
                .savedByCurrentUser(saved)
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }
}
