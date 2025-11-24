package com.app.prajanetraserver.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateComplaintRequest {
    private String name;
    private String email;
    private String phone;
    private String category;
    private String location;
    private String description;
}
