import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import JWTRepo from "../../../database/repo/JWTRepo";
import sendEmail from "../../../services/sendEmail";
import TokenModel from "../../../database/models/token";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const resendEmailVerificationHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { email } = req.body;

  try {
    const user = await UserRepo.findUserByEmail(email);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    if (user.isVerified) {
      return APIResponse.error("User already verified", 400).send(res);
    }

    // Generate new verification token (custom logic)
    const token = JWTRepo.signEmailVerificationToken(
      user._id.toString(),
      user.email
    );

    // Save token to DB
    await TokenModel.create({
      userId: user._id,
      token,
    });

    // Send email
    await sendEmail({
      from: "applyLy@email.com",
      to: email,
      subject: "Resend Email Verification",
      fullName: user.fullName,
      text: `Please verify your email: https://applyLy.com/verify?token=${token}`,
    });

    return APIResponse.success({
      msg: "Verification email resent successfully",
    }).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default resendEmailVerificationHandler;
