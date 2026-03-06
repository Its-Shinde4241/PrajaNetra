package com.app.prajanetraserver.DTO;

import java.time.LocalDateTime;
import java.util.Set;

public record CommentResponse(
        String commentId,
        String text,
        int likes,
        String userId,
        String userName,
        String userProfileImage,
        String complaintId,
        Set<String> likedByUsers,
        boolean isLiked,
        LocalDateTime createdAt
) {
}