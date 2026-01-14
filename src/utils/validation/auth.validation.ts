import { z } from "zod";

class AuthValidation {
  // region register validation
  static registerUser = z.object({
    firstname: z
      .string()
      .min(1, "Name is Required")
      .max(50, "Name must be less than 50 character"),
    lastname: z
      .string()
      .max(50, "Name must be less than 50 characters")
      .optional(),
    bio: z.string().optional(),
    birthdate: z.string().min(1, "Birthdate is required"),
    title: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  static loginUser = z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 character")
      .max(50, "Password can not be more then 50 character"),
  });
}

export default AuthValidation;
