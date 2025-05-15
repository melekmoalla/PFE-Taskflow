
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateListSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useCreateListd = () => {

  const { createAuditLog } = useCreateAuditLog();
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
      const { title, boardId } = data;

      try {
       // console.log(boardId)
        const list = await apiRequest(`/api/board/${boardId}/list/`, {
          title
        }, "POST");

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: list.id,
          entityTitle: list.title,
          entityType: ENTITY_TYPE.LIST,
        });

        return { data: list };
      } catch (error) {
        return {   error: "Failed to create list.", };
      }
    };
  }, [apiRequest]);


  return createSafeAction(CreateListSchema, handler);
};

