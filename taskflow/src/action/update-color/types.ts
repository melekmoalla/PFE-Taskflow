import { z } from "zod";
import { updateColorSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof updateColorSchema>;
export type ReturnType = ActionState<InputType, any>;
