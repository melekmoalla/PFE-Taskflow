import { z } from "zod";
import { DeleteBoardSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";

export type Board = {
    id: number; // Django models have an auto-generated `id` by default
    organization: number; // Assuming you're referencing by ID
    title: string;
    description: string;
    owner: number; // Also referencing by user ID
    created_at: string; // Django DateTimeField → ISO string
    updated_at: string;
  };

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
