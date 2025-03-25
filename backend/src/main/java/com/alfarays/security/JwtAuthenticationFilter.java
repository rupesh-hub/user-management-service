package com.alfarays.security;

import com.alfarays.exception.AuthorizationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final TokenService tokenService;
    private static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String AUTH_PATH = "/authentication";
    public static final String ROLES_PATH = "/roles";
    public static final String IMAGE_PATH = "/profile";
    public static final String UPLOADS_PATH = "/uploads";

    public static final List<String> PUBLIC_PATHS = List.of(
            AUTH_PATH,
            ROLES_PATH,
            IMAGE_PATH,
            UPLOADS_PATH
    );
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException {
        try {
            if (isPublicPath(request.getServletPath())) {
                filterChain.doFilter(request, response);
                return;
            }

            Optional<String> token = extractBearerToken(request);
            if (token.isEmpty()) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token is missing !");
                return;
            }

            authenticateUser(token.get(), request);
            filterChain.doFilter(request, response);
        } catch (AuthorizationException e) {
            if (e.getMessage().contains("expired")) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token is expired !");
            } else {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token !");
            }
        } catch (Exception e) {
            log.error("Unexpected error during authentication: {}", e.getMessage());
            sendErrorResponse(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Token is invalid or expired !");
        }
    }

    private void sendErrorResponse(HttpServletResponse response, int statusCode, String message) throws IOException {
        response.setContentType("application/json");
        response.setStatus(statusCode);
        response.getWriter().write(
                String.format("{\"code\": \"%d\", \"message\": \"%s\"}", statusCode, message)
        );
    }

    private Optional<String> extractBearerToken(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(AUTHORIZATION_HEADER))
                .filter(header -> header.startsWith(BEARER_PREFIX))
                .map(header -> header.substring(BEARER_PREFIX.length()));
    }

    private void authenticateUser(String token, HttpServletRequest request) {
        String username = tokenService.extractUsername(token);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (tokenService.isTokenValid(token, username)) {
                var authenticationToken = createAuthenticationToken(userDetails, request);
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
    }

    private Authentication createAuthenticationToken(UserDetails userDetails, HttpServletRequest request) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        return authenticationToken;
    }


    private boolean isPublicPath(String requestPath) {
        return PUBLIC_PATHS.stream()
                .anyMatch(requestPath::contains);
    }
}
