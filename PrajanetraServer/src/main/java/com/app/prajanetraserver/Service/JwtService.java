package com.app.prajanetraserver.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;

    public String generateToken(String userEmail) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userEmail", userEmail);
        return Jwts
                .builder()
                .claims(claims)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(this.getSecretKey())
                .compact();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = this.secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserEmail(String token) {
        return extractClaim(token, claims -> claims.get("userEmail", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllclaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllclaims(String token) {
        return Jwts
                .parser()
                .verifyWith(this.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userEmail = this.extractUserEmail(token);
        return userEmail.equals(userDetails.getUsername()) && !IsTokenExpired(token);
    }

    private boolean IsTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

}
