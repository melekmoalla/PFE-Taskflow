import { Skeleton } from "@/components/ui/skeleton";
import { AlignLeft } from "lucide-react";
import { useRef, useState, } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import FormTextarea from "@/components/form/form-textarea";
import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { useUpdateCard } from "@/action/update-card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";



const CardModalDescription = ({ data }: any) => {


    const queryClient = useQueryClient();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(data.description ?? "");

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    const disableEditing = () => setIsEditing(false);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);


    const UpdateCard = useUpdateCard();
    const { execute } = useAction(UpdateCard, {
        onSuccess: (data) => {
            setDescription(data.description);
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });
            
            toast.success(`Card "${data.title}" updated.`);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;

        execute({ id: data.id, description });
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">Description</p>
                {isEditing ? (
                    <form action={onSubmit} ref={formRef} className="space-y-2">
                        <FormTextarea
                            id="description"
                            name="description"
                            ref={textareaRef}
                            className="w-full mt-2"
                            defaultValue={description}
                            //onKeyDown={onTextAreaKeyDown}
                            placeholder="Add a more detailed description"
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>Save</FormSubmit>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size="sm"
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        role="button"
                        onClick={enableEditing}
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {description || "Add a more detailed description..."}
                    </div>
                )}
            </div>
        </div>
    );
};


CardModalDescription.Skeleton = function CardModalDescriptionSkeleton() {
    return (
        <div className="felx items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-[78px] bg-neutral-200" />
            </div>
        </div>
    );
};

export default CardModalDescription;