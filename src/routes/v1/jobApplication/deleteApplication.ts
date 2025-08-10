import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import JobSeekerModel from "../../../database/models/jobSeekerProfile";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import JobApplicationModel from "../../../database/models/jobApplication";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}
const deleteApplicationHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { jobApplicationId } = req.params;
  const userId = req.user?._id;

  if (!mongoose.Types.ObjectId.isValid(jobApplicationId)) {
    return APIResponse.error("Invalid Job Application ID", 400).send(res);
  }

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  try {
    const applicant = await JobSeekerModel.findOne({ userId });
    if (!applicant) {
      return APIResponse.error("Job Seeker not found", 404).send(res);
    }

    // Check if the application belongs to the job seeker
    const application = await JobApplicationRepo.findById(jobApplicationId);
    if (!application) {
      return APIResponse.error("Job Application not found", 404).send(res);
    }

    if (application.applicantId.toString() !== applicant._id.toString()) {
      return APIResponse.error("Forbidden: You cannot delete this application", 403).send(res);
    }

    const deleted = await JobApplicationRepo.deleteApplication(jobApplicationId);
    return APIResponse.success(
      {
        message: "Job Application deleted successfully",
        data: deleted,
      },
      200
    ).send(res);

  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default deleteApplicationHandler;
