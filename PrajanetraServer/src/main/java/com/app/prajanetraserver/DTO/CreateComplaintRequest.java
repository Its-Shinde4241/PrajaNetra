package com.app.prajanetraserver.DTO;

import jakarta.validation.constraints.NotBlank;
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
    @NotBlank(message = "location required")
    private String location;
    @NotBlank(message = "description required")
    private String description;
}
