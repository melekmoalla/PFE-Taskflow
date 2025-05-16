
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateBoardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useUpdateBoard = () => {

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
      console.log(data);
      const { title, id } = data;

      try {
       
        const board = await apiRequest(`/api/board/${id}/?orgId=${orgId}`, {
            title,
          }, "PATCH");

        await createAuditLog({
          action: ACTION.UPDATE,
          entityId: id.toString(),
          entityTitle: title,
          entityType: ENTITY_TYPE.BOARD,
        });

        return { data: board };
      } catch (error) {
        return { error: "Failed to update board." };
      }
    };
  }, [apiRequest]);


  return createSafeAction(UpdateBoardSchema, handler);
};

