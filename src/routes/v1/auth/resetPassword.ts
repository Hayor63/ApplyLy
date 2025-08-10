import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import TokenModel from "../../../database/models/token";
import argon2 from "argon2";


const resetPasswordHandler = async (req: Request, res: Response) => {
  const { id: userId, token } = req.params;
  try {
    const { newPassword } = req.body;
    if (!token || !newPassword) {
      return APIResponse.error("Token and new password are required", 400).send(
        res
      );
    }
    //find user by ID
    const user = await UserRepo.findUserById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    //check if token is valid
    const getToken = await TokenModel.findOne({ userId, token }).lean();
    if (!getToken) {
      return APIResponse.error("Invalid or expired token", 400).send(res);
    }

    //check token expiration
    if (getToken.expiredAt && getToken.expiredAt < new Date()) {
      return APIResponse.error("Token has expired", 400).send(res);
    }

    // Hash the new password using Argon2
    const hashedPassword = await argon2.hash(newPassword);
    // Update user's password
    await UserRepo.updateUserProfile(user._id.toString(), {
      password: hashedPassword,
    });

    // Delete token after successful reset
    await TokenModel.deleteOne({ _id: getToken._id });

    return APIResponse.success(
      { message: "Password reset successfully" },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};
export default resetPasswordHandler;
