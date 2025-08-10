import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobSeekerRepo from "../../../database/repo/jobSeekerRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deleteJobSeekerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    const deletedProfile = await JobSeekerRepo.deleteJobSeekerProfile(userId);

    if (!deletedProfile) {
      return APIResponse.error("Job profile not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Job profile deleted successfully" },
      200
    ).send(res);
  } catch (error: any) {
    console.error("Error deleting job seeker profile:", error);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default deleteJobSeekerProfileHandler;
