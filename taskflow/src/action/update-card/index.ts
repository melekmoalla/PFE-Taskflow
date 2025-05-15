
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from '@clerk/clerk-react'

//////////////////////////////////////////////

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { UpdateCardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useCreateAuditLog } from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";
import { useBoard } from "@/hooks/use-board";

//////////////////////////////////////////////


export const useUpdateCard = () => {
  const { createAuditLog } = useCreateAuditLog();
  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();
  const { description_audit, setDescription_audit } = useBoard();
  const freshDescriptionAuditRef = useRef(description_audit);

  useEffect(() => {
    freshDescriptionAuditRef.current = description_audit;
  }, [description_audit]);

  const handler = useMemo(() => {
    return async (data: InputType): Promise<ReturnType> => {
      if (!userId || !orgId) {
        return {
          error: "Unauthorized.",
        };
      }

      const { id, ...values } = data;

      try {
        const Card = await apiRequest(`/api/board/card/order/update/${id}/`, values, "PATCH");

        const freshDescriptionAudit = freshDescriptionAuditRef.current;

        await createAuditLog({
          action: ACTION.UPDATE,
          entityId: Card.id,
          entityTitle: Card.title,
          entityType: ENTITY_TYPE.CARD,
          action_description: freshDescriptionAudit || null,
        });
        setDescription_audit(null);
        return { data: Card };
      } catch (error) {
        setDescription_audit(null);
        return { error: "Failed to update card." };
      }
    };
  }, [apiRequest, createAuditLog, userId, orgId]);

  return createSafeAction(UpdateCardSchema, handler);
};
