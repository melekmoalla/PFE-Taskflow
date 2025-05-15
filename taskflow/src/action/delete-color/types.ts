import { z } from "zod";
import { DeleteColorSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof DeleteColorSchema>;
export type ReturnType = ActionState<InputType, any>;
