import { Router } from "express";
import authenticateUser from "../../../middleware/authenticateUser";
import authorizedRoles from "../../../middleware/role";
import validate from "../../../middleware/validate";
import createJobApplicationHandler from "./create";
import {
  createJobApplicationSchema,
  deleteJobApplicantsSchema,
  getJobApplicantsSchema,
  getJobApplicationSchema,
  updateJobApplicationSchema,
  updateJobApplicationStatusSchema,
} from "../../../validationSchema/jobApplication";
import getJobApplicationByIdHandler from "./getById";

import getAllApplicationByUserHandler from "./getAllApplicationByUser";

import getJobApplicantsHandler from "./getAllApplicationById";
import getAllApplicationByEmployerHandler from "./getAllApplicationsByEmployer";
import updateJobApplicationHandler from "./updateJobApplication";
import updateJobStatusHandler from "./updateJobStatus";
import deleteApplicationHandler from "./deleteApplication";
import updateJobApplicationStatusHandler from "./updateJobStatus";

const jobApplicationRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Job Applications
 *   description: Endpoints related to job applications
 */

/**
 * @swagger
 * /api/v1/jobApplication/{jobId}/apply:
 *   post:
 *     summary: Create a job application
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the job to apply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 example: "https://example.com/resume.pdf"
 *               coverLetter:
 *                 type: string
 *                 example: "I'm passionate about this role..."
 *     responses:
 *       201:
 *         description: Job application created
 */

/**
 * @swagger
 * /api/v1/jobApplication/employer/{applicationId}:
 *   get:
 *     summary: Get a job application by ID (Employer)
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job application
 *     responses:
 *       200:
 *         description: Application details retrieved
 */

/**
 * @swagger
 * /api/v1/jobApplication/employer:
 *   get:
 *     summary: Get all job applications for the employer
 *     tags: [Job Applications]
 *     responses:
 *       200:
 *         description: List of job applications
 */

/**
 * @swagger
 * /api/v1/jobApplication/{jobId}/applications:
 *   get:
 *     summary: Get all applicants for a specific job
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job
 *     responses:
 *       200:
 *         description: List of job applicants
 */

/**
 * @swagger
 * /api/v1/jobApplication/:
 *   get:
 *     summary: Get all applications by the authenticated job seeker
 *     tags: [Job Applications]
 *     responses:
 *       200:
 *         description: List of jobseeker's applications
 */

/**
 * @swagger
 * /api/v1/jobApplication/updateApplication/{id}:
 *   patch:
 *     summary: Update a job application (Job Seeker)
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resume
 *             properties:
 *               resume:
 *                 type: string
 *                 example: "https://example.com/updated_resume.pdf"
 *               coverLetter:
 *                 type: string
 *                 example: "Updated cover letter..."
 *     responses:
 *       200:
 *         description: Application updated
 */

/**
 * @swagger
 * /api/v1/jobApplication/updateStatus/{jobApplicationId}:
 *   patch:
 *     summary: Update status of a job application (Employer)
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: jobApplicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, accepted, rejected]
 *                 example: reviewed
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/v1/jobApplication/delete/{jobApplicationId}:
 *   delete:
 *     summary: Delete a job application (Job Seeker)
 *     tags: [Job Applications]
 *     parameters:
 *       - in: path
 *         name: jobApplicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job application
 *     responses:
 *       200:
 *         description: Job application deleted
 */


jobApplicationRoutes.post(
  "/:jobId/apply",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(createJobApplicationSchema),
  createJobApplicationHandler
);

jobApplicationRoutes.get(
  "/employer/:applicationId",
  authenticateUser,
  authorizedRoles("employer"),
  validate(getJobApplicationSchema),
  getJobApplicationByIdHandler
);

//get all applications by employer
jobApplicationRoutes.get(
  "/employer",
  authenticateUser,
  authorizedRoles("employer"),
  getAllApplicationByEmployerHandler
);
 
//get all appplicants for job handler
jobApplicationRoutes.get(
  "/:jobId/applications",
  authenticateUser,
  authorizedRoles("employer"),
  validate(getJobApplicantsSchema),
  getJobApplicantsHandler
);

//get all application by user handler
jobApplicationRoutes.get(
  "/",
  authenticateUser,
  authorizedRoles("jobseeker"),
  getAllApplicationByUserHandler
);

//update job Application
jobApplicationRoutes.patch(
  "/updateApplication/:id",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(updateJobApplicationSchema),
  updateJobApplicationHandler
);

//update job Application Status
jobApplicationRoutes.patch(
  "/updateStatus/:jobApplicationId",
  authenticateUser,
  authorizedRoles("employer"),
  validate(updateJobApplicationStatusSchema),
  updateJobApplicationStatusHandler
);

//delete job application
jobApplicationRoutes.delete(
  "/delete/:jobApplicationId",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(deleteJobApplicantsSchema),
  deleteApplicationHandler
);

export default jobApplicationRoutes;
