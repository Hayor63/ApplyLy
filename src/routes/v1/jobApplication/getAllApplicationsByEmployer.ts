import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import JobApplicationRepo from "../../../database/repo/jobApplicationRepo";
import mongoose from "mongoose";
import EmployerModel from "../../../database/models/employerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getEmployerJobApplicationsHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    // Getting the employer profile using the user ID
    const employer = await EmployerModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!employer) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

    // Fetching all job applications for all jobs posted by this employer
    const allApplications =
      await JobApplicationRepo.getAllApplicationsForEmployer(
        employer._id.toString()
      );

    if (!allApplications || allApplications.length === 0) {
      return APIResponse.error("No job applications found").send(res);
    }

    //returning a successful response
    return APIResponse.success(
      {
        message: "Job applications retrieved successfully",
        data: allApplications,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error(
      "Something went wrong: " + (error as Error).message,
      500
    ).send(res);
  }
};

export default getEmployerJobApplicationsHandler;
