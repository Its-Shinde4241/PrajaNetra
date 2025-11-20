package com.app.prajanetraserver.dto;

public record RegisterRequest(
        String name,
        String password,
        String email
) {
}
