import { z } from "zod";
import { CreateCardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type Card = any;

export type InputType = z.infer<typeof CreateCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
