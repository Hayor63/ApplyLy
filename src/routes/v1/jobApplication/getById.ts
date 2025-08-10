import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobListingModel from "../../../database/models/jobListing";
import JobApplicationModel from "../../../database/models/jobApplication";
import EmployerRepo from "../../../database/repo/employerRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getJobApplicationByIdHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const { applicationId } = req.params;

    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    // Finding the application using the applicationId
    const application = await JobApplicationRepo.getById(applicationId);
    if (!application) {
      return APIResponse.error("Job application not found", 404).send(res);
    }

   // Finding the employer profile associated with the given userId
    const employer = await EmployerRepo.findByUserId(userId);

    if (!employer) {
      return APIResponse.error(
        "Employer profile not found. Please complete your employer registration.",
        404
      ).send(res);
    }

    //Getting the job tied to this application
    const job = await JobListingModel.findById(application.jobId);
    if (!job) {
      return APIResponse.error("Job listing not found", 404).send(res);
    }

    //Checking that the job belongs to the requesting employer
    if (job.employerId.toString() !== employer._id.toString()) {
      return APIResponse.error("Forbidden: You do not own this job", 403).send(
        res
      );
    }

    //returning a successful response
    return APIResponse.success(
      {
        message: "Job application retrieved successfully",
        data: application,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      "Server error: " + (error as Error).message,
      500
    ).send(res);
  }
};

export default getJobApplicationByIdHandler;
