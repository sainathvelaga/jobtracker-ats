package com.example.jobtracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final javax.crypto.SecretKey secretKey;

    public JwtAuthenticationFilter(Environment env) {
        String secret = env.getProperty("app.jwt.secret", "change-me-to-a-secure-random-key");
        this.secretKey = Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes(StandardCharsets.UTF_8)));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

                String username = claims.getSubject();
                String roles = claims.get("roles", String.class);

                if (username != null && roles != null) {
                    var authorities = Arrays.stream(roles.split(","))
                        .filter(s -> !s.isBlank())
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                    var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
