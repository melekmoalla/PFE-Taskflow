import { z } from "zod";
import { UpdateCardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof UpdateCardSchema>;
export type ReturnType = ActionState<InputType, any>;
