import { z } from "zod";

export const UpdateCardSchema = z.object({
  title: z
    .string({
      required_error: "Title is required.",
      invalid_type_error: "Title is required.",
    })
    .min(3, { message: "Title is too short" })
    .optional(),

  description: z
    .string({
      required_error: "Description is required.",
      invalid_type_error: "Description is required.",
    })
    .min(3, { message: "Description is too short" })
    .optional(),

  id: z.number(),
  colors: z.array(z.number()).optional(),
  members: z.array(z.number()).optional(),
  start_date:  z.unknown().optional(),
  due_date:  z.unknown().optional(),
  reminder_time:  z.unknown().optional(),
  time_date:   z.unknown().optional(),

});
