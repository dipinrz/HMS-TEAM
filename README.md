Healthcare Management System (HMS)
Project Description
HMS is a web-based platform for hospitals/clinics to manage patients, doctors, appointments, medical records, billing, and notifications. It includes role-based dashboards for admins, doctors, and patients, with secure data handling and payment integration.
Setup Guide
Prerequisites

Node.js (v16+)
PostgreSQL (v13+)
Git
Yarn or npm
Razorpay/Stripe account

Installation

Clone Repository:
git clone https://github.com/dipinrz/HMS.git
cd hms


Backend Setup:

Navigate to backend/.
Install dependencies: npm install.
Create .env:DATABASE_URL=postgresql://user:password@localhost:5432/hms
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret


Run migrations: npx prisma migrate dev.
Start server: npm run start.


Frontend Setup:

Navigate to frontend/.
Install dependencies: npm install.
Start dev server: npm run start.



Deployment

Backend: Deploy on Render/Heroku with PostgreSQL.
Frontend: Deploy on Vercel/Netlify.
CI/CD: Use GitHub Actions (see .github/workflows/).

Project Structure

backend/: Node.js, Express.js, Prisma, PostgreSQL.
frontend/: React, TypeScript, Tailwind CSS.
docs/: API specs, database schema, system design.

Running Locally

Start PostgreSQL.
Run backend: cd backend && npm run start.
Run frontend: cd frontend && npm run start.
Access: http://localhost:3000 (frontend), http://localhost:5000 (backend).
