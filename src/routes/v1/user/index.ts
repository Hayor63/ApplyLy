import { Router } from "express";
import validate from "../../../middleware/validate";
import tokenHandler from "./verifyEmail";
import createUserHandler from "./create";
import {
  createUserSchema,
  verifyEmailSchema,
} from "../../../validationSchema/user";

const userRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User registration and email verification

 * /api/v1/users/create:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *               type:
 *                 type: string
 *                 enum: [jobseeker, employer]
 *                 default: jobseeker
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error

 * /api/v1/users/verify-account/{userId}/{token}:
 *   patch:
 *     summary: Verify a user's email address
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to verify
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the user
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */


userRoutes.post("/create", validate(createUserSchema), createUserHandler);

userRoutes.patch(
  "/verify-account/:userId/:token",
  validate(verifyEmailSchema),
  tokenHandler
);

export default userRoutes;
