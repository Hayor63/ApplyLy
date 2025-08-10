import { object, string, z } from "zod";

export const jobSeekerSchema = z.object({
  body: object({
    userId: string().optional(),
    phoneNumber: z.string().optional(),
    // Allow empty strings but validate if provided
    bio: z
      .string()
      .optional()
      .or(z.string().min(1, "Bio cannot be empty if provided")),
    location: z
      .string()
      .optional()
      .or(z.string().min(1, "Location cannot be empty if provided")),
    resume: z
      .string()
      .optional()
      .or(z.string().min(1, "Resume cannot be empty if provided")),
    skills: z.array(z.string()).optional(),
    experiences: z
      .array(
        z.object({
          jobTitle: z.string().min(1, "Job title is required"),
          company: z.string().min(1, "Company is required"),
          location: z.string().optional(),
          startDate: z.coerce.date(),
          endDate: z.coerce.date().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
    education: z
      .array(
        z.object({
          institution: z.string().min(1, "Institution is required"),
          degree: z.string().min(1, "Degree is required"),
          fieldOfStudy: z.string().min(1, "Field of study is required"),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
          grade: z.string().optional(),
        })
      )
      .optional(),
    socialLinks: z
      .object({
        portfolio: z.string().url().optional(),
        github: z.string().url().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
      })
      .optional(),
  }),
});



//update job seeker profile schema
export const updateJobSeekerProfileSchema = z.object({
  body: object({
    phoneNumber: z.string().optional(),
    // Allow empty strings but validate if provided
    bio: z
      .string()
      .optional()
      .or(z.string().min(1, "Bio cannot be empty if provided")),
    location: z
      .string()
      .optional()
      .or(z.string().min(1, "Location cannot be empty if provided")),
    resume: z
      .string()
      .optional()
      .or(z.string().min(1, "Resume cannot be empty if provided")),
    skills: z.array(z.string()).optional(),
    experiences: z
      .array(
        z.object({
          jobTitle: z.string().min(1, "Job title is required"),
          company: z.string().min(1, "Company is required"),
          location: z.string().optional(),
          startDate: z.coerce.date(),
          endDate: z.coerce.date().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
    education: z
      .array(
        z.object({
          institution: z.string().min(1, "Institution is required"),
          degree: z.string().min(1, "Degree is required"),
          fieldOfStudy: z.string().min(1, "Field of study is required"),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
          grade: z.string().optional(),
        })
      )
      .optional(),
    socialLinks: z
      .object({
        portfolio: z.string().url().optional(),
        github: z.string().url().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
      })
      .optional(),
  }),
});

//get job seeker by ID schema
export const getJobSeekerByIdSchema = z.object({
  params: object({
    id: string({ required_error: "Job Seeker ID is required" }),
  }),
});

export type JobSeekerTypeInput = z.infer<typeof jobSeekerSchema>["body"];
export type UpdateJobSeekerProfileInput = z.infer<
  typeof updateJobSeekerProfileSchema
>["body"];
export type GetJobSeekerByIdInput = z.infer<
  typeof getJobSeekerByIdSchema
>["params"];
