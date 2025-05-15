"use client";
import { useStripeRedirect } from "@/action/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import useProModal from "@/hooks/use-pro-modal";
import { toast } from "sonner";


const SubscriptionButton = ({ isPro }: {isPro: boolean}) => {
  const { onOpen } = useProModal();
  const StripeRedirect = useStripeRedirect();

  const { execute, isLoading } = useAction(StripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };

  return (
    <Button variant="primary" disabled={isLoading} onClick={onClick}>
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  );
};

export default SubscriptionButton;