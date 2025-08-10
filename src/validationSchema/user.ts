import { z, object, string, TypeOf, boolean, array } from "zod";

export const createUserSchema = object({
  body: object({
    fullName: string({ required_error: "Fullname is required" }),
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),

    type: z.enum(["jobseeker", "employer"]).default("jobseeker"),
  }),
});

// verify Email
export const verifyEmailSchema = z.object({
  params: object({
    userId: string({ required_error: "User ID is required" }).min(
      1,
      "User ID cannot be empty"
    ),

    token: string({ required_error: "Token is required" }).min(
      1,
      "Token cannot be empty"
    ),
  }),
});

//login
export const loginSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),

    password: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),
  }),
});

//reset password
export const resetPasswordSchema = object({
  params: object({
    id: string({ required_error: "User ID is required" }).min(
      1,
      "User ID cannot be empty"
    ),
    token: string({ required_error: "Token is required" }).min(
      1,
      "Token cannot be empty"
    ),
  }),
  body: object({
    newPassword: string({
      required_error: "New password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),
  }),
});

// forgot password
export const forgotPasswordSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
  }),
});

// resend email verification
export const resendEmailVerificationSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
  }),
});

//change password
export const changePasswordSchema = object({
  body: object({
    currentPassword: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),

    newPassword: string({
      required_error: "Password is required",
    })
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&#]/, {
        message:
          "Password must contain at least one special character (@$!%*?&#)",
      }),
  }),
});

// update user profile
export const updateUserProfileSchema = object({
  body: object({
    fullName: string().optional(),
    email: string().email().optional(),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type verifyEmail = TypeOf<typeof verifyEmailSchema>["params"];
export type resetPasswordSchemaInput = TypeOf<
  typeof resetPasswordSchema
>["body"];
export type resendEmailVerificationSchemaInput = TypeOf<
  typeof resendEmailVerificationSchema
>["body"];
export type forgotPasswordSchemaInput = TypeOf<
  typeof forgotPasswordSchema
>["body"];
