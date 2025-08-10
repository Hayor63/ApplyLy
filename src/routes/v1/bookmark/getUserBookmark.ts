import { Request, Response } from "express";
import APIResponse from "../../../utils/api";
import bookmarkRepo from "../../../database/repo/bookmarkRepo";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const getUserBookmarks = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    return APIResponse.error("Unauthorized", 401).send(res);
  }

  try {
    const bookmarks = await bookmarkRepo.getUserBookmarks(userId);

    if (!bookmarks || bookmarks.length === 0) {
      return APIResponse.error("No bookmarks found", 404).send(res);
    }

    return APIResponse.success(
      { message: "Bookmarks retrieved successfully", data: bookmarks },
      200
    ).send(res);
  } catch (error) {
    return APIResponse.error("Internal server error", 500).send(res);
  }
};

export default getUserBookmarks;
