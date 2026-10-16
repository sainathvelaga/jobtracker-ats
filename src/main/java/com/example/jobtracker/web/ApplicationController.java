package com.example.jobtracker.web;

import com.example.jobtracker.model.ApplicationEntity;
import com.example.jobtracker.repository.ApplicationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Tag(name = "Applications", description = "Job application endpoints")
@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    public ApplicationController(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Operation(summary = "List applications for the logged-in user")
    @GetMapping
    public List<ApplicationEntity> list(Authentication authentication) {
        return applicationRepository.findByUserId(authentication.getName());
    }

    @Operation(summary = "Create a new application")
    @PostMapping
    public ApplicationEntity create(@RequestBody ApplicationEntity application, Authentication authentication) {
        application.setUserId(authentication.getName());
        application.setAppliedAt(Instant.now());
        application.setUpdatedAt(Instant.now());
        return applicationRepository.save(application);
    }

    @Operation(summary = "Get application by id")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationEntity> get(@PathVariable String id, Authentication authentication) {
        Optional<ApplicationEntity> optionalApplication = applicationRepository.findById(id);
        if (optionalApplication.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ApplicationEntity application = optionalApplication.get();
        if (!application.getUserId().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(application);
    }

    @Operation(summary = "Update application status")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationEntity> updateStatus(@PathVariable String id,
                                                        @RequestBody StatusRequest request,
                                                        Authentication authentication) {
        Optional<ApplicationEntity> optionalApplication = applicationRepository.findById(id);
        if (optionalApplication.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ApplicationEntity application = optionalApplication.get();
        if (!application.getUserId().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

        application.setStatus(request.status());
        application.setUpdatedAt(Instant.now());
        return ResponseEntity.ok(applicationRepository.save(application));
    }

    public record StatusRequest(String status) {}
}
