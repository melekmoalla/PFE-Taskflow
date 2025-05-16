
import {  useRef, useState } from "react";
import { Layout } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

//////////////////////////////////////////////

import { useAction } from "@/hooks/use-action";
import { useUpdateCard } from "@/action/update-card";
import FormInput from "@/components/form/form-input";

//////////////////////////////////////////////

const CardModalHeader = ({ data, refetchLists }: any) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(data.title);
    const queryClient = useQueryClient();

    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();
    };

    const UpdateCard = useUpdateCard();
    const { execute } = useAction(UpdateCard, {
        onSuccess: (data) => {
          

            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });
            refetchLists();
            toast.success(`Card renamed from "${title}" to "${data.title}".`);
            setTitle(data.title);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        if (title === data.title) {
            return;
        }
        execute({ title, id: data.id });
    };

    return (
        <div className="flex items-start gap-x-3 mb-6 w-full">

            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div className="w-full">
                <form action={onSubmit}>
                    <FormInput
                        id="title"
                        ref={inputRef}
                        onBlur={onBlur}
                        defaultValue={title}
                        className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                    />
                </form>
                <p className="text-sm text-muted-foreground">
                    in list <span className="underline">{data.list.title}</span>
                </p>
            </div>
        </div>
    );
};

CardModalHeader.Skeleton = function CardModalHeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div>
                <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
                <Skeleton className="w-12 h-4 bg-neutral-200" />
            </div>
        </div>
    );
};

export default CardModalHeader;