import { z } from "zod";
import { CreateAttachementSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof CreateAttachementSchema>;
export type ReturnType = ActionState<InputType, any>;
