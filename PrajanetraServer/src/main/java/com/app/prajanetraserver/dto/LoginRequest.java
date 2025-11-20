package com.app.prajanetraserver.dto;

public record LoginRequest(
        String email,
        String password
) {
}
