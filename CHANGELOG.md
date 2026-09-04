# Sport Talent Platform - Comprehensive Feature Log

This document serves as a complete record of all features, architectures, and systems built and integrated into the Sport Talent project.

## 1. Core Architecture & Tech Stack
- **Frontend:** React.js built with Vite, utilizing modern React hooks, TailwindCSS for styling, and `react-globe.gl` (Three.js) for 3D interactive visualizations.
- **Backend:** Node.js with Express.js framework.
- **Database:** SQLite database managed via Prisma ORM for type-safe queries.
- **AI/Media Pipeline:** Python 3.12 powered by FastAPI and Uvicorn. Integrates Computer Vision and Machine Learning using OpenCV (`opencv-python`), MediaPipe for pose estimation, Ultralytics (YOLO) for object detection, and PyTorch for deep learning.
- **AI LLM:** Google Gemini (`@google/generative-ai`) for natural language processing, chatbot interactions, and news generation.
- **Containerization:** Docker Compose setup available for containerized deployments.

## 2. Authentication & Security
- **JWT-Based Auth:** Secure user registration and login endpoints.
- **Password Hashing:** Passwords are encrypted using `bcryptjs` before being stored in the database.
- **Protected Routes:** Middleware to verify JWT tokens and secure sensitive API endpoints.
- **CORS & Helmet:** Configured to allow secure cross-origin resource sharing and HTTP header protections.

## 3. Athlete Profile & Assessments
- **Physical Metrics Tracking:** Athletes can take assessments to generate scores out of 100 for core attributes:
  - Speed
  - Technique
  - Agility
  - Endurance
  - Strength
- **Radar Metrics:** Backend storage and frontend visualization (Radar Charts) of athlete physical performance.

## 4. Artificial Intelligence Pipeline (Google Gemini)
The entire AI ecosystem is powered by Google's Generative AI (`gemini-3.5-flash`).
- **Coach Jack (AI Chatbot):** An elite private athletic coach, registered dietitian, and sports psychologist. Athletes can chat with Jack for personalized advice. Chat history is preserved in the database.
- **AI Talent Suggestions:** Generates personalized sport recommendations and specific actionable improvement tips based on the athlete's exact radar metric scores.
- **News Bot Cron Job (`newsCron.js`):** An automated background job that runs daily at 7:00 AM. It uses Gemini to act as a sports journalist, generating realistic daily sports news articles, pairing them with high-quality Pexels images, and posting them directly to the social feed.

## 5. Social Feed & Engagement
- **Feed Posts:** A central feed where news articles and potentially user updates are displayed.
- **System Authors:** The backend is capable of generating content under system-level authors (e.g., the News Bot).

## 6. Dynamic Plugin System
- **Plug-and-Play Backend Architecture:** The backend features a dynamic plugin loader.
- **Hot-loading Routes:** Any new folder placed inside `backend/plugins/` containing an `index.js` file (with `baseRoute` and `router`) is automatically detected and mounted by the Express server on startup.
- **Team Feature Template:** Includes a `team_feature_template` to allow team members to develop new API features in complete isolation without causing merge conflicts in `server.js`.

## 7. Scripts & Tooling
- **`start-all.ps1`:** A unified PowerShell startup script that automatically launches the Vite frontend and Node.js backend simultaneously, handling environment errors gracefully.
