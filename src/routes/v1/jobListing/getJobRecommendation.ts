import { Request, Response } from "express";
import jobListingRepo from "../../../database/repo/jobListingRepo";
import APIResponse from "../../../utils/api";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    type: "jobSeeker" | "employer";
    skills?: string[];
  };
}

const getJobRecommendationsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skills = req.user?.skills || [];
    const jobsRecommendation = await jobListingRepo.getJobRecommendations(
      skills,
      page,
      limit
    );

    if (!jobsRecommendation.jobs || jobsRecommendation.jobs.length === 0) {
      return APIResponse.error("No job recommendations found", 404).send(res);
    }

    return APIResponse.success(
      {
        message: "Jobs retrieved successfully",
        data: jobsRecommendation.jobs,
        meta: {
          total: jobsRecommendation.total,
          page,
          limit,
          totalPages: Math.ceil(jobsRecommendation.total / limit),
        },
      },
      200
    ).send(res);
  } catch (error) {
    console.error("Error fetching job recommendations:", error);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default getJobRecommendationsHandler;
