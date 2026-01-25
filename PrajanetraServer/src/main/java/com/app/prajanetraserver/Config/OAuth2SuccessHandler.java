package com.app.prajanetraserver.Config;

import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Service.JwtService;
import com.app.prajanetraserver.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2AuthenticationToken oauth =
                (OAuth2AuthenticationToken) authentication;

        OAuth2User oauthUser = oauth.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");
        String googleId = oauthUser.getAttribute("sub");

        User user = userService.findByEmail(email)
                .orElseGet(() -> {
                            User newUser = new User();
                            newUser.setEmail(email);
                            newUser.setName(name);
                            newUser.setGoogleId(googleId);
                            newUser.setProfileImageUrl(picture);
                            return userService.createOauthUser(newUser);
                        }
                );

        String jwt = jwtService.generateToken(user);

        response.sendRedirect(
                "http://localhost:5173/oauth-success?token=" + jwt
        );
    }
}

