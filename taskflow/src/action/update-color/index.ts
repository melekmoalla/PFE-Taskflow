
import { useMemo, useEffect, useRef } from "react";
import { useAuth } from '@clerk/clerk-react'

//////////////////////////////////////////////

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { updateColorSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";
import { useBoard } from "@/hooks/use-board";

//////////////////////////////////////////////

export const useUpdateColor = () => {

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
      //console.log(data);
      const {  title, color, id_card, id  } = data;

      
      try {
        const copieCard = await apiRequest(`/api/board/card/color/${id}/`, 
          {title, color}, "PATCH");
        
        //console.log(title);
        await createAuditLog({
          action: ACTION.UPDATE,
          entityId: id_card.toString(),
          entityTitle: freshDescriptionAuditRef.current ?? undefined,
          entityType: ENTITY_TYPE.COLOR,
        });
        setDescription_audit(null);
        return { data: copieCard };
      } catch (error) {
        setDescription_audit(null);
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(updateColorSchema, handler);
};

