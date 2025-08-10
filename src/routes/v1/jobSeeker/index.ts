import { Router } from "express";
import validate from "../../../middleware/validate";
import createJobSeekerProfileHandler from "./create";
import {
  getJobSeekerByIdSchema,
  jobSeekerSchema,
  updateJobSeekerProfileSchema,
} from "../../../validationSchema/jobSeeker";
import deleteJobSeekerProfileHandler from "./delete";
import getJobProfileByIdHandler from "./getById";
import updateJobProfileHandler from "./update";
import authenticateUser from "../../../middleware/authenticateUser";
import authorizedRoles from "../../../middleware/role";

const applicantRoutes = Router();


/**
 * @swagger
 * /api/v1/applicant/create:
 *   post:
 *     summary: Create a job seeker profile
 *     tags: [Job Seeker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobSeekerProfileInput'
 *     responses:
 *       201:
 *         description: Job seeker profile created
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/applicant/delete:
 *   delete:
 *     summary: Delete job seeker profile
 *     tags: [Job Seeker]
 *     responses:
 *       200:
 *         description: Job seeker profile deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /api/v1/applicant/getjob/{id}:
 *   get:
 *     summary: Get job seeker profile by ID
 *     tags: [Job Seeker]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job Seeker ID
 *     responses:
 *       200:
 *         description: Job seeker profile retrieved
 *       404:
 *         description: Profile not found
 */

/**
 * @swagger
 * /api/v1/applicant/update-profile:
 *   patch:
 *     summary: Update job seeker profile
 *     tags: [Job Seeker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobSeekerProfileInput'
 *     responses:
 *       200:
 *         description: Job seeker profile updated
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobSeekerProfileInput:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *         bio:
 *           type: string
 *         location:
 *           type: string
 *         resume:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *         experiences:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               company:
 *                 type: string
 *               location:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *         education:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: string
 *               degree:
 *                 type: string
 *               fieldOfStudy:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               grade:
 *                 type: string
 *         socialLinks:
 *           type: object
 *           properties:
 *             portfolio:
 *               type: string
 *               format: url
 *             github:
 *               type: string
 *               format: url
 *             twitter:
 *               type: string
 *               format: url
 *             linkedin:
 *               type: string
 *               format: url
 *             instagram:
 *               type: string
 *               format: url
 *     UpdateJobSeekerProfileInput:
 *       allOf:
 *         - $ref: '#/components/schemas/JobSeekerProfileInput'
 */



// Create job seeker profile
applicantRoutes.post(
  "/create",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(jobSeekerSchema),
  createJobSeekerProfileHandler
);

// Delete job seeker profile
applicantRoutes.delete(
  "/delete",
  authenticateUser,
  authorizedRoles("jobseeker"),
  deleteJobSeekerProfileHandler
);

// Get job seeker profile by ID
applicantRoutes.get(
  "/getjob/:id",
  validate(getJobSeekerByIdSchema),
  getJobProfileByIdHandler
);

// Update job seeker profile
applicantRoutes.patch(
  "/update-profile",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(updateJobSeekerProfileSchema),
  updateJobProfileHandler
);

export default applicantRoutes;
