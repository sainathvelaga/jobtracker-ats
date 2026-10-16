FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps || npm ci || true
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist/jobtracker-ats-frontend/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
