package com.app.prajanetraserver.DTO;

public record CommentResponse(
        String commentId,
        String text,
        int likes,
        String userId,
        String complaintId
) {
}
