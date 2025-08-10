import { Router } from "express";
import validate from "../../../middleware/validate";
import authenticateUser from "../../../middleware/authenticateUser";
import createBookmarkHandler from "./create";
import {
  createBookmarkSchema,
  isBookmarkedSchema,
  removeBookmarkSchema,
} from "../../../validationSchema/bookmark";
import authorizedRoles from "../../../middleware/role";
import removeBookmarkHandler from "./removeBookmark";
import getUserBookmarks from "./getUserBookmark";
import isBookMarkJobHandler from "./isBookmarked";

const bookmarkRoutes = Router();

/**
 * @swagger
 * tags:
 *   - name: Bookmarks
 *     description: Manage job bookmarks for job seekers

 * /api/v1/bookmark/create/{jobListingId}:
 *   post:
 *     summary: Bookmark a job listing
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: jobListingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job listing ID to bookmark
 *     responses:
 *       201:
 *         description: Job bookmarked successfully
 *       400:
 *         description: Invalid Job Listing ID

 * /api/v1/bookmark:
 *   get:
 *     summary: Get all bookmarks for the authenticated user
 *     tags:
 *       - Bookmarks
 *     responses:
 *       200:
 *         description: List of user bookmarks
 *       401:
 *         description: Unauthorized

 * /api/v1/bookmark/is-bookmarked/{jobListingId}:
 *   get:
 *     summary: Check if a job is bookmarked by the user
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: jobListingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job listing ID to check
 *     responses:
 *       200:
 *         description: Bookmark status returned
 *       404:
 *         description: Job not bookmarked

 * /api/v1/bookmark/{bookmarkId}:
 *   delete:
 *     summary: Remove a job bookmark
 *     tags:
 *       - Bookmarks
 *     parameters:
 *       - in: path
 *         name: bookmarkId
 *         required: true
 *         schema:
 *           type: string
 *         description: bookmark ID to remove from bookmarks
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *       404:
 *         description: Bookmark not found
 */


bookmarkRoutes.post(
  "/create/:jobListingId",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(createBookmarkSchema),
  createBookmarkHandler
);

//get all users bookmark
bookmarkRoutes.get("/", authenticateUser, getUserBookmarks);

// Check if job is bookmarked
bookmarkRoutes.get(
  "/is-bookmarked/:jobListingId",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(isBookmarkedSchema),
  isBookMarkJobHandler
);

//remove bookmark
bookmarkRoutes.delete(
  "/:bookmarkId",
  authenticateUser,
  authorizedRoles("jobseeker"),
  validate(removeBookmarkSchema),
  removeBookmarkHandler
);

export default bookmarkRoutes;
