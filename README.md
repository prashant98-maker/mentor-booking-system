# MentorHub — Mentor Booking System

MentorHub helps students discover mentors, explore available sessions, and manage bookings. Mentors can manage their profiles, availability, and mentoring sessions.

## Features

### Student
- Student dashboard
- Browse mentors and view mentor details
- Explore and manage bookings
- View profile information

### Mentor
- Mentor dashboard
- Manage mentor profile
- Create and manage availability
- Manage mentoring sessions

### Authentication
- Signup and login pages
- Email verification and resend verification pages
- Role-based route protection

### User Interface
- Responsive design
- Reusable React components
- React Router navigation
- Tailwind CSS styling

> Test features in the deployed application before considering them production-ready.

## Technology Stack

**Frontend:** React, Vite, React Router, Tailwind CSS, JavaScript

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer

## Project Structure

```text
mentor-booking-system/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   └── services/
├── server/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── server.js
├── index.html
├── package.json
└── README.md

Getting Started

Requirements

- Node.js
- npm

Run the Frontend

Run these commands from the project root:

npm install
npm run dev

Create a production build:

npm run build

Preview the production build:

npm run preview

Run the Backend

Open a separate terminal and run these commands from the project root:

cd server
npm install
npm run dev

Configure backend environment variables using "server/.env.example" as a reference. Keep your actual "server/.env" private.

Deployment

Frontend

- Build command: "npm install && npm run build"
- Publish directory: "dist"

Backend

Deploy the Node.js backend separately and configure the required environment variables in your hosting provider's dashboard.

Configure the frontend API base URL to point to the deployed backend where required.

Security

- Never commit ".env" files, passwords, API keys, database credentials, or JWT secrets.
- Keep backend secrets out of frontend code.
- Use HTTPS and secure production configuration.
- Test authentication and role-based authorization.

Known Considerations

- Test signup, login, and email verification end to end.
- Verify that bookings and mentor availability persist correctly.
- Test booking conflicts and authorization.
- Email notifications and reminders depend on working email delivery and scheduler configuration.
- Verify profile photo storage and cross-device behavior.
- A successful frontend build does not guarantee that backend functionality works correctly.

Project Status

MentorHub includes a React frontend and a separate Express/MongoDB backend. Production readiness depends on end-to-end testing, deployment configuration, email delivery, and booking behavior.
