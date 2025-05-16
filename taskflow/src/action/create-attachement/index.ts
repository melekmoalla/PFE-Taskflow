import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateAttachementSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import { useCreateAuditLog } from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useCreateAttachement = () => {
  const { createAuditLog } = useCreateAuditLog();
  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();

  const handler = useMemo(() => {
    return async (data: InputType): Promise<ReturnType> => {
      if (!userId || !orgId) {
        return { error: "Unauthorized." };
      }

      const { link, id_card, description, file } = data;

      try {
        let createAttachmentResponse;

        if (file) {
          const formData = new FormData();
          formData.append('description', description ?? "");
          formData.append('file', file);
        
          createAttachmentResponse = await apiRequest(
            `/api/board/card/Attachment/?orgId=${orgId}&cardId=${id_card}`,
            formData,
            "POST"
          );
        } else {
          createAttachmentResponse = await apiRequest(
            `/api/board/card/Attachment/?orgId=${orgId}&cardId=${id_card}`,
            { description, link },
            "POST"
          );
        }

        await createAuditLog({
          action: ACTION.CREATE,
          entityId: id_card.toString(),
          entityTitle: description,
          entityType: ENTITY_TYPE.ATTACHMENT,
        });

        return { data: createAttachmentResponse };
      } catch (error) {
        return { error: "Failed to create new attachment." };
      }
    };
  }, [apiRequest, userId, orgId]);

  return createSafeAction(CreateAttachementSchema, handler);
};
