import { z } from "zod";


const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".gif"];

export const CreateAttachementSchema = z
  .object({
    id_card: z.number(),
    link: z
      .string({
        required_error: "Link is required.",
        invalid_type_error: "Link must be a string.",
      })
      .min(3, { message: "Link is too short" })
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(val),
        { message: "Link must be a valid URL" }
      ),
    description: z.string().optional(),
    file: z
      .instanceof(File)
      .optional()
      .nullable()
      .refine((file) => !file || file.size > 0, {
        message: "File cannot be empty.",
      })
      .refine((file) => {
        if (!file) return true; 
        const lowerName = file.name.toLowerCase();
        return allowedExtensions.some((ext) => lowerName.endsWith(ext));
      }, {
        message: `File extension must be one of: ${allowedExtensions.join(", ")}`,
      }),
  })
  .superRefine((data, ctx) => {
    const hasFile = !!data.file;
    const hasLink = !!data.link;
    const hasDescription = !!data.description;

    if (!hasFile && (!hasLink || !hasDescription)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "You must provide either a file or both a link and description.",
        path: ["file"],
      });
    }

    if (hasLink && !hasDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required when link is provided.",
        path: ["description"],
      });
    }
  });
