
import { z } from "zod";

export const CopyCardSchema = z.object({

  id: z.number(),
  title: z.string(),

});