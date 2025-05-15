import { z } from "zod";
import { DeleteListSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type List = any;

export type InputType = z.infer<typeof DeleteListSchema>;
export type ReturnType = ActionState<InputType, List>;
