import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobSeekerModel from "../../../database/models/jobSeekerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateJobApplicationHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return APIResponse.error("Invalid Job Application ID", 400).send(res);
  }

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  try {
    const applicant = await JobSeekerModel.findOne({ userId });
    if (!applicant) {
      return APIResponse.error("Job seeker not found", 404).send(res);
    }

    const updateData = {
      ...req.body,
      jobSeekerId: applicant._id, 
    };

    const updatedJob = await JobApplicationRepo.updateApplication(id, updateData);

    if (!updatedJob) {
      return APIResponse.error("Job Application not found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Job Application updated successfully",
        data: updatedJob,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default updateJobApplicationHandler;
