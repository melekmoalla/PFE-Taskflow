
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { DeleteCardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const usedeleteCard = () => {

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
      const { id, title } = data;

      try {
        await apiRequest(`/api/board/card/${id}/`, null, "DELETE");

        await createAuditLog({
          action: ACTION.DELETE,
          entityId: id.toString(),
          entityTitle: title,
          entityType: ENTITY_TYPE.CARD,

        });
        
        return { data: 'delete' };
      } catch (error) {
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(DeleteCardSchema, handler);
};

