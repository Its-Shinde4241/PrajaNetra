package com.app.prajanetraserver.Controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.app.prajanetraserver.DTO.LoginRequest;
import com.app.prajanetraserver.DTO.RegisterRequest;
import com.app.prajanetraserver.Model.MyUserDetails;
import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Service.JwtService;
import com.app.prajanetraserver.Service.UserService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Attempting to authenticate user: " + loginRequest.email());
        try {
            Authentication authenticationRequest
                    = new UsernamePasswordAuthenticationToken(
                    loginRequest.email(),
                    loginRequest.password()
            );

            Authentication authenticationResponse
                    = this.authenticationManager.authenticate(authenticationRequest);

            MyUserDetails myUserDetails = (MyUserDetails) authenticationResponse.getPrincipal();
            User user = myUserDetails.getUser();

            String jwtToken = jwtService.generateToken(user);

            System.out.println("User " + user + " authenticated successfully.");

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", userService.getUserResponse(user));
            response.put("message", "Login successful");
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            System.out.println("Authentication failed for user: " + loginRequest.email() + " Error: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        User user;
        try {
            if (userService.findByEmail(registerRequest.email()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists with email: " + registerRequest.email());
            }
            user = userService.createUser(registerRequest.email(), registerRequest.password(), registerRequest.name());
            String jwtToken = jwtService.generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwtToken);
            response.put("user", userService.getUserResponse(user));
            response.put("message", "Registration successful");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.out.println("Registration failed: " + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/google/login")
    public void redirectToGoogle(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("authenticated", false));
        }

        MyUserDetails principal = (MyUserDetails) authentication.getPrincipal();
        User user = principal.getUser();

        return ResponseEntity.ok(
                Map.of(
                        "authenticated", true,
                        "user", userService.getUserResponse(user)
                )
        );
    }


}
