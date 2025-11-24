package com.app.prajanetraserver.Service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket:complaint-images}")
    private String bucketName;

    private final OkHttpClient httpClient = new OkHttpClient();
    private final List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "webp");
    private final long maxFileSize = 5 * 1024 * 1024;

    public List<String> storeFiles(MultipartFile[] files) throws IOException {
        List<String> fileUrls = new ArrayList<>();

        if (files == null || files.length == 0) {
            return fileUrls;
        }

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            if (file.getSize() > maxFileSize) {
                throw new IllegalArgumentException(
                        "File size exceeds maximum limit of 5MB: " + file.getOriginalFilename());
            }

            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !isValidFileExtension(originalFilename)) {
                throw new IllegalArgumentException("Invalid file type. Allowed: jpg, jpeg, png, webp");
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            String publicUrl = uploadToSupabase(file, uniqueFilename);
            fileUrls.add(publicUrl);
        }

        return fileUrls;
    }

    private String uploadToSupabase(MultipartFile file, String filename) throws IOException {
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filename;

        String contentType = file.getContentType();
        if (contentType == null) {
            contentType = "image/jpeg";
        }

        RequestBody requestBody = RequestBody.create(
                file.getBytes(),
                MediaType.parse(contentType));

        Request request = new Request.Builder()
                .url(uploadUrl)
                .post(requestBody)
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .addHeader("Content-Type", contentType)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error details";
                throw new IOException("Failed to upload to Supabase: " + response.code() + " - " + response.message()
                        + " | Details: " + errorBody);
            }

            return supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + filename;
        }
    }

    private boolean isValidFileExtension(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        return allowedExtensions.contains(extension);
    }
}
