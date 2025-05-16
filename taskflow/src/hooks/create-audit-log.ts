import { useAuth, useUser } from '@clerk/clerk-react';
import { useApiRequest } from "@/action/auth";
import { useBoard } from "@/hooks/use-board";

interface Props {
  entityId?:  string | number;
  entityType?: any;
  entityTitle?: string;
  action?: any;
  action_description?: string | null;
}


export const useCreateAuditLog = () => {

  const { orgId } = useAuth();
  const {user} = useUser();
  const { apiRequest } = useApiRequest();
  const  { board } = useBoard();

  const createAuditLog = async (props: Props) => {
    try {
      if (!user || !orgId) throw new Error("User not found!!");

      const { entityId, entityTitle, entityType, action, action_description = null } = props;


      await apiRequest("/api/board/card/createAuditLog/", {
        org: orgId,
        entityId,
        entityType,
        entityTitle,
        userId: user.id,
        action,
        action_description,
        userImage: user.imageUrl,
        userName: `${user.firstName} ${user.lastName}`,
        entityBoard: board.title,
      }, "POST");

    } catch (error) {
      console.error("[AUDIT_LOG_ERROR]", error);
    }
  };

  return { createAuditLog };
};
