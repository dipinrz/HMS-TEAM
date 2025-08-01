HMS API Specifications
Base URL
http://localhost:5000/api
Authentication

All endpoints require JWT token in Authorization header: Bearer <token>.
Public endpoints: /auth/login, /auth/register.

Endpoints (Phase 1)
Authentication

POST /auth/register
Description: Register a new user (admin, doctor, patient).
Body: { "email": string, "password": string, "role": "admin|doctor|patient", "name": string }
Response: { "token": string }


POST /auth/login
Description: Log in a user and return JWT.
Body: { "email": string, "password": string }
Response: { "token": string }



Admin Panel

GET /admin/patients
Description: List all patients.
Response: { "patients": [{ "id": number, "name": string, "email": string, "department": string }] }


POST /admin/patients
Description: Create a new patient.
Body: { "name": string, "email": string, "departmentId": number }
Response: { "id": number, "name": string }



Patient Dashboard

GET /patient/profile
Description: Get logged-in patient’s profile.
Response: { "id": number, "name": string, "email": string, "appointments": [{ "doctor": string, "time": string }] }


POST /patient/appointments
Description: Book an appointment.
Body: { "doctorId": number, "time": string }
Response: { "id": number, "doctor": string, "time": string }



Doctor Dashboard

GET /doctor/appointments
Description: List doctor’s appointments.
Response: { "appointments": [{ "id": number, "patient": string, "time": string }] }


POST /doctor/records
Description: Update patient medical record.
Body: { "patientId": number, "diagnosis": string, "prescription": string }
Response: { "message": "Record updated" }



Billing Module

GET /billing/invoices
Description: Get patient’s invoices.
Response: { "invoices": [{ "id": number, "amount": number, "status": "paid|pending" }] }


POST /billing/pay
Description: Initiate payment via Razorpay/Stripe.
Body: { "invoiceId": number, "amount": number }
Response: { "paymentUrl": string }


