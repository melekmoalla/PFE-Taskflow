
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateColorSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useCreateColor = () => {

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
      const { boardId , title, color, id_card  } = data;

      try {
        const createColor = await apiRequest(
          `/api/board/card/color/?orgId=${orgId}&boardId=${boardId}`,
          { title, color },
          "POST"
        );

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: id_card ,
          entityTitle: title,
          entityType: ENTITY_TYPE.COLOR,
        });
        return { data: createColor };
      } catch (error) {
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(CreateColorSchema, handler);
};

