package com.app.prajanetraserver.DTO;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        String userId,
        String name,
        String email,
        String profileImageUrl,
        String googleId,
        String loginMethod,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Set<Role> roles
) {
}
