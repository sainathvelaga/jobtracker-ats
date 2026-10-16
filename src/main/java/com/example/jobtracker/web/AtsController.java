package com.example.jobtracker.web;

import com.example.jobtracker.model.AtsRequest;
import com.example.jobtracker.model.AtsResponse;
import com.example.jobtracker.service.AtsCheckerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "ATS", description = "Applicant tracking system JD analysis")
@RestController
@RequestMapping("/ats")
public class AtsController {

    private final AtsCheckerService atsCheckerService;

    public AtsController(AtsCheckerService atsCheckerService) {
        this.atsCheckerService = atsCheckerService;
    }

    @Operation(summary = "Analyze a job description for ATS friendliness")
    @PostMapping("/check")
    public ResponseEntity<AtsResponse> check(@RequestBody AtsRequest request) {
        if (request == null || request.getJd() == null || request.getJd().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        AtsResponse response = atsCheckerService.analyze(request.getJd(), request.getJobTitle(), request.getExpectedSkills());
        return ResponseEntity.ok(response);
    }
}
