
import { z } from "zod";

export const DeleteCardSchema = z.object({

  id: z.number(),
  title: z.string(),

});