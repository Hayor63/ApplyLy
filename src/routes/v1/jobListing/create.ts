import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import EmployerModel from "../../../database/models/employerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}



const createJobListingHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  const jobListingData = req.body;
  if (!jobListingData) {
    return APIResponse.error("Invalid request body", 400).send(res);
  }

  //Finding the employer profile for the authenticated user
  const employer = await EmployerModel.findOne({ userId });

  if (!employer) {
    return APIResponse.error("Employer profile not found", 404).send(res);
  }

  //Assigning employerId using Employer._id
  jobListingData.employerId = employer._id;

  jobListingData.isFilled ??= false;
  jobListingData.status ??= "open";

  try {
    const newJobListing = await jobListingRepo.createJobListing(jobListingData);

    if (!newJobListing) {
      return APIResponse.error("Failed to create job listing", 500).send(res);
    }

    return APIResponse.success(
      {
        message: "Job listing created successfully",
        data: newJobListing,
      },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      "Something went wrong while creating the job listing",
      500
    ).send(res);
  }
};

export default createJobListingHandler;
