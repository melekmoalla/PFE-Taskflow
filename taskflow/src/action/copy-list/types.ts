import { z } from "zod";
import { CopyListSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type List = any;

export type InputType = z.infer<typeof CopyListSchema>;
export type ReturnType = ActionState<InputType, List>;
