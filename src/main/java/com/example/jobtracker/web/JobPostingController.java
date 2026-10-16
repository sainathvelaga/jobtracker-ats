package com.example.jobtracker.web;

import com.example.jobtracker.model.JobPosting;
import com.example.jobtracker.repository.JobRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Jobs", description = "Job postings endpoints")
@RestController
@RequestMapping("/jobs")
public class JobPostingController {

    private final JobRepository jobRepository;

    public JobPostingController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Operation(summary = "List all job postings")
    @GetMapping
    public List<JobPosting> list() {
        return jobRepository.findAll();
    }

    @Operation(summary = "Create a job posting")
    @PostMapping
    public JobPosting create(@RequestBody JobPosting jobPosting) {
        return jobRepository.save(jobPosting);
    }

    @Operation(summary = "Get job posting by id")
    @GetMapping("/{id}")
    public ResponseEntity<JobPosting> get(@PathVariable String id) {
        return jobRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
