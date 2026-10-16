package com.example.jobtracker;

import com.example.jobtracker.model.AppUser;
import com.example.jobtracker.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class JobTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobTrackerApplication.class, args);
    }

    @Bean
    CommandLineRunner demoData(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                AppUser admin = new AppUser();
                admin.setUsername("admin");
                admin.setFullName("Admin User");
                admin.setPassword(new BCryptPasswordEncoder().encode("adminpass"));
                admin.getRoles().add("ROLE_ADMIN");
                userRepository.save(admin);

                AppUser user = new AppUser();
                user.setUsername("alice");
                user.setFullName("Alice Applicant");
                user.setPassword(new BCryptPasswordEncoder().encode("alicepass"));
                user.getRoles().add("ROLE_USER");
                userRepository.save(user);
            }
        };
    }
}
