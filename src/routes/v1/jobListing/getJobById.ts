import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import { Request, Response } from "express";

const getJobByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return APIResponse.error("Job ID is required", 400).send(res);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return APIResponse.error("Invalid Job ID", 400).send(res);
  }
  try {
    const job = await jobListingRepo.getJobListingById(id);
    if (!job) {
      return APIResponse.error("Job not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Job retrieved successfully", data: job },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default getJobByIdHandler;
