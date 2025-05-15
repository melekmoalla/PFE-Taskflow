
import { z } from "zod";

export const DeleteColorSchema = z.object({

  id: z.number(),
  title: z.string(),
  id_card: z.number(),

});
