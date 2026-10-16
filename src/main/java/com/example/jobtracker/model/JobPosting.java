package com.example.jobtracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "jobs")
public class JobPosting {
    @Id
    private String id;
    private String company;
    private String title;
    private String location;
    private String sourceUrl;
    private String description;
    private String employmentType;
    private boolean closed = false;
    private Instant postedAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public boolean isClosed() { return closed; }
    public void setClosed(boolean closed) { this.closed = closed; }

    public Instant getPostedAt() { return postedAt; }
    public void setPostedAt(Instant postedAt) { this.postedAt = postedAt; }
}
