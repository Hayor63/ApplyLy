import { JobApplication } from "./../database/models/jobApplication";
import { object, string, TypeOf, z } from "zod";

export const createJobApplicationSchema = z.object({
  params: object({
    jobId: string({ required_error: "Job ID is required" }),
  }),
  body: object({
    // status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
    coverLetter: z.string().optional(),
    resume: z.string({ required_error: "Resume is required" }),

  }),
});

export const getJobApplicationSchema = z.object({
  params: object({
    applicationId: string({ required_error: "Application ID is required" }),
  }),
});

//get all application for job handler
export const getJobApplicantsSchema = z.object({
  params: object({
    jobId: string({ required_error: "job ID is required" }),
  }),
});


//update job application
export const updateJobApplicationSchema = object({
  params: object({
    id: string({ required_error: "Job apllication ID is required" }),
  }),
  body: object({
    coverLetter: z.string().optional(),
    resume: z.string({ required_error: "Resume is required" }),

  }),
});


// Update job application status schema
export const updateJobApplicationStatusSchema = object({
  params: object({
    jobApplicationId: string({
      required_error: "Job application ID is required", // Fixed spelling of "application"
    }),
  }),
  body: object({
    status: z.enum(["pending", "reviewed", "accepted", "rejected"], {
      required_error: "Status is required",
      invalid_type_error: "Invalid status value",
    }),
  }),
});

//delete application
export const deleteJobApplicantsSchema = z.object({
  params: object({
    jobApplicationId: string({ required_error: "application ID is required" }),
  }),
});

export type JobApplicationInput = TypeOf<
  typeof createJobApplicationSchema
>["body"];
