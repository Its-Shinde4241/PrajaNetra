package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.GeminiComplaintVerificationResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class GeminiComplaintVerificationService {

    private final ObjectMapper objectMapper;
    private final Client client;
    private final String modelName;

    public GeminiComplaintVerificationService(
            ObjectMapper objectMapper,
            @Value("${gemini.api-key:}") String apiKey,
            @Value("${gemini.model:gemini-2.5-flash}") String modelName
    ) {
        this.objectMapper = objectMapper;
        this.modelName = modelName;
        this.client = apiKey == null || apiKey.isBlank() ? new Client() : Client.builder().apiKey(apiKey).build();
    }

    public GeminiComplaintVerificationResult verify(String category, String description, MultipartFile image) throws IOException {
        if (image == null || image.isEmpty()) {
            return new GeminiComplaintVerificationResult(true, 1.0, "No image provided, skipping AI verification");
        }

        String prompt = buildPrompt(category, description);
        String mimeType = image.getContentType() != null ? image.getContentType() : "image/jpeg";

        Content content = Content.fromParts(
                Part.fromText(prompt),
                Part.fromBytes(image.getBytes(), mimeType)
        );

        GenerateContentResponse response = client.models.generateContent(modelName, content, null);
        String text = response.text();

        if (text == null || text.isBlank()) {
            return new GeminiComplaintVerificationResult(false, 0.0, "Gemini returned an empty response");
        }

        return parseResult(text);
    }

    public VerifyAllImagesResult verifyAll(String category, String description, MultipartFile[] images) throws IOException {
        if (images == null || images.length == 0) {
            return new VerifyAllImagesResult(false, "No images provided for verification");
        }

        StringBuilder failureReasons = new StringBuilder();
        int imageIndex = 0;

        for (MultipartFile image : images) {
            imageIndex++;
            if (image == null || image.isEmpty()) {
                continue;
            }

            GeminiComplaintVerificationResult result = verify(category, description, image);
            if (!result.verified()) {
                failureReasons.append("Image ").append(imageIndex).append(": ").append(result.reason()).append("; ");
            }
        }

        if (!failureReasons.isEmpty()) {
            return new VerifyAllImagesResult(false, failureReasons.toString().trim());
        }

        return new VerifyAllImagesResult(true, "All images verified successfully");
    }

    private String buildPrompt(String category, String description) {
        return "You are verifying whether a user-submitted image matches a civic complaint. "
                + "Complaint tag/category: " + safe(category) + ". "
                + "Complaint description: " + safe(description) + ". "
                + "Check if the image visually supports the complaint. "
                + "Return only valid JSON with this shape: "
                + "{\"verified\":true|false,\"confidence\":0.0-1.0,\"reason\":\"short explanation\"}. "
                + "Be strict: if the image does not clearly match the complaint, set verified to false.";
    }

    private GeminiComplaintVerificationResult parseResult(String rawText) throws IOException {
        String cleaned = rawText.trim();
        int firstBrace = cleaned.indexOf('{');
        int lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }

        JsonNode node = objectMapper.readTree(cleaned);
        boolean verified = node.path("verified").asBoolean(false);
        double confidence = node.path("confidence").asDouble(0.0);
        String reason = node.path("reason").asText("No reason provided");

        return new GeminiComplaintVerificationResult(verified, confidence, reason);
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    public static class VerifyAllImagesResult {
        private final boolean allVerified;
        private final String message;

        public VerifyAllImagesResult(boolean allVerified, String message) {
            this.allVerified = allVerified;
            this.message = message;
        }

        public boolean isAllVerified() {
            return allVerified;
        }

        public String getMessage() {
            return message;
        }
    }
}