
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CopyListSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";

export const useCopyList = () => {

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
      const { id } = data;

      try {
        const copiedList = await apiRequest(`/api/list/${id}/`, null, "POST");

        await createAuditLog({
          action: ACTION.COPY,
          entityId: copiedList.id,
          entityTitle: copiedList.title,
          entityType: ENTITY_TYPE.LIST,
        });

        return { data: copiedList };
      } catch (error) {
        return {
          error: "Failed to copy list.",
        };
      }
    };
  }, [apiRequest, userId, orgId]);


  return createSafeAction(CopyListSchema, handler);
};

