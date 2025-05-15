import { useCheckSubscription } from "@/lib/subscription";
import Info from "../_components/info";
import { Separator } from "@/components/ui/separator";
import SubscriptionButton from "./_components/subscription-button";
import {  useEffect, useState } from "react";

const BillingPage =  () => {
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
            <SubscriptionButton isPro={isPro} />
        </div>
    );
};

export default BillingPage;