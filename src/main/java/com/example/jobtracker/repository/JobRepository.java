package com.example.jobtracker.repository;

import com.example.jobtracker.model.JobPosting;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<JobPosting, String> {
}
