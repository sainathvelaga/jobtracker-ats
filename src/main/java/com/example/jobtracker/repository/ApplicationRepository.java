package com.example.jobtracker.repository;

import com.example.jobtracker.model.ApplicationEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ApplicationRepository extends MongoRepository<ApplicationEntity, String> {
    List<ApplicationEntity> findByUserId(String userId);
}
