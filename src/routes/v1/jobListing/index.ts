import { Router } from "express";
import authorizedRoles from "../../../middleware/role";
import authenticateUser from "../../../middleware/authenticateUser";
import validate from "../../../middleware/validate";
import {
  getAllJobListingByIdSchema,
  getJobListingByIdSchema,
  getJobRecommendationsSchema,
  jobFiltersSchema,
  jobListingSchema,
  updateJobListing,
  updateJobListingStatusSchema,
} from "../../../validationSchema/jobListing";
import createJobListingHandler from "./create";
import getJobByIdHandler from "./getJobById";
import fetchAllJobsHandler from "./getAllJobs";
import updateJobListingHandler from "./update";
import filterJobListingsHandler from "./filterJobs";
import getAllJobsByIdHandler from "./getAllJobsById";
import getJobRecommendationsHandler from "./getJobRecommendation";
import deleteJobListingHandler from "./delete";
import { deleteEmployerByIdSchema } from "../../../validationSchema/employer";
import updateJobListingStatusHandler from "./updateJobListingStatus";

const jobListingRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Job Listings
 *   description: Job listings management for employers and job seekers
 */

/**
 * @swagger
 * /api/v1/jobListing/create:
 *   post:
 *     summary: Create a job listing
 *     tags: [Job Listings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobListing'
 *     responses:
 *       201:
 *         description: Job listing created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/jobListing/{id}/get:
 *   get:
 *     summary: Get a job listing by ID
 *     tags: [Job Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job listing ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job listing details
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/v1/jobListing:
 *   get:
 *     summary: Get all job listings
 *     tags: [Job Listings]
 *     responses:
 *       200:
 *         description: List of job listings
 */

/**
 * @swagger
 * /api/v1/jobListing/{id}:
 *   patch:
 *     summary: Update a job listing
 *     tags: [Job Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job listing ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobListing'
 *     responses:
 *       200:
 *         description: Job listing updated
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * /api/v1/jobListing/{jobListingId}/status:
 *   patch:
 *     summary: Update status of a job Listing (Employer)
 *     tags: [Job Listings]
 *     parameters:
 *       - in: path
 *         name: jobListingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the job Listing
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
 *                 enum: [open, closed]
 *                 example: open
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @swagger
 * /api/v1/jobListing/filter:
 *   get:
 *     summary: Filter job listings
 *     tags: [Job Listings]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *       - in: query
 *         name: workMode
 *         schema:
 *           type: string
 *           enum: [remote, on-site, hybrid]
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [junior, mid, senior]
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: minSalary
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxSalary
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filtered job listings
 */

/**
 * @swagger
 * /api/v1/jobListing/employer/{employerId}:
 *   get:
 *     summary: Get all jobs by employer ID
 *     tags: [Job Listings]
 *     parameters:
 *       - name: employerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs by the employer
 */

/**
 * @swagger
 * /api/v1/jobListing/recommendations:
 *   get:
 *     summary: Get job recommendations for job seekers
 *     tags: [Job Listings]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommended job listings
 */

/**
 * @swagger
 * /api/v1/jobListing/{id}:
 *   delete:
 *     summary: Delete a job listing
 *     tags: [Job Listings]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Job listing ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job listing deleted
 *       404:
 *         description: Job not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobListing:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - salary
 *         - status
 *         - workMode
 *         - experienceLevel
 *         - jobType
 *         - skills
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         salary:
 *           type: number
 *         isFilled:
 *           type: boolean
 *         status:
 *           type: string
 *           enum: [open, closed]
 *         workMode:
 *           type: string
 *           enum: [remote, on-site, hybrid]
 *         experienceLevel:
 *           type: string
 *           enum: [junior, mid, senior]
 *         jobType:
 *           type: string
 *           enum: [full-time, part-time, contract]
 *         skills:
 *           type: array
 *           items:
 *             type: string
 */

jobListingRoutes.post(
  "/create",
  authenticateUser,
  authorizedRoles("employer"),
  validate(jobListingSchema),
  createJobListingHandler
);

jobListingRoutes.get(
  "/:id/get",
  authenticateUser,
  authorizedRoles("employer", "jobSeeker"),
  validate(getJobListingByIdSchema),
  getJobByIdHandler
);

//get all jobs
jobListingRoutes.get("/", authenticateUser, fetchAllJobsHandler);

//update job listing
jobListingRoutes.patch(
  "/:id",
  authenticateUser,
  authorizedRoles("employer"),
  validate(updateJobListing),
  updateJobListingHandler
);

//update job listing status
jobListingRoutes.patch(
  "/:jobListingId/status",
  authenticateUser,
  authorizedRoles("employer"),
  validate(updateJobListingStatusSchema),
  updateJobListingStatusHandler
);

//filter jobs
jobListingRoutes.get(
  "/filter",
  authenticateUser,
  validate(jobFiltersSchema),
  filterJobListingsHandler
);

//get all jobs by Id
jobListingRoutes.get(
  "/employer/:employerId",
  authenticateUser,
  authorizedRoles("employer"),
  validate(getAllJobListingByIdSchema),
  getAllJobsByIdHandler
);

jobListingRoutes.get(
  "/recommendations",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(getJobRecommendationsSchema),
  getJobRecommendationsHandler
);

//delete
jobListingRoutes.delete(
  "/:id",
  authenticateUser,
  authorizedRoles("employer"),
  validate(deleteEmployerByIdSchema),
  deleteJobListingHandler
);

export default jobListingRoutes;
