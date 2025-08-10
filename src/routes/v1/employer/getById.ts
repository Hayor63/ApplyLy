import mongoose from "mongoose";

import APIResponse from "../../../utils/api";
import { Request, Response } from "express";
import EmployerRepo from "../../../database/repo/employerRepo";

const getEmployerProfileByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return APIResponse.error("Invalid Employer ID", 400).send(res);
    }

    const employerProfile = await EmployerRepo.getEmployerById(id);

    if (!employerProfile) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

      return APIResponse.success(
      { message: "Employer profile retrieved successfully", data: employerProfile },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error((error as Error).message).send(res);
  }
};

export default getEmployerProfileByIdHandler;
