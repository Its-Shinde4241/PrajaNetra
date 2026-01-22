package com.app.prajanetraserver.DTO;


public record CommentRequest(
        String text,
        String userId,
        String complaintId
) {
}
