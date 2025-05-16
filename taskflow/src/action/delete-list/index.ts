
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { DeleteListSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useDeleteList = () => {

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
      //onsole.log(data);
      const { id, boardId , title} = data;

      try {
       
        await apiRequest(`/api/list/${id}/?boardId=${boardId}`, null, "DELETE");

        await createAuditLog({
          action: ACTION.DELETE,
          entityId: id,
          entityTitle: title,
          entityType: ENTITY_TYPE.LIST,
        });

        return { data: 'ok' };

      } catch (error) {
        return { error: "Failed to Delete list." };
      }
    };
  }, [apiRequest]);


  return createSafeAction(DeleteListSchema, handler);
};

