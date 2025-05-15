import { z } from "zod";
import { UpdateListSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type List = any;

export type InputType = z.infer<typeof UpdateListSchema>;
export type ReturnType = ActionState<InputType, List>;
