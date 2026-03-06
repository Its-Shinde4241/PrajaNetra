package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.*;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.MyUserDetails;
import com.app.prajanetraserver.Service.ComplaintService;
import com.app.prajanetraserver.Service.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

    public ComplaintController(ComplaintService complaintService,
                               FileStorageService fileStorageService,
                               ObjectMapper objectMapper) {
        this.complaintService = complaintService;
        this.fileStorageService = fileStorageService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createComplaint(
            @RequestPart("data") String dataJson,
            @RequestPart(required = false, name = "images") MultipartFile[] images) {
        try {
            CreateComplaintRequest request = objectMapper.readValue(dataJson, CreateComplaintRequest.class);
            if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Title is required"));
            }
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
            }
            if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Category is required"));
            }
            if (request.getFormattedAddress() == null || request.getFormattedAddress().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Location is required"));
            }
            if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Description is required"));
            }

            List<String> imageUrls = fileStorageService.storeFiles(images);

            Complaint complaint = complaintService.createComplaint(request, imageUrls);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Complaint filed successfully");
            response.put("complaintId", complaint.getComplaintId());
            response.put("complaint", complaintService.toComplaintResponse(complaint));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to upload files: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create complaint: " + e.getMessage()));
        }
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<?> getComplaint(@PathVariable String complaintId, Authentication authentication) {
        try {
            Complaint complaint = complaintService.getComplaintByComplaintId(complaintId)
                    .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

            String currentUserId = extractUserId(authentication);
            FeedResponse complaintResponse = complaintService.toFeedResponse(complaint, currentUserId);
            Map<String, Object> response = new HashMap<>();
            response.put("complaint", complaintResponse);
            response.put("message", "Complaint tracked successfully");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to retrieve complaint: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection,
            Authentication authentication
    ) {
        try {
            Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<Complaint> complaintsPage;

            if (status != null && !status.trim().isEmpty()) {
                try {
                    ComplaintStatus statusEnum = ComplaintStatus.valueOf(status.toUpperCase());
                    complaintsPage = complaintService.getComplaintsByStatus(statusEnum, pageable);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message",
                                    "Invalid status. Allowed: SUBMITTED, ACKNOWLEDGED, UNDER_REVIEW, IN_PROGRESS, RESOLVED"));
                }
            } else if (category != null && !category.trim().isEmpty()) {
                complaintsPage = complaintService.getComplaintsByCategory(category, pageable);
            } else if (userId != null && !userId.trim().isEmpty()) {
                complaintsPage = complaintService.getComplaintsByUserId(userId, pageable);
            } else {
                complaintsPage = complaintService.getAllComplaints(pageable);
            }

            String currentUserId = this.extractUserId(authentication);
            Page<FeedResponse> responsePage = complaintsPage.map((complaint) -> complaintService.toFeedResponse(complaint, currentUserId));

            Map<String, Object> response = new HashMap<>();
            response.put("complaints", responsePage.getContent());
            response.put("currentPage", responsePage.getNumber());
            response.put("totalPages", responsePage.getTotalPages());
            response.put("totalItems", responsePage.getTotalElements());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to retrieve complaints: " + e.getMessage()));
        }
    }

    @PatchMapping("/{complaintId}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable String complaintId,
            @RequestBody UpdateStatusRequest request,
            Authentication authentication
    ) {
        try {
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Status is required"));
            }

            Complaint complaint = complaintService.updateComplaintStatus(complaintId, request.getStatus());
            String currentUserId = this.extractUserId(authentication);
            FeedResponse response = complaintService.toFeedResponse(complaint, currentUserId);

            return ResponseEntity.ok(Map.of(
                    "message", "Status updated successfully",
                    "complaint", response));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to update status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{complaintId}")
    public ResponseEntity<?> deleteComplaint(@PathVariable String complaintId) {
        try {
            complaintService.deleteComplaint(complaintId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/toggle/like")
    public ResponseEntity<?> toggleLikes(@RequestParam String complaintId, @RequestParam String userId) {
        try {
            complaintService.toggleLike(complaintId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Complaint Liked Successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Complaint Liked Failed"));
        }
    }

    @PutMapping("/toggle/save")
    public ResponseEntity<?> toggleSave(@RequestParam String complaintId, @RequestParam String userId) {
        try {
            complaintService.toggleSave(complaintId, userId);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Complaint Saved Successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Complaint Save Failed"));
        }
    }

    private String extractUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails userDetails) {
            return userDetails.getUser().getUserId();
        }
        return null;
    }

}
