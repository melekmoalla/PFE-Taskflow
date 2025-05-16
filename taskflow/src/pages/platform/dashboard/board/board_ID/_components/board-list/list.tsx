
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { useRef } from "react";

//////////////////////////////////////////////

import FormSubmit from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { useDeleteList } from "@/action/delete-list/index";
import { useCopyList } from "@/action/copy-list/index";

//////////////////////////////////////////////

interface ListOptionsProps {
    onAddCard: () => void;
    data: any;
    refetchLists: () => void;
}

const ListOptions = ({ onAddCard, data, refetchLists }: ListOptionsProps) => {

    const closePopoverRef = useRef<HTMLButtonElement>(null);

    const deleteList = useDeleteList();
    const { execute } = useAction(deleteList, {
        onSuccess: () => {
            // console.log(data);
            toast.success(`List "${data.title}" Deleted`);
            refetchLists();
        },
        onError: (error) => {
            //console.log(error);
            toast.error(error);
        },
    });

    const onDelete = (FormData: FormData) => {
        const id = FormData.get('id') as string;
        const boardId = FormData.get('boardId') as string;

        const promise = execute({ id, boardId, title: data.title });
        toast.promise(promise, {
            loading: "Delete list loading...",
        });

    };

    const CopyList = useCopyList();
    const { execute: executeCopy } = useAction(CopyList, {
        onSuccess: (list) => {
            toast.success(`List "${list.title}" copied!`);
            closePopoverRef.current?.click();
            refetchLists();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCopy = (FormData: FormData) => {
        const id = FormData.get('id') as string;

        const promise = executeCopy({ id, title: data.title });
        toast.promise(promise, {
            loading: "Copy list loading...",
        });

    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2 hover:bg-black/5" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="px-0 pt-3 pb-3">
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List actions
                </div>
                <PopoverClose asChild>
                    <Button
                        ref={closePopoverRef}
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant="ghost"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    variant="ghost"
                    onClick={onAddCard}
                >
                    Add card...
                </Button>
                <form action={onCopy}>
                    <input type="hidden" name="id" id="id" defaultValue={data.id} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Copy list...
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input type="hidden" name="id" id="id" defaultValue={data.id} />
                    <input type="hidden" name="boardId" id="boardId" defaultValue={data.board} />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    >
                        Delete this list
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default ListOptions;