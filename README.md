# JobTracker ATS

A Spring Boot starter for tracking job applications and checking ATS-friendliness of job descriptions.

## Features
- JWT-based authentication
- MongoDB-backed application storage
- Job posting CRUD
- ATS checker endpoint for JD analysis
- Swagger UI
- Docker support

## Tech Stack
- Java 17
- Spring Boot 3.2.x
- Spring Security
- MongoDB
- Swagger / OpenAPI

## Quick Start

### 1) Run with Maven locally
```bash
mvn spring-boot:run
```

### 2) Run with Docker Compose
```bash
docker compose up --build
```

## Default Accounts
The app seeds two users on first startup:
- admin / adminpass
- alice / alicepass

## API Authentication
Use the login endpoint to get a JWT:

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alicepass"}'
```

Then pass the returned token as:
```bash
Authorization: Bearer <token>
```

## Swagger UI
Open:
```text
http://localhost:8080/swagger-ui.html
```

## ATS Checker
POST `/ats/check`

Example request:
```json
{
  "jd": "We are looking for a Senior Java Developer with Spring Boot experience. Responsibilities include building REST APIs, CI/CD automation, and cloud deployment.",
  "jobTitle": "Senior Java Developer",
  "expectedSkills": ["Java", "Spring", "Docker", "AWS"]
}
```

## Project Structure
```text
src/
  main/
    java/com/example/jobtracker/
      config/
      model/
      repository/
      security/
      service/
      web/
  resources/
    application.yml
    skills.txt
```

## Best Practices Included
- Layered architecture
- Security configuration with JWT
- API documentation via Swagger
- Environment-driven config
- Clear package separation
- Docker-friendly setup
