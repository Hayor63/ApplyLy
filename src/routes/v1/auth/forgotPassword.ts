import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import JWTRepo from "../../../database/repo/JWTRepo";
import TokenModel from "../../../database/models/token";
import sendEmail from "../../../services/sendEmail";
import config from "../../../../config/default";

const forgotPasswordHandler = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return APIResponse.error("A valid email is required", 400).send(res);
  }

  try {
    //find user
    const user = await UserRepo.findUserByEmail(email);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    //generate reset token
    const resetToken = JWTRepo.signResetToken(user._id.toString());

    //store token in database
    await TokenModel.create({
      userId: user._id,
      token: resetToken, // Store JWT token
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // Send email with reset link
    const resetLink = `${config.baseUrl}/reset-password/${user._id}/${resetToken}`;
    const emailSent = await sendEmail({
      fullName: user.fullName,
      from: config.userMailLogin,
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${resetLink}`,
    });

    // Ensure email was sent
    if (!emailSent?.success) {
      return APIResponse.error("Failed to send reset email").send(res);
    }

    return APIResponse.success(
      { message: "Password reset email sent successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default forgotPasswordHandler;
