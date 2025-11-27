package com.app.prajanetraserver.DTO;

public record LoginRequest(
        String email,
        String password
) {
}
