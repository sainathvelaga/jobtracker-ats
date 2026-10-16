package com.example.jobtracker.model;

import java.util.List;
import java.util.Map;

public class AtsResponse {
    private int score;
    private List<Issue> issues;
    private List<String> suggestions;
    private List<String> detectedSkills;
    private Map<String, Object> details;

    public AtsResponse(int score, List<Issue> issues, List<String> suggestions, List<String> detectedSkills, Map<String, Object> details) {
        this.score = score;
        this.issues = issues;
        this.suggestions = suggestions;
        this.detectedSkills = detectedSkills;
        this.details = details;
    }

    public static class Issue {
        private String severity;
        private String message;

        public Issue() {}

        public Issue(String severity, String message) {
            this.severity = severity;
            this.message = message;
        }

        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public List<Issue> getIssues() { return issues; }
    public void setIssues(List<Issue> issues) { this.issues = issues; }

    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }

    public List<String> getDetectedSkills() { return detectedSkills; }
    public void setDetectedSkills(List<String> detectedSkills) { this.detectedSkills = detectedSkills; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
