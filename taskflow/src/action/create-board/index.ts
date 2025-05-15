
import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateBoardSchema } from "./schema";
import { useApiRequest } from "@/action/auth";
import { useMemo } from "react";
import { useAuth } from '@clerk/clerk-react'
import {useCreateAuditLog} from "@/hooks/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/lib/type-log";
import { increaseAvailableCount, hasAvailableCount_or_getAvailableCount } from "../org-limit";
import { useCheckSubscription } from '@/lib/subscription';

export const useCreateBoard = () => {

  const { createAuditLog } = useCreateAuditLog();
  const { apiRequest } = useApiRequest();
  const { userId, orgId } = useAuth();
  const { checkSubscription } = useCheckSubscription();
  // define handler inside a hook
  const handler = useMemo(() => {
    return async (data: InputType): Promise<ReturnType> => {

      if (!userId || !orgId) {
        return {
          error: "Unauthorized.",
        };
      }
      const result = await hasAvailableCount_or_getAvailableCount(orgId, apiRequest);
      
      const isPro = await checkSubscription();

      if (!result.hasAvailableCount && !isPro) {
        return {
          error: "You have reached your limit of free boards. Please upgrade your plan to create more boards.",
        };
      }

      const { title, image } = data;

      const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUsername] =
      image.split("|");

      //console.log({imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUsername});

      if (
        !imageId ||
        !imageThumbUrl ||
        !imageFullUrl ||
        !imageLinkHTML ||
        !imageUsername
      ) {
        return {
          error: "Missing fields. Failed to create board.",
        };
      }

      try {
        const board = await apiRequest("/api/boards/", {
          image_id: imageId,
          image_thumb_url: imageThumbUrl,
          image_full_url: imageFullUrl,
          image_username: imageUsername,
          image_link_html: imageLinkHTML,
          organization: orgId,
          title,
        }, "POST");

        if (!isPro) {
        await increaseAvailableCount(orgId, apiRequest);
        }
        await createAuditLog({
          action: ACTION.CREATE,
          entityId: board.id,
          entityTitle: board.title,
          entityType: ENTITY_TYPE.BOARD,
        });
        return { data: board };
      } catch (error) {
        return { error: "Failed to create board." };
      }
    };
  }, [apiRequest]);


  return createSafeAction(CreateBoardSchema, handler);
};

