import { z } from "zod";
import { stripeRedirect } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof stripeRedirect>;
export type ReturnType = ActionState<InputType, string>;
