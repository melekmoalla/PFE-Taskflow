import { z } from "zod";
import { updateCardsOrderSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type List = any;

export type InputType = z.infer<typeof updateCardsOrderSchema>;
export type ReturnType = ActionState<InputType, List>;
