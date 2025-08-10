// import { Request, Response } from "express";
// import APIResponse from "../../../utils/api";
// import mongoose from "mongoose";
// import bookmarkRepo from "../../../database/repo/bookmarkRepo";
// import BookmarkModel from "../../../database/models/bookMark";

// interface AuthenticatedRequest extends Request {
//   user?: {
//     _id: string;
//   };
// }

// const removeBookmarkHandler = async (req: AuthenticatedRequest, res: Response) => {
//   const { jobListingId } = req.params;
//   const userId = req.user?._id;

//   try {
//     if (!userId) {
//       return APIResponse.error("Unauthorized", 401).send(res);
//     }

//     if (!mongoose.Types.ObjectId.isValid(jobListingId)) {
//       return APIResponse.error("Invalid Job ID", 400).send(res);
//     }

//     const existing = await BookmarkModel.findOne({ userId, jobListingId });
//     if (!existing) {
//       return APIResponse.error("Bookmark not found or already removed", 404).send(res);
//     }

//     const removedBookmark = await bookmarkRepo.removeBookmark(userId, jobListingId);
//     if (!removedBookmark) {
//       return APIResponse.error("Failed to remove bookmark", 500).send(res);
//     }

//     return APIResponse.success(
//       { message: "Bookmark removed successfully", data: removedBookmark },
//       200
//     ).send(res);
//   } catch (error) {
//     return APIResponse.error("Internal server error", 500).send(res);
//   }
// };

// export default removeBookmarkHandler;



import mongoose from "mongoose";
import BookmarkModel from "../../../database/models/bookMark";
import APIResponse from "../../../utils/api";
import bookmarkRepo from "../../../database/repo/bookmarkRepo";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

const removeBookmarkHandler = async (req: AuthenticatedRequest, res: Response) => {
  const { bookmarkId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      return APIResponse.error("Unauthorized", 401).send(res);
    }

    if (!mongoose.Types.ObjectId.isValid(bookmarkId)) {
      return APIResponse.error("Invalid bookmark ID", 400).send(res);
    }

    const existing = await BookmarkModel.findOne({ _id: bookmarkId, userId });
    if (!existing) {
      return APIResponse.error("Bookmark not found or already removed", 404).send(res);
    }

    const removedBookmark = await bookmarkRepo.removeBookmark(userId, bookmarkId);
    if (!removedBookmark) {
      return APIResponse.error("Failed to remove bookmark", 500).send(res);
    }

    return APIResponse.success(
      { message: "Bookmark removed successfully", data: removedBookmark },
      200
    ).send(res);
  } catch (error: any) {
    console.error("Error removing bookmark:", error.message);
    return APIResponse.error("Internal server error", 500).send(res);
  }
};


export default removeBookmarkHandler