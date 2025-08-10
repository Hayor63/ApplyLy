import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import EmployerRepo from "../../../database/repo/employerRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deleteJobListingHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return APIResponse.error("Invalid job listing ID", 400).send(res);
  }

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  try {
    const job = await jobListingRepo.findById(id);
    if (!job) {
      return APIResponse.error("Job not found", 404).send(res);
    }

    const employer = await EmployerRepo.findByUserId(userId);
    if (!employer) {
      return APIResponse.error(
        "Employer profile not found. Please complete your employer registration.",
        404
      ).send(res);
    }

    // Authorization check
    if (job.employerId.toString() !== employer.id.toString()) {
      return APIResponse.error(
        "You are not authorized to delete this job",
        403
      ).send(res);
    }

    const deletedJob = await jobListingRepo.deleteJobListing(id);

    return APIResponse.success(
      {
        message: "Job deleted successfully",
        data: deletedJob,
      },
      200
    ).send(res);
  } catch (error) {
    console.error("Error in deleteJobListingHandler:", error);
    return APIResponse.error(
      error instanceof Error ? error.message : "Internal server error",
      500
    ).send(res);
  }
};

export default deleteJobListingHandler;
