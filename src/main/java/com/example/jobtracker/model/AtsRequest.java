package com.example.jobtracker.model;

import java.util.List;

public class AtsRequest {
    private String jd;
    private String jobTitle;
    private List<String> expectedSkills;

    public String getJd() { return jd; }
    public void setJd(String jd) { this.jd = jd; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public List<String> getExpectedSkills() { return expectedSkills; }
    public void setExpectedSkills(List<String> expectedSkills) { this.expectedSkills = expectedSkills; }
}
