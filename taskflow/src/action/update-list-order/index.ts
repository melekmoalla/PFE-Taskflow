
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { updateListOrderSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'


export const useupdateListOrder = () => {

  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();
  // define handler inside a hook
  const handler = useMemo(() => {
    return async (data: InputType): Promise<ReturnType> => {
      if (!userId || !orgId) {
        return {
          error: "Unauthorized.",
        };
      }
      //console.log(data);
      const { items  } = data;

      try {
       // console.log(boardId)
        const list = await apiRequest(`/api/board/list/order/update/`, {
          items
        }, "POST");
        return { data: list };
      } catch (error) {
        return { error: "Failed to update list order." };
      }
    };
  }, [apiRequest]);


  return createSafeAction(updateListOrderSchema, handler);
};

