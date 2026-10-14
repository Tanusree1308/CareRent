# CareRent Backend – Sir Demo Version

This is a simple backend prototype for the CareRent short-term medical equipment rental project.

## What it demonstrates
- Patient and equipment-owner registration
- Email + password login
- Password hashing
- JWT login authentication
- Medical equipment catalogue
- Hospital list
- Short-term rental booking
- Automatic rental-price calculation
- Delivery address
- My Rentals
- Rental status updates

## Very easy setup
1. Install Node.js from https://nodejs.org/
2. Open Command Prompt/Terminal in this folder.
3. Run: `npm install`
4. Run: `npm start`
5. Open this in Chrome: `http://localhost:3000`
6. You should see: `CareRent Backend` and `status: running`.

## Important
This is a classroom/demo prototype. Data is stored in memory, so users and rentals reset when the server is restarted. The secret in `.env.example` must be changed for real deployment. A production system should use a database, HTTPS, secure secret management, stronger authorization, payment integration, hospital verification and inventory controls.
