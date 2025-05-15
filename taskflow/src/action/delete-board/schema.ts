import { z } from "zod";

export const DeleteBoardSchema = z.object({

  id: z.number(),
  title: z.string(),

});