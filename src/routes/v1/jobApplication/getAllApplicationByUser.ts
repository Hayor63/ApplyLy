import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobSeekerModel from "../../../database/models/jobSeekerProfile";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getAllApplicationByUserHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    //Extract user ID from the authenticated request
    const userId = req.user?._id;

    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    // Finding the job seeker profile by userId
    const jobSeeker = await JobSeekerModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!jobSeeker) {
      return APIResponse.error("Job seeker profile not found", 404).send(res);
    }

    //Fetching all job applications by the job seeker's _id
    const allApplications = await JobApplicationRepo.getAllApplicationByUser(
      jobSeeker._id.toString()
    );

    if (!allApplications || allApplications.length === 0) {
      return APIResponse.error("No job applications found").send(res);
    }

    //returning a successful response
    return APIResponse.success(
      {
        message: "Job applications retrieved successfully",
        data: allApplications,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      "Something went wrong: " + (error as Error).message,
      500
    ).send(res);
  }
};

export default getAllApplicationByUserHandler;
