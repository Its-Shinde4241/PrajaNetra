package com.app.prajanetraserver.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintResponse {
    private String complaintId;
    private String userId;
    private String category;
    private String location;
    private String description;
    private List<String> imageUrls;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
