import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import jobListingRepo from "../../../database/repo/jobListingRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    type: "employer" | "jobseeker";
  };
}

const getAllJobsByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { employerId } = req.params;
  const userId = req.user?._id;
  const userType = req.user?.type;

  if (!mongoose.Types.ObjectId.isValid(employerId)) {
    return APIResponse.error("Invalid Job ID", 400).send(res);
  }

  // Only allowing the employer to view their own jobs,
  if (userType !== "employer" && userId !== employerId) {
    return APIResponse.error(
      "You are not allowed to view these jobs",
      403
    ).send(res);
  }

  try {
    const jobs = await jobListingRepo.getJobsByEmployerId(employerId);
    if (!jobs || jobs.length === 0) {
      return APIResponse.error("No jobs found for this employer", 404).send(
        res
      );
    }

    return APIResponse.success(
      { message: "Job retrieved successfully", data: jobs },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default getAllJobsByIdHandler;
