import { Request, Response } from "express";
import EmployerRepo from "../../../database/repo/employerRepo";
import APIResponse from "../../../utils/api";
import UserRepo from "../../../database/repo/userRepo";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const createEmployerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const {
      companyName,
      companyLocation,
      companyDescription,
      companyWebsite,
      companySize,
      industry,
    } = req.body;
    // Check if the user is authenticated
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    // Validate required fields
    if (
      !companyName ||
      !companyLocation ||
      !companySize ||
      !industry ||
      !companyWebsite
    ) {
      return APIResponse.error(
        " company name, and location are required",
        400
      ).send(res);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return APIResponse.error("Invalid user ID", 400).send(res);
    }

    // Check if the user already has an employer profile
    const existingProfile = await EmployerRepo.getEmployerByUserId(userId);
    if (existingProfile) {
      return APIResponse.error("Employer profile already exists", 400).send(
        res
      );
    }

    // Check if the user exists
    const user = await UserRepo.findUserById(userId);
    if (!user) {
      return APIResponse.error("User does not exist", 404).send(res);
    }

    // Create the employer profile
    const employerProfile = await EmployerRepo.createEmployer({
      userId,
      companyName,
      companyWebsite,
      companyDescription,
      companySize,
      industry,
      companyLocation,
    });

    return APIResponse.success(
      {
        message: "Employer profile created successfully",
        data: {
          _id: employerProfile._id,
          companyName,
          companyWebsite,
          companyDescription,
          companySize,
          industry,
          companyLocation,
        },
      },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default createEmployerProfileHandler;
