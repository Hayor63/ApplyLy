import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getCurrentUserProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    const user = await UserRepo.findUserById(userId);
    if (!user) {
      return APIResponse.error("User not found", 404).send(res);
    }

    return APIResponse.success(
      {
        user: {
          fullName: user.fullName,
          email: user.email,
          type: user.type,
          isVerified: user.isVerified,
        },
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default getCurrentUserProfileHandler;
