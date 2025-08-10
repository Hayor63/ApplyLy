import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobSeekerRepo from "../../../database/repo/jobSeekerRepo";
import UserRepo from "../../../database/repo/userRepo";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const createJobSeekerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    const {
      phoneNumber,
      bio,
      location,
      resume,
      skills,
      experiences,
      education,
      socialLinks,
    } = req.body;


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return APIResponse.error("Invalid user ID", 400).send(res);
    }

    const existingProfile = await JobSeekerRepo.findByUserId(userId);
    if (existingProfile) {
      return APIResponse.error("Job profile already exists", 400).send(
        res
      );
    }

    const user = await UserRepo.findUserById(userId);
    if (!user) {
      return APIResponse.error("User does not exist", 404).send(res);
    }

    const jobSeekerProfile = await JobSeekerRepo.createJobSeekerProfile({
      userId,
      phoneNumber,
      bio,
      location,
      resume,
      skills,
      experiences,
      education,
      socialLinks,
    });

    return APIResponse.success(
      {
        message: "Job seeker profile created successfully",
        data: jobSeekerProfile,
      },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default createJobSeekerProfileHandler;