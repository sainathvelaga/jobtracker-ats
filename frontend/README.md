# Frontend for JobTracker ATS

This Angular app provides:
- Login page (calls backend /auth/login)
- Dashboard (lists user applications)
- ATS checker page to paste JD and analyze

To run locally (dev):
1. Install dependencies: npm ci
2. Start: npm start

To build production static assets:
npm run build

To run with Docker:
cd frontend
docker build -t jobtracker-ats-frontend .
# then run nginx container from built image
