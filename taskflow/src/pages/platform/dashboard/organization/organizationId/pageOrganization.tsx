
import Info from "./_components/info";
import { BoardList } from "./_components/board-list";
import { Separator } from "@/components/ui/separator";
import { Suspense, useEffect, useState } from "react";
import { useCheckSubscription } from "@/lib/subscription";

const OrganizationIdPage = () => {
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
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4 ">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>

      </div>
    </div>
  );
};

export default OrganizationIdPage;
