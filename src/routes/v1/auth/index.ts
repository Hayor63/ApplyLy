import { Router } from "express";
import loginHandler from "./login";
import getCurrentUserProfileHandler from "./getCurrentUserProfile";
import updateUserProfileHandler from "./updateUserProfile";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resendEmailVerificationSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
} from "../../../validationSchema/user";
import validate from "../../../middleware/validate";
import authenticateUser from "../../../middleware/authenticateUser";
import resendEmailVerificationHandler from "./resendEmailVerification";
import forgotPasswordHandler from "./forgotPassword";
import resetPasswordHandler from "./resetPassword";
import changePasswordHandler from "./changePassword";


const authRoutes = Router();


/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and account management endpoints

 * /api/v1/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123!
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Validation error

 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current logged-in user's profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile data

 * /api/v1/auth/profile/update:
 *   patch:
 *     summary: Update current user's profile
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *     responses:
 *       200:
 *         description: Profile updated successfully

 * /api/v1/auth/resend-email-verification:
 *   post:
 *     summary: Resend email verification token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email resent

 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent

 * /api/v1/auth/reset-password/{id}/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPass123!
 *     responses:
 *       200:
 *         description: Password reset successful

 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password for authenticated user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 */

//login user
authRoutes.post("/login", validate(loginSchema), loginHandler);

//get current user profile
authRoutes.get("/profile", authenticateUser, getCurrentUserProfileHandler);

//resend email verification
authRoutes.post(
  "/resend-email-verification",
  validate(resendEmailVerificationSchema),
  resendEmailVerificationHandler
);

//reset password
authRoutes.post(
  "/reset-password/:id/:token",
  validate(resetPasswordSchema),
  resetPasswordHandler
);


//forgot password
authRoutes.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPasswordHandler
);

//change user password
authRoutes.post(
  "/change-password",
  authenticateUser,
  validate(changePasswordSchema),
  changePasswordHandler
)

//update user profile
authRoutes.patch(
  "/profile/update",
  authenticateUser,
  validate(updateUserProfileSchema),
  updateUserProfileHandler
);





export default authRoutes;
