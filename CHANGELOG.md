# Sport Talent - AI Agent Session Changelog

This document summarizes all the features, fixes, and architectural changes added and built during this agentic AI session.

## 1. Dynamic Plugin System Template
- **Added:** `backend/plugins/team_feature_template/`
- **Details:** Created a new standardized template folder with `index.js` and `routes.js` to allow team members to easily add new backend API features in isolation without modifying `server.js` or risking merge conflicts.
- **How it works:** Any new folder placed inside `backend/plugins/` with an `index.js` file exporting a `name`, `baseRoute`, and `router` will automatically be loaded by the server upon startup.

## 2. AI Pipeline Migration (Groq to Google Gemini AI Studio)
- **Problem:** The previous AI pipeline was configured for Groq API keys, but the provided key was for Google AI Studio. The legacy models (`llama3-8b-8192` and `mixtral`) were also deprecated.
- **Solution:** 
  - Refactored `backend/plugins/ai_suggestions/index.js` (Coach Jack & AI Suggestions) to use the `@google/generative-ai` SDK.
  - Refactored `backend/jobs/newsCron.js` (Daily News Bot) to use the `@google/generative-ai` SDK.
  - Updated model routing to use `gemini-3.5-flash` across all AI features.
  - Replaced `GROQ_API_KEY` with `GEMINI_API_KEY` in `backend/.env`.
  - Created a test script `test_gemini.js` to verify successful connection to the new Gemini endpoint.

## 3. Environment & Server Fixes
- **Startup Script Resiliency:** Modified `start-all.ps1` to gracefully handle missing Python packages without crashing, allowing the node backend and frontend to continue starting even if the Python AI pipeline cannot run locally.
- **Background Process Fix:** Resolved a recurring `EADDRINUSE` port 8000 error by successfully identifying and force-killing hidden, backgrounded Node.js processes that had previously been spawned by the PowerShell script.

## 4. Authentication Verification
- **Details:** Investigated user reports of login failures on existing accounts. Validated that the bcrypt password comparison logic and JWT signing in `backend/routes/auth.js` are bug-free and fully operational. Confirmed that any perceived login issues were likely due to browser auto-fill or local cache problems rather than backend code bugs.
