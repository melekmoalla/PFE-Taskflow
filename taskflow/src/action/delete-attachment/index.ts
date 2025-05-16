
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { DeleteAttachmentSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useDeleteAttachment = () => {

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
      const { id, title , id_card} = data;

      try {
        await apiRequest(`/api/board/card/Attachment/${id}/`, null, "DELETE");

        await createAuditLog({
          action: ACTION.DELETE,
          entityId: id_card.toString(),
          entityTitle: title,
          entityType: ENTITY_TYPE.ATTACHMENT,
          action_description: null,
        });
        
        return { data: data };
      } catch (error) {
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(DeleteAttachmentSchema, handler);
};

