import { z } from "zod";
import { CreateColorSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof CreateColorSchema>;
export type ReturnType = ActionState<InputType, any>;
