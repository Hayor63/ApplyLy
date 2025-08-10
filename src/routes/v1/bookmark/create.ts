import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import mongoose from "mongoose";
import bookmarkRepo from "../../../database/repo/bookmarkRepo";
import BookmarkModel from "../../../database/models/bookMark";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const createBookmarkHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { jobListingId } = req.params;

  const userId = req.user?._id;

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    if (!mongoose.Types.ObjectId.isValid(jobListingId)) {
      return APIResponse.error("Invalid Job ID", 400).send(res);
    }

    const existing = await BookmarkModel.findOne({ userId, jobListingId });
    if (existing) {
      return APIResponse.success(
        { message: "Job already bookmarked", data: existing },
        200
      ).send(res);
    }

    const bookmark = await bookmarkRepo.createBookmark(userId, jobListingId);
    if (!bookmark) {
      return APIResponse.error("Failed to create bookmark", 500).send(res);
    }

    return APIResponse.success(
      { message: "Job bookmarked successfully", data: bookmark },
      201
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default createBookmarkHandler;
