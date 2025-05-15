import { z } from "zod";

export const updateCardsOrderSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      order: z.number(),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
});

 