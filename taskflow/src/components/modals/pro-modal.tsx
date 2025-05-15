import { Button } from "@/components/ui/button";
import useProModal from "@/hooks/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import {useStripeRedirect} from "@/action/stripe-redirect";
import { toast } from 'sonner';


const ProModal = () => {
  const { onClose, isOpen } = useProModal();

  const StripeRedirect = useStripeRedirect();

  const { execute, isLoading } = useAction(StripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      // console.log(error);  
      toast.error(error);

    },
  });
 
  const onClick = () => {
    execute({});
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <img
            src="/hero.png"
            alt="Hero"
            className="absolute  w-100 h-100 object-cover"
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-4 p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-2">
              Upgrade to Pro Plan
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Unlock the full potential! Get more boards and advanced features for just $100.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 pt-2 text-left text-sm">
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Unlimited Boards</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Advanced Checklists & Fields</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Priority Support</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>And much more!</span>
            </div>
          </div>
          <Button
            disabled={isLoading}
            onClick={onClick}
            className="w-full"
            variant="primary"
          >
            Upgrade
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
};


export default ProModal;