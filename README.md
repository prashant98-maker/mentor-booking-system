# Mentor Booking System

A React-based mentor booking application where students can explore mentors and manage bookings, while mentors can manage availability and sessions.

## Technologies Used

- React
- Vite
- React Router
- Tailwind CSS
- JavaScript

## Features

- Role-based demo experience for students and mentors
- Student and mentor dashboards
- Mentor availability and session pages
- Student booking pages
- Profile page with profile photo selection
- Responsive navigation

## Setup Instructions

Requirements: Node.js and npm.

1. Clone or download this repository.
2. Open a terminal in the project directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Create a production build:

   ```bash
   npm run build
   ```

## Authentication and Data Limitations

The current login is a demo flow, not production authentication. Do not use real passwords or sensitive personal information.

The profile photo is stored locally in the browser. It is not uploaded to a server and will not automatically appear on another device.

Backend authentication, server-side data persistence, email confirmations, reminders, and production-grade booking concurrency must be verified or implemented before claiming them as complete.

## Project Status

Frontend demo version. Backend integration and deployment are planned.

## Deployment

The frontend can be deployed as a static site on Render. The publish directory is `dist`, and the build command is:

```bash
npm install && npm run build
```

## Known Limitations

- Demo login does not verify email and password.
- Browser-local profile photos are not shared between devices.
- Features requiring a backend or email service depend on backend integration.
