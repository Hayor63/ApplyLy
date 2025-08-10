import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import EmployerRepo from "../../../database/repo/employerRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const deleteEmployerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  try {
    const deletedProfile = await EmployerRepo.deleteEmployerProfile(userId);

    if (!deletedProfile) {
      return APIResponse.error("Employer profile not found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Employer profile deleted successfully" },
      200
    ).send(res);
  } catch (error: any) {
    console.error("Error deleting employer profile:", error);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default deleteEmployerProfileHandler;
