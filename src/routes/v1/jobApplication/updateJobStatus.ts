import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import EmployerModel from "../../../database/models/employerProfile";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobListingModel from "../../../database/models/jobListing";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateJobApplicationStatusHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { jobApplicationId } = req.params;
  const userId = req.user?._id;
  const { status } = req.body;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }
  if (!mongoose.Types.ObjectId.isValid(jobApplicationId)) {
    return APIResponse.error("Invalid Job Application ID", 400).send(res);
  }

  try {
    const application = await JobApplicationRepo.getById(jobApplicationId);
    if (!application) {
      return APIResponse.error("Job application not found", 404).send(res);
    }

    const employer = await EmployerModel.findOne({ userId });
    if (!employer) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

    const job = await JobListingModel.findById(application.jobId);
    if (!job) {
      return APIResponse.error("Job listing not found", 404).send(res);
    }

    if (job.employerId.toString() !== employer._id.toString()) {
      return APIResponse.error(
        "Unauthorized: You are not the employer for this job listing",
        403
      ).send(res);
    }

    const Validstatus = ["pending", "reviewed", "accepted", "rejected"];
    if (!Validstatus.includes(status)) {
      return APIResponse.error("Invalid status value", 400).send(res);
    }

    const updatedApplication = await JobApplicationRepo.updateJobStatus(
      jobApplicationId,
      { status }
    );

    return APIResponse.success({
      message: "Application status updated successfully",
      data: updatedApplication,
    }).send(res);
  } catch (error) {
    console.error("Error updating job application status:", error);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};


export default updateJobApplicationStatusHandler;
