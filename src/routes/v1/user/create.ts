import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import { DocumentType } from "@typegoose/typegoose";
import { User } from "../../../database/models/userModel";
import JWTRepo from "../../../database/repo/JWTRepo";
import config from "../../../../config/default";
import sendEmail from "../../../services/sendEmail";
import TokenModel from "../../../database/models/token";
import * as argon2 from "argon2";

const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, fullName, type, password } = req.body;
    if (!email || !fullName || !password || !type) {
      return APIResponse.error(
        "Email, full name, password, and type are required",
        400
      ).send(res);
    }
    // Validate email format
    const currentEmail = await UserRepo.findUserByEmail(email);
    if (currentEmail) {
      return APIResponse.error(
        "Unable to create account. Please try again or use a different email.",
        400
      ).send(res);
    }

    const allowedTypes = ["jobseeker", "employer"]; // Add more types later like recruiter, admin, etc.
    if (!allowedTypes.includes(type)) {
      return APIResponse.error("Invalid account type provided", 400).send(res);
    }

  
    const user = (await UserRepo.createUser({
      fullName,
      email,
      type,
      password,
    })) as DocumentType<User>;

    if (!user || !user._id) {
      return APIResponse.error("failed to create user").send(res);
    }
    const verificationToken = JWTRepo.signEmailVerificationToken(
      user.id.toString(),
      user.email
    );

    const messageLink = `${config.baseUrl}/verify-email?token=${user._id}/${verificationToken}`;
    const emailSent = await sendEmail({
      fullName: user.fullName,
      from: config.userMailLogin,
      to: user.email,
      subject: "Email Verification Link",
      text: `Hello ${user.fullName}, please verify your email by clicking on this link: ${messageLink}.
               Link expires in 30 minutes.`,
    });

    if (!emailSent.success) {
      console.error("Email sending failed:", emailSent);
      return APIResponse.error("Failed to send verification email").send(res);
    }
    // Save token in database only if email was sent

    const hashedToken = await argon2.hash(verificationToken);
    await TokenModel.create({ userId: user._id, token: hashedToken });
    return APIResponse.success(
      {
        message:
          "User registration successful. Please verify your email to log in.",
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
export default createUserHandler;
