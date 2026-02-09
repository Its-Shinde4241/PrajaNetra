package com.app.prajanetraserver.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeStatusRequest {
    @NotBlank(message = "Complaint ID is required")
    private String complaintId;

    @NotNull(message = "Status is required")
    private ComplaintStatus newStatus;
}
