import mongoose from "mongoose";
import JobSeekerRepo from "../../../database/repo/jobSeekerRepo";
import APIResponse from "../../../utils/api";
import { Request, Response } from "express";

const getJobProfileByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid job seeker ID", 400).send(res);
    }

    const jobSeekerProfile = await JobSeekerRepo.findById(id);

    if (!jobSeekerProfile) {
      return APIResponse.error("Job seeker profile not found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "profile retrieved successfully",
        data: jobSeekerProfile,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default getJobProfileByIdHandler;
