 
import { z } from "zod";

export const updateListOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      board: z.number(),
      title: z.string(),
      order: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
});

