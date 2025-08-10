import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import * as argon2 from "argon2"; // Add this import

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const changePasswordHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }
  
    if (!currentPassword || !newPassword) {
      return APIResponse.error(
        "Current and new passwords are required",
        400
      ).send(res);
    }

    const user = await UserRepo.findUserById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    const isCurrentPasswordValid = await user.verifyPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return APIResponse.error("Current password is incorrect", 401).send(res);
    }

    if (currentPassword === newPassword) {
      return APIResponse.error(
        "New password must be different from current password",
        400
      ).send(res);
    }

    user.password = newPassword;
    await user.save();

    return APIResponse.success(
      { message: "Password changed successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default changePasswordHandler;
