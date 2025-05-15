import { z } from "zod";
import { DeleteAttachmentSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";


export type InputType = z.infer<typeof DeleteAttachmentSchema>;
export type ReturnType = ActionState<InputType, any>;
