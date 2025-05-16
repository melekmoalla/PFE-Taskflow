
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CopyCardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useCopyCard = () => {

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
      const { id  } = data;

      try {
        const copieCard = await apiRequest(`/api/board/card/${id}/`, null, "POST");

        //console.log(title);
        await createAuditLog({
          action: ACTION.COPY,
          entityId: copieCard.id,
          entityTitle: copieCard.title,
          entityType: ENTITY_TYPE.CARD,
        });
        return { data: copieCard };
      } catch (error) {
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(CopyCardSchema, handler);
};

