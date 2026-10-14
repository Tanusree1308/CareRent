# CareRent — Complete Project

## Folder structure
- frontend/ — React + Vite frontend
- backend/ — Express backend/API

## Run backend
cd backend
npm install
node server.js

## Run frontend
cd frontend
npm install
npm run dev

## Deploy both services to Render
1. Push this project to a GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository.
3. Render reads `render.yaml` to create the backend web service and frontend static site. It generates a `JWT_SECRET` for the backend.
4. Wait for both services to finish deploying. Use the frontend URL to open the app and the backend URL plus `/api/health` to check the API.

The frontend currently uses browser `localStorage` for registration, login and demo data; it does not call the backend API yet. Browser data is local to each device and can be cleared, while backend users and rentals are held in memory and reset when the backend restarts. Connect the frontend to the API and use persistent database storage before relying on deployed data.
