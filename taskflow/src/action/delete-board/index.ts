
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType } from "./types";
import { DeleteBoardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";
import { decreaseAvailableCount } from "../org-limit";


export const useDeleteBoard = () => {

  const { createAuditLog } = useCreateAuditLog();
  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();
  // define handler inside a hook
  const handler = useMemo(() => {
    return async (data: InputType): Promise<any> => {
      if (!userId || !orgId) {
        return {
          error: "Unauthorized.",
        };
      }
      //onsole.log(data);
      const { id, title } = data;

      try {
       
        await apiRequest(`/api/board/${id}/?orgId=${orgId}`, null, "DELETE");

        await decreaseAvailableCount(orgId, apiRequest);
        await createAuditLog({
          action: ACTION.DELETE,
          entityId: id.toString(),
          entityTitle: title,
          entityType: ENTITY_TYPE.BOARD,
        });

        return { data: 'ok' };

      } catch (error) {
        return { error: "Failed to Delete board." };
      }
    };
  }, [apiRequest]);


  return createSafeAction(DeleteBoardSchema, handler);
};

