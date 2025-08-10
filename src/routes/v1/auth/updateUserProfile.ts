import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateUserProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }
  try {
    const updatedData = req.body;

    if (!updatedData || typeof updatedData !== "object") {
      return APIResponse.error("Invalid or missing request body", 400).send(
        res
      );
    }

    // Check if any parameters were provided
    if (Object.keys(updatedData).length === 0) {
      return APIResponse.error("No valid fields to update", 400).send(res);
    }

    const updatedUser = await UserRepo.updateUserProfile(userId, updatedData);

    if (!updatedUser) {
      return APIResponse.error("User not found", 404).send(res);
    }
    return APIResponse.success(
      { message: "User updated successfully", data: updatedUser },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default updateUserProfileHandler;
