import { DocumentType } from "@typegoose/typegoose";
import { JobListing } from "../models/jobListing";
import BookmarkModel, { Bookmark } from "../models/bookMark";

export default class bookmarkRepo {
  //create bookmark
  static createBookmark: (
    userId: string,
    jobListingId: string
  ) => Promise<DocumentType<Bookmark>> = async (userId, jobListingId) => {
    return await BookmarkModel.create({ userId, jobListingId });
  };

  //check if bookmark exists
  static isBookmarked: (
    userId: string,
    jobListingId: string
  ) => Promise<DocumentType<Bookmark> | null> = async (
    userId,
    jobListingId
  ) => {
    return await BookmarkModel.findOne({ userId, jobListingId });
  };

  //get all bookmarks for user
  static getUserBookmarks: (
    userId: string
  ) => Promise<DocumentType<Bookmark>[]> = async (userId) => {
    return await BookmarkModel.find({ userId }).populate("jobListingId");
  };

  //delete/remove bookmark
  static removeBookmark: (
    userId: string,
    bookmarkId: string
  ) => Promise<DocumentType<Bookmark> | null> = async (userId, bookmarkId) => {
    return await BookmarkModel.findOneAndDelete({ _id: bookmarkId, userId });
  };
}
