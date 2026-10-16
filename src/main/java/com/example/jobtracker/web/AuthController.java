package com.example.jobtracker.web;

import com.example.jobtracker.model.AppUser;
import com.example.jobtracker.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final javax.crypto.SecretKey signingKey;
    private final long expirationMs;

    public AuthController(UserRepository userRepository, Environment env) {
        this.userRepository = userRepository;
        String secret = env.getProperty("app.jwt.secret", "change-me-to-a-secure-random-key");
        this.signingKey = Keys.hmacShaKeyFor(Base64.getEncoder().encode(secret.getBytes(StandardCharsets.UTF_8)));
        this.expirationMs = Long.parseLong(env.getProperty("app.jwt.expirationMs", "86400000"));
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginRequest request) {
        Optional<AppUser> optionalUser = userRepository.findByUsername(request.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        AppUser user = optionalUser.get();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String roles = String.join(",", user.getRoles());
        String token = Jwts.builder()
            .setSubject(user.getUsername())
            .claim("roles", roles)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact();

        return ResponseEntity.ok(Map.of("token", token));
    }
}
