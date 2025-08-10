import { Request, Response } from "express";
import mongoose from "mongoose";
import APIResponse from "../../../utils/api";
import EmployerRepo from "../../../database/repo/employerRepo";
import EmployerModel from "../../../database/models/employerProfile";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const updateEmployerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const updateParams = req.body;
  const userId = req.user?._id?.toString();

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return APIResponse.error("Invalid employer ID", 400).send(res);
    }

    const employerProfile = await EmployerModel.findOne({ userId }).lean();

    if (!employerProfile) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

    const updatedEmployer = await EmployerRepo.updateCompanyProfile(
      employerProfile._id.toString(),
      updateParams
    );

    return APIResponse.success(
      {
        message: "Employer profile updated successfully",
        data: updatedEmployer,
      },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message, 500).send(res);
  }
};

export default updateEmployerProfileHandler;
