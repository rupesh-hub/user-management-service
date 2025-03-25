package com.alfarays.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Component
public class TokenService {

    @Value("${application.security.token.secret_key}")
    private String SECRET_KEY;

    @Value("${application.security.token.expiration}")
    private long EXPIRATION_TIME;

    /**
     * Generates a JWT token with the provided claims and user details.
     *
     * @param claims      Custom claims to include in the token.
     * @param userDetails The user details for whom the token is generated.
     * @return The generated JWT token.
     */
    public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .setAudience("alfarays-api")
                .claim("authorities",
                        userDetails.getAuthorities()
                                .stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
                )
                .signWith(signKey())
                .compact();
    }

    /**
     * Extracts the username from the JWT token.
     *
     * @param token The JWT token.
     * @return The username extracted from the token.
     */
    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    /**
     * Checks if the JWT token is expired.
     *
     * @param token The JWT token.
     * @return True if the token is expired, false otherwise.
     */
    public boolean isTokenExpired(String token) {
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    /**
     * Validates the JWT token against the provided username.
     *
     * @param token    The JWT token.
     * @param username The username to validate against.
     * @return True if the token is valid, false otherwise.
     */
    public boolean isTokenValid(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);
    }

    /**
     * Extracts a specific claim from the JWT token.
     *
     * @param token        The JWT token.
     * @param claimResolver A function to resolve the desired claim from the token's claims.
     * @return The resolved claim.
     */
    private <T> T extractClaims(String token, Function<Claims, T> claimResolver) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signKey())
                .build()
                .parseClaimsJws(token) // Use parseClaimsJws for signed JWTs
                .getBody();
        return claimResolver.apply(claims);
    }

    /**
     * Generates the signing key from the base64-encoded secret key.
     *
     * @return The signing key.
     */
    private Key signKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}