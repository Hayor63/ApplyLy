import { object, string, TypeOf, z} from "zod";

export const createEmployerSchema = object({
  body: object({
    companyName: string({
      required_error: "Company name is required",
    }),

    userId: string({
      required_error: "User ID is required",
    }).optional(),
    companyWebsite: string()
      .url("Invalid company website URL")
      .optional(),

    companyDescription: string().optional(),

    companySize: string().optional(),

    industry: string().optional(),

    companyLocation: string().optional(),
  }),
});

// Update employer profile schema
export const updateEmployerSchema = object({
  body: object({
    companyName: string().optional(),

    companyWebsite: string()
      .url("Invalid company website URL")
      .optional(),

    companyDescription: string().optional(),

    companySize: string().optional(),

    industry: string().optional(),

    companyLocation: string().optional(),
  }),
});


//get employer by ID schema
export const getEmployerByIdSchema = object({   
  params: object({
    id: string({ required_error: "Employer ID is required" }),
  }),
});

//delete employer by ID schema
export const deleteEmployerByIdSchema = object({
  params: object({
    id: string({ required_error: "Employer ID is required" }),
  }),
});

export type CreateEmployerInput = TypeOf<typeof createEmployerSchema>["body"];
export type UpdateEmployerInput = TypeOf<typeof updateEmployerSchema>["body"];
export type GetEmployerByIdInput = TypeOf<typeof getEmployerByIdSchema>["params"];
export type DeleteEmployerByIdInput = TypeOf<typeof deleteEmployerByIdSchema>["params"];
