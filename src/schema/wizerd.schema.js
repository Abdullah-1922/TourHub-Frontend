import * as z from "zod";
export const WizerdSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Please provide a valid email.",
  }),
  image: z.string().min(1, { message: "Please upload a profile image" }),
});
