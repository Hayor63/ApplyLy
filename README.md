# Applyly Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6.3-blue)](https://www.mongodb.com/)

This repository contains the **backend of Applyly**, a job-searching platform that helps users find and manage job applications efficiently. It provides APIs for user authentication, job listings, applications, and more.

---

## Features

- **User Authentication:** Sign up, log in, and JWT-based authentication.  
- **Job Listings:** CRUD operations for jobs, categories, and companies.  
- **Applications:** Submit, track, and update job applications.  
- **Admin Features:** Manage users, jobs, and applications.  
- **Secure:** Role-based authorization and input validation.  

---

## Technologies Used

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Authentication:** JWT (JSON Web Tokens)  
- **Validation:** Zod / Joi  
- **Middleware & Logging:** Morgan, CORS, Rate-limiting  

---

## Installation

1. Clone the repository:  
```bash
git clone https://github.com/your-username/applyly-backend.git
```
2. Navigate to the project directory:
```bash
cd applyly-backend
```
3. install dependencies:
```bash
npm install
```
4. Set up environment variables (create a .env file):
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
5. Start the server:
```bash
npm run dev
```
## API Endpoints

#### Authentication

- **POST /api/v1/users/create** - create a new user
- **POST /api/v1/auth/login** - User login, returns JWT token

#### Jobs Listing

- **GET /api/v1/jobListing/** - list all jobs
- **POST /api/v1/jobListing/create** - create a new job(admin only)
- **GET /api/v1/jobListing/:id** - Get job details
- **PATCH /api/v1/jobListing/:id** - update job(admin only)
- **DELETE /api/v1/jobListing/:id** - delete job(admin only)

#### Jobs Application

- **GET /api/v1/jobApplication/** - get all jobs
- **POST /api/v1/jobApplication/:jobId/apply** - apply for a job
- **GET /api/v1/jobApplication/:id** - Get application details
- **PATCH /api/v1/jobapplication/updateApplication/:id** - update job(admin only)
- **DELETE /api/v1/jobApplication/:appicationId** - delete job(admin only)

  #### Employer

- **GET /api/v1/employer/** - create an employer profile
- **POST /api/v1/employer/:id** - Get employer by id
- **DELETE /api/v1/employer/:id** - Delete employer
- **PATCH /api/v1/employer/:id** - update

  #### Applicant

- **GET /api/v1/applicant/create** - create a job seeeker profile
- **POST /api/v1/applicant/getjob/:id** - Get job seeker by id
- **DELETE /api/v1/applicant/:id** - Delete employer
- **PATCH /api/v1/applicant/update-profile** - update

## Contributing

Feel free to fork the repository, create issues, and submit pull requests. Contributions are welcome!

  
