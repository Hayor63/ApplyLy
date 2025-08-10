import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import EmployerModel from "../../../database/models/employerProfile";
import JobListingModel from "../../../database/models/jobListing";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateJobListingStatusHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { jobListingId } = req.params;
  const userId = req.user?._id;
  let { status } = req.body;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }
  if (!mongoose.Types.ObjectId.isValid(jobListingId)) {
    return APIResponse.error("Invalid Job Listing ID", 400).send(res);
  }

  try {
    // Find the employer profile of the logged-in user
    const employer = await EmployerModel.findOne({ userId });
    if (!employer) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

    //Find the job listing
    const job = await JobListingModel.findById(jobListingId);
    if (!job) {
      return APIResponse.error("Job listing not found", 404).send(res);
    }

    //Check if the employer owns this job listing
    if (job.employerId.toString() !== employer._id.toString()) {
      return APIResponse.error(
        "Unauthorized: You are not the employer for this job listing",
        403
      ).send(res);
    }

    //Validate status
    status = String(status).trim().toLowerCase();
    const validStatuses = ["open", "closed"];
    if (!validStatuses.includes(status)) {
      return APIResponse.error("Invalid status value", 400).send(res);
    }

    // Update
    job.status = status;
    await job.save();

    return APIResponse.success({
      message: "Job listing status updated successfully",
      data: job,
    }).send(res);
  } catch (error) {
    console.error("Error updating job listing status:", error);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};


export default updateJobListingStatusHandler;
