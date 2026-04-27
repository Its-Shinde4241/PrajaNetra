package com.app.prajanetraserver.DTO;

public record GeminiComplaintVerificationResult(
        boolean verified,
        double confidence,
        String reason
) {
}