package com.example.jobtracker.service;

import com.example.jobtracker.model.AtsResponse;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AtsCheckerService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b");
    private static final Pattern PHONE_PATTERN = Pattern.compile("\\b(\\+?\\d{1,3}[\\s.-]?)?(\\(?\\d{2,4}\\)?[\\s.-]?)?\\d{3,4}[\\s.-]?\\d{3,4}\\b");
    private static final Pattern BULLET_PATTERN = Pattern.compile("(?m)^\\s*[-•*]\\s+");
    private static final Pattern SECTION_PATTERN = Pattern.compile("(?i)\\b(responsibilit(?:y|ies)|requirement(?:s)?|qualification(?:s)?|about|what you will do|what you'll do)\\b");
    private static final Pattern TABLE_PATTERN = Pattern.compile("\\|");
    private static final Pattern ALL_CAPS_PATTERN = Pattern.compile("\\b[A-Z]{3,}\\b");

    private final List<String> skillCatalog;

    public AtsCheckerService() {
        this.skillCatalog = loadSkills();
    }

    private List<String> loadSkills() {
        try {
            var resource = new ClassPathResource("skills.txt");
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                return reader.lines()
                    .map(String::trim)
                    .filter(line -> !line.isBlank())
                    .collect(Collectors.toList());
            }
        } catch (Exception ex) {
            return List.of(
                "Java", "Spring", "Spring Boot", "Angular", "Docker", "Kubernetes",
                "MongoDB", "Oracle", "SQL", "REST", "Microservices", "AWS"
            );
        }
    }

    public AtsResponse analyze(String jd, String jobTitle, List<String> expectedSkills) {
        String text = (jd == null) ? "" : jd.trim();

        List<AtsResponse.Issue> issues = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        Map<String, Object> details = new HashMap<>();

        int wordCount = countWords(text);
        details.put("wordCount", wordCount);

        if (wordCount < 80) {
            issues.add(new AtsResponse.Issue("WARN", "Job description is very short. Add responsibilities, requirements, and company context."));
            suggestions.add("Add more detail about responsibilities and required skills. Aim for 150–600 words.");
        }

        boolean hasSection = SECTION_PATTERN.matcher(text).find();
        if (!hasSection) {
            issues.add(new AtsResponse.Issue("INFO", "No clear headings like Responsibilities or Requirements were found."));
            suggestions.add("Use clear headings such as Responsibilities, Requirements, Qualifications, and About the Company.");
        }

        boolean hasBullets = BULLET_PATTERN.matcher(text).find();
        if (!hasBullets) {
            issues.add(new AtsResponse.Issue("INFO", "No bullet points detected. ATS-friendly JDs are easier to parse with bullet lists."));
            suggestions.add("Use simple bulleted lists instead of long paragraphs for responsibilities and requirements.");
        }

        boolean hasEmail = EMAIL_PATTERN.matcher(text).find();
        boolean hasPhone = PHONE_PATTERN.matcher(text).find();
        if (hasEmail || hasPhone) {
            issues.add(new AtsResponse.Issue("WARN", "Contact details were detected in the job description text."));
            suggestions.add("Remove contact details from the JD for ATS-friendly parsing; keep them in a separate contact field.");
        }

        if (TABLE_PATTERN.matcher(text).find()) {
            issues.add(new AtsResponse.Issue("WARN", "Table-like formatting or pipe characters were detected."));
            suggestions.add("Avoid tables and pipe-delimited formatting; keep the JD as plain text with bullets.");
        }

        int capsCount = 0;
        var capsMatcher = ALL_CAPS_PATTERN.matcher(text);
        while (capsMatcher.find()) {
            capsCount++;
        }
        details.put("capsCount", capsCount);
        if (capsCount > 5) {
            issues.add(new AtsResponse.Issue("INFO", "A high number of all-caps words were detected."));
            suggestions.add("Use title case or sentence case instead of excessive ALL-CAPS formatting.");
        }

        List<String> detectedSkills = detectSkills(text);
        details.put("detectedSkills", detectedSkills);

        if (expectedSkills != null && !expectedSkills.isEmpty()) {
            int matchedSkills = 0;
            for (String expected : expectedSkills) {
                if (detectedSkills.stream().anyMatch(skill -> skill.equalsIgnoreCase(expected)
                    || skill.toLowerCase().contains(expected.toLowerCase())
                    || expected.toLowerCase().contains(skill.toLowerCase()))) {
                    matchedSkills++;
                }
            }
            double matchPercent = (double) matchedSkills / expectedSkills.size() * 100.0;
            details.put("matchPercent", Math.round(matchPercent * 100.0) / 100.0);

            if (matchPercent < 60.0) {
                issues.add(new AtsResponse.Issue("WARN", "Expected skills are underrepresented in the JD."));
                suggestions.add("Add the most important skills explicitly: " + String.join(", ", expectedSkills));
            }
        }

        int score = calculateScore(wordCount, hasSection, hasBullets, detectedSkills, issues);
        details.put("scoreComponents", Map.of(
            "wordCount", wordCount,
            "hasSection", hasSection,
            "hasBullets", hasBullets,
            "detectedSkills", detectedSkills.size()
        ));

        return new AtsResponse(score, issues, suggestions, detectedSkills, details);
    }

    private int calculateScore(int wordCount, boolean hasSection, boolean hasBullets, List<String> detectedSkills, List<AtsResponse.Issue> issues) {
        int score = 40;

        if (wordCount >= 80 && wordCount <= 600) score += 20;
        else if (wordCount > 600) score += 10;

        if (hasSection) score += 15;
        if (hasBullets) score += 15;
        score += Math.min(20, detectedSkills.size() * 3);

        for (AtsResponse.Issue issue : issues) {
            if ("WARN".equalsIgnoreCase(issue.getSeverity())) {
                score -= 8;
            } else if ("INFO".equalsIgnoreCase(issue.getSeverity())) {
                score -= 4;
            }
        }

        return Math.max(0, Math.min(100, score));
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        return text.trim().split("\\s+").length;
    }

    private List<String> detectSkills(String text) {
        String normalizedText = text.toLowerCase();
        LinkedHashSet<String> found = new LinkedHashSet<>();

        for (String skill : skillCatalog) {
            String lowerSkill = skill.toLowerCase();
            if (normalizedText.contains(lowerSkill) || normalizedText.contains(lowerSkill.replace(" ", ""))) {
                found.add(skill);
            }
        }

        return new ArrayList<>(found);
    }
}
