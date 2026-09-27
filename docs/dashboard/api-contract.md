# Dashboard — API Contracts & Schemas

This document defines the REST API endpoints and JSON payloads supporting the Dashboard module.

---

## 1. `GET /api/v1/dashboard/profile`

Fetches candidate profile, target role, timeline, and current onboarding status.

### Request Headers
```http
Authorization: Bearer <clerk_session_token>
```

### Response `200 OK`
```json
{
  "userId": "user_2aB9...xyz",
  "fullName": "Saurav Singh",
  "targetRole": "Senior Software Engineer",
  "experienceLevel": "6-9",
  "timelineWeeks": 4,
  "targetCompanies": ["Google", "Meta", "Amazon"],
  "onboardingCompleted": true,
  "readinessScore": 68,
  "weeklyGoalHours": 10,
  "completedHours": 4.5,
  "dailyStreak": 3
}
```

---

## 2. `POST /api/v1/dashboard/onboarding`

Submits initial onboarding preferences to generate a personalized curriculum.

### Request Payload
```json
{
  "targetRole": "Senior Software Engineer",
  "experienceLevel": "6-9",
  "timelineWeeks": 4,
  "targetCompanies": ["Google", "Meta"],
  "jobDescriptionText": "Looking for a Senior Backend Engineer experienced in distributed systems..."
}
```

### Response `201 Created`
```json
{
  "status": "success",
  "planId": "plan_991823",
  "message": "Onboarding completed. Plan generation initiated.",
  "nextStepUrl": "/dashboard/plan-ready"
}
```

---

## 3. `POST /api/v1/dashboard/resume-upload`

Uploads candidate's resume for background parsing and question generation.

### Request
- `Content-Type: multipart/form-data`
- Body: `file: <binary_pdf>`

### Response `202 Accepted`
```json
{
  "uploadId": "res_881923",
  "fileName": "saurav_resume_2026.pdf",
  "fileSizeBytes": 142850,
  "status": "processing",
  "extractedQuestionsUrl": "/api/v1/dashboard/resume-questions?uploadId=res_881923"
}
```
