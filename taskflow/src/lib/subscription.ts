import { useAuth } from "@clerk/clerk-react";
import { useApiRequest } from "@/action/auth";

const DAY_IN_MS = 86_400_000;

export const useCheckSubscription = () => {
  const { orgId } = useAuth();
  const { apiRequest } = useApiRequest();

  const checkSubscription = async () => {
    if (!orgId) {
      return false;
    }

    const orgSubscription = await apiRequest(`/api/board/orgsubscription/${orgId}/`, null, "GET");
    //console.log("Org Subscription:", orgSubscription);
    if (!orgSubscription) {
      return false;
    }

    const currentPeriodEnd = new Date(orgSubscription.stripe_current_period_end).getTime();


    return !!(
      orgSubscription.stripe_price_id &&
      currentPeriodEnd + DAY_IN_MS > Date.now()
    );
  };

  return { checkSubscription };
};
