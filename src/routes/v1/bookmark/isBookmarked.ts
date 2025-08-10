import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import bookmarkRepo from "../../../database/repo/bookmarkRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const isBookMarkJobHandler = async (req: AuthenticatedRequest, res: Response) => {
  const {jobListingId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    if (!mongoose.Types.ObjectId.isValid(jobListingId)) {
      return APIResponse.error("Invalid Job ID", 400).send(res);
    }

    const existing = await bookmarkRepo.isBookmarked(userId, jobListingId);

    return APIResponse.success(
      { message: "Bookmark status fetched", isBookmarked: !!existing },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default isBookMarkJobHandler;
