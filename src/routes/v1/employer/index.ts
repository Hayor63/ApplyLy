import { Router } from "express";
import validate from "../../../middleware/validate";
import {
  createEmployerSchema,
  deleteEmployerByIdSchema,
  getEmployerByIdSchema,
  updateEmployerSchema,
} from "../../../validationSchema/employer";
import createEmployerProfileHandler from "./create";
import getEmployerProfileByIdHandler from "./getById";
import deleteEmployerProfileHandler from "./delete";
import updateEmployerProfileHandler from "./update";
import authenticateUser from "../../../middleware/authenticateUser";
import authorizedRoles from "../../../middleware/role";

const employerRoutes = Router();


/**
 * @openapi
 * tags:
 *   - name: Employers
 *     description: Employer profile management

 * /api/v1/employer/create:
 *   post:
 *     summary: Create an employer profile
 *     tags:
 *       - Employers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployerInput'
 *     responses:
 *       201:
 *         description: Employer profile created successfully
 *       400:
 *         description: Invalid input

 * /api/v1/employer/get/{id}:
 *   get:
 *     summary: Get employer profile by ID
 *     tags:
 *       - Employers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Employer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employer profile retrieved
 *       404:
 *         description: Employer not found

 * /api/v1/employer/{id}:
 *   delete:
 *     summary: Delete employer profile
 *     tags:
 *       - Employers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employer profile deleted
 *       404:
 *         description: Employer not found

 *   patch:
 *     summary: Update employer profile
 *     tags:
 *       - Employers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployerInput'
 *     responses:
 *       200:
 *         description: Employer profile updated
 *       400:
 *         description: Invalid input

 * components:
 *   schemas:
 *     CreateEmployerInput:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *           example: "Acme Inc."
 *         companyWebsite:
 *           type: string
 *           format: uri
 *           example: "https://acme.com"
 *         companyDescription:
 *           type: string
 *           example: "A forward-thinking software company."
 *         companySize:
 *           type: string
 *           example: "51-200"
 *         industry:
 *           type: string
 *           example: "Technology"
 *         companyLocation:
 *           type: string
 *           example: "Lagos, Nigeria"
 *       required:
 *         - companyName
 *     
 *     UpdateEmployerInput:
 *       type: object
 *       properties:
 *         companyName:
 *           type: string
 *           example: "Acme Inc."
 *         companyWebsite:
 *           type: string
 *           format: uri
 *           example: "https://acme.com"
 *         companyDescription:
 *           type: string
 *           example: "A newly rebranded AI startup."
 *         companySize:
 *           type: string
 *           example: "201-500"
 *         industry:
 *           type: string
 *           example: "Artificial Intelligence"
 *         companyLocation:
 *           type: string
 *           example: "Abuja, Nigeria"
 */


employerRoutes.post(
  "/create",
  authenticateUser,
  authorizedRoles("employer"),
  validate(createEmployerSchema),
  createEmployerProfileHandler
);

//get employer by ID
employerRoutes.get(
  "/get/:id",
  validate(getEmployerByIdSchema),
  getEmployerProfileByIdHandler
);

//delete employer profile
employerRoutes.delete(
  "/:id",
  authenticateUser,
  authorizedRoles("employer"),
  validate(deleteEmployerByIdSchema),
  deleteEmployerProfileHandler
);

//update employer profile
employerRoutes.patch(
  "/:id",
  authenticateUser,
  authorizedRoles("employer"),
  validate(updateEmployerSchema),
  updateEmployerProfileHandler
);

export default employerRoutes;
