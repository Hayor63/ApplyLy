import { string, z } from "zod";

export const createBookmarkSchema = z.object({
  params: z.object({
    jobListingId: z
      .string({
        required_error: "Job Listing ID is required",
      })
      .min(1, "Job Listing ID cannot be empty")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job Listing ID format"),
  }),
});


export const removeBookmarkSchema = z.object({
  params: z.object({
    bookmarkId: string({
        required_error: "Job Listing ID is required",
      })
      .min(1, "Job Listing ID cannot be empty")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job Listing ID format"),
  }),
});


export const getUserBookmarksSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "1"))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Page must be a positive number",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => parseInt(val || "10"))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Limit must be a positive number",
      }),
  }),
});


export const isBookmarkedSchema = z.object({
  params: z.object({
    jobListingId: z
      .string({
        required_error: "Job Listing ID is required",
      })
      .min(1, "Job Listing ID cannot be empty")
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Job Listing ID format"),
  }),
});
