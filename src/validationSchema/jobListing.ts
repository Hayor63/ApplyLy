import { array, boolean, number, object, string, TypeOf, z } from "zod";

export const jobListingSchema = object({
  body: object({
    title: string({ required_error: "Job title is required" }),
    description: string({ required_error: "Job description is required" }),
    employerId: string({
      required_error: "Employer ID is required",
    }).optional(),
    location: string({ required_error: "Location is required" }),
    salary: number({ required_error: "Salary is required" }),
    isFilled: boolean().optional().default(false),
    applicationCount: number().optional().default(0),
    status: z.enum(["open", "closed"], {
      required_error: "Status must be 'open' or 'closed'",
    }),
    workMode: z.enum(["remote", "on-site", "hybrid"], {
      required_error:
        "Work mode must be one of 'remote', 'on-site', or 'hybrid'",
    }),
    experienceLevel: z.enum(["junior", "mid", "senior"], {
      required_error:
        "Experience level must be one of 'junior', 'mid', or 'senior'",
    }),
    jobType: z.enum(["full-time", "part-time", "contract"], {
      required_error:
        "Job type must be one of 'full-time', 'part-time', or 'contract'",
    }),
    skills: array(z.string(), { required_error: "Skills are required" }).min(
      1,
      "At least one skill is required"
    ),
  }),
});

//get job listing by ID schema
export const getJobListingByIdSchema = object({
  params: object({
    id: string({ required_error: "Job listing ID is required" }),
  }),
});

//delete job listing
export const deleteJobListingByIdSchema = object({
  params: object({
    id: string({ required_error: "Job listing ID is required" }),
  }),
});

//update job listing
export const updateJobListing = z.object({
  params: object({
    id: string({ required_error: "Job listing ID is required" }),
  }),
  body: object({
    title: string({ required_error: "Job title is required" }),
    description: string({ required_error: "Job description is required" }),
    employerId: string({
      required_error: "Employer ID is required",
    }).optional(),
    location: string({ required_error: "Location is required" }),
    salary: number({ required_error: "Salary is required" }),
    isFilled: boolean().optional().default(false),
    applicationCount: number().optional().default(0),
    status: z.enum(["open", "closed"], {
      required_error: "Status must be 'open' or 'closed'",
    }),
    workMode: z.enum(["remote", "on-site", "hybrid"], {
      required_error:
        "Work mode must be one of 'remote', 'on-site', or 'hybrid'",
    }),
    experienceLevel: z.enum(["junior", "mid", "senior"], {
      required_error:
        "Experience level must be one of 'junior', 'mid', or 'senior'",
    }),
    jobType: z.enum(["full-time", "part-time", "contract"], {
      required_error:
        "Job type must be one of 'full-time', 'part-time', or 'contract'",
    }),
    skills: array(z.string(), { required_error: "Skills are required" }).min(
      1,
      "At least one skill is required"
    ),
  }),
});

// Update job listing status schema
export const updateJobListingStatusSchema = object({
  params: object({
    jobListingId: string({
      required_error: "Job Listing ID is required", // Fixed spelling of "application"
    }),
  }),
  body: object({
    status: z.enum(["open", "closed"], {
      required_error: "Status must be 'open' or 'closed'",
    }),
  }),
});

//filter jobs
export const jobFiltersSchema = z.object({
  query: object({
    location: z.string().trim().max(100).optional(),
    workMode: z.enum(["remote", "on-site", "hybrid"]).optional(),
    experienceLevel: z.enum(["junior", "mid", "senior"]).optional(),
    jobType: z
      .enum(["full-time", "part-time", "contract", "internship"])
      .optional(),
    skills: z.array(z.string().trim().max(50)).max(10).optional(),
    isFilled: z.boolean().optional(),
    status: z.enum(["open", "closed"]).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(10),
    minSalary: z.coerce.number().nonnegative().optional(),
    maxSalary: z.coerce.number().nonnegative().optional(),
  }).refine(
    (data) =>
      data.minSalary === undefined ||
      data.maxSalary === undefined ||
      data.minSalary <= data.maxSalary,
    {
      message: "minSalary must be less than or equal to maxSalary",
      path: ["minSalary"],
    }
  ),
});

//get all jobs by Id
export const getAllJobListingByIdSchema = object({
  params: object({
    employerId: string({ required_error: "Job listing ID is required" }),
  }),
});

//get job recommendation
export const getJobRecommendationsSchema = z.object({
  query: object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Page must be a positive number",
      }),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "Limit must be a positive number",
      }),
  }),
});

export type JobListingTypeInput = TypeOf<typeof jobListingSchema>["body"];
export type jobFiltersSchemaInput = TypeOf<typeof jobFiltersSchema>["query"];
export type getJobRecommendationsSchema = TypeOf<
  typeof jobFiltersSchema
>["query"];
