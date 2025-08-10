import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import EmployerModel from "../../../database/models/employerProfile";
import EmployerRepo from "../../../database/repo/employerRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    type?: string;
  };
}

const getJobApplicantsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // Extracting jobId from the URL params and userId from the authenticated request
    const { jobId } = req.params;
    const userId = req.user?._id;

    //  Validating jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return APIResponse.error("Invalid job ID", 400).send(res);
    }

    //  Check if user is authenticated
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    //  Finding the employer profile based on the authenticated user
    const employer = await EmployerRepo.findByUserId(userId);
    if (!employer) {
      return APIResponse.error(
        "Employer profile not found. Please complete your employer registration.",
        404
      ).send(res);
    }

    // Fetch the job listing
    const job = await jobListingRepo.findById(jobId);
    if (!job) {
      return APIResponse.error("Job not found", 404).send(res);
    }

    // Ensuring the job listing belongs to the authenticated employer
    if (job.employerId.toString() !== employer._id.toString()) {
      return APIResponse.error(
        "Unauthorized to view applications for this job",
        403
      ).send(res);
    }

    // Fetching all job applications tied to this job
    const applications =
      await JobApplicationRepo.getAllApplicationForJobByEmployer(jobId);

    //returning a successful response
    return APIResponse.success({
      data: applications,
      message: "Applications fetched successfully",
    }).send(res);
  } catch (error) {
    return APIResponse.error(
      "Server error: " + (error as Error).message,
      500
    ).send(res);
  }
};

export default getJobApplicantsHandler;
