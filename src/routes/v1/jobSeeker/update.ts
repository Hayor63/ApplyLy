import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobSeekerRepo from "../../../database/repo/jobSeekerRepo";
import JobSeekerModel from "../../../database/models/jobSeekerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateJobProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id?.toString();
   const updatedData = req.body;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }
 
  try {

    if (!updatedData || typeof updatedData !== "object") {
      return APIResponse.error("Invalid or missing request body", 400).send(
        res
      );
    }

    if (Object.keys(updatedData).length === 0) {
      return APIResponse.error("No valid fields to update", 400).send(res);
    }

    const jobSeekerProfile = await JobSeekerModel.findOne({ userId });

    if (!jobSeekerProfile) {
      return APIResponse.error("Job seeker profile not found", 404).send(res);
    }

  
    const updatedProfile = await JobSeekerRepo.updateJobSeekerProfile(
      jobSeekerProfile._id.toString(), 
      updatedData
    );

    return APIResponse.success(
      { message: "Profile updated successfully", data: updatedProfile },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default updateJobProfileHandler;
