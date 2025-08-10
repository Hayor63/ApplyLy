import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import JobListingModel from "../../../database/models/jobListing";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import EmployerModel from "../../../database/models/employerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateJobListingHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const updateParams = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return APIResponse.error("Invalid Job Listing ID", 400).send(res);
  }

  const employer = await EmployerModel.findOne({ userId: req.user?._id });
  if (!employer) return APIResponse.error("Employer not found", 404).send(res);

  const updateData = {
  ...req.body,
  employerId: employer._id,
};

  if (!updateData) {
    return APIResponse.error("Job listing not found", 404).send(res);
  }

  const updatedJob = await jobListingRepo.updateJobListing(id, updateParams);

  return APIResponse.success(
    {
      message: "Job listing updated successfully",
      data: updatedJob,
    },
    200
  ).send(res);
};

export default updateJobListingHandler;
