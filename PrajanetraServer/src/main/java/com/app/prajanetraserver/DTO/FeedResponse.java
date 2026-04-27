package com.app.prajanetraserver.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedResponse {
    private String complaintId;
    private String title;
    private String description;
    private String category;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private ComplaintStatus status;
    private List<String> imageUrls;
    private boolean verified;

    // User info
    private String userId;
    private String userName;
    private String userProfileImage;

    // Engagement
    private long likesCount;
    private long commentsCount;
    private boolean likedByCurrentUser;
    private boolean savedByCurrentUser;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


