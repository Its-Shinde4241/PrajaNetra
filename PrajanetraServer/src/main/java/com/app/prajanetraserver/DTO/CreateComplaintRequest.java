package com.app.prajanetraserver.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateComplaintRequest {
    @NotBlank(message = "userId required")
    private String userId;
    @NotBlank(message = "title required")
    private String title;
    @NotBlank(message = "category required")
    private String category;
    @NotNull(message = "Latitude is required")
    Double latitude;
    @NotNull(message = "Longitude is required")
    Double longitude;
    String formattedAddress;
    @NotBlank(message = "description required")
    private String description;
}
