import { Suspense } from "react";
import Info from "../_components/info";
import { Separator } from "@/components/ui/separator";
import ActivityList from "./_components/activity-list";
import {  useEffect, useState } from "react";
import { useCheckSubscription } from "@/lib/subscription";

const ActivityPage = () => {

  const { checkSubscription } = useCheckSubscription();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      const isPro = await checkSubscription();
      setIsPro(isPro);
    };

    checkSubscriptionStatus();
  }, []);

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
