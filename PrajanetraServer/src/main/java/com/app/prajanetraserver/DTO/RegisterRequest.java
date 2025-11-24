package com.app.prajanetraserver.DTO;

public record RegisterRequest(
        String name,
        String password,
        String email
) {
}
