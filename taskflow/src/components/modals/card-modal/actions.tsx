
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Trash, Tags, CalendarCheck2, UserRound, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import useCardModal from "@/hooks/use-card-modal";
import { useCopyCard } from "@/action/copy-card";
import { usedeleteCard } from "@/action/delete-card";
import { FormPopoverLabel } from "./action/labels";
import { CalendarForm } from './calendar';
import Assign from './action/assign';
import Attachment from './action/attachment'

const CardModalActions = ({ data, refetchLists, boardId }: any) => {

    //console.log(data)
    const { onClose } = useCardModal();
    const copyCard = useCopyCard();
    const { execute: executeCardCopy, isLoading: isCardCopyLoading } = useAction(
        copyCard,
        {
            onSuccess: () => {
                toast.success(`Card "${data.title}" copied.`);
                refetchLists();
                onClose();
            },
            onError: (error) => {
                toast.error(error);
            },
        }
    );

    const deleteCard = usedeleteCard();
    const { execute: executeCardDelete, isLoading: isCardDeleteLoading } = useAction(deleteCard, {
        onSuccess: () => {
            toast.success(`Card "${data.title}" deleted.`);
            refetchLists();
            onClose();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCopy = () => {
        executeCardCopy({ id: data.id, title: data.title });
    };

    const onDelete = () => {
        executeCardDelete({ id: data.id, title: data.title });
    };
const SelectColors = (data.colors as { id: string }[]).map((label) => label.id);
const SelectMembers = (data.members as { id: string }[]).map((assign) => assign.id);


    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">Actions</p>

            <CalendarForm data={data}>
                <Button
                    variant={"gray"}
                    className="w-full justify-start"
                    size="inline"
                >
                    <CalendarCheck2 className="h-4 w-4 mr-2" />
                    Dates
                </Button>
            </CalendarForm>
            <Assign cardId={data.id} select={SelectMembers} >
                <Button
                    variant={"gray"}
                    className="w-full justify-start"
                    size="inline"
                >
                    <UserRound className="h-4 w-4 mr-2" />
                    Assign
                </Button>
            </Assign>
            <Attachment cardId={data.id} title={data.title}>
                <Button
                    variant={"gray"}
                    className="w-full justify-start"
                    size="inline"
                >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attachement
                </Button>
            </Attachment>
            <FormPopoverLabel
                select={SelectColors}
                cardId={data.id}
                boardId={boardId} >
                <Button
                    variant={"gray"}
                    className="w-full justify-start"
                    size="inline"
                >
                    <Tags className="h-4 w-4 mr-2" />
                    Labels
                </Button>
            </FormPopoverLabel>

            <Button
                onClick={onCopy}
                variant={"gray"}
                disabled={isCardCopyLoading || isCardDeleteLoading}
                className="w-full justify-start"
                size="inline"
            >
                <Copy className="h-4 w-4 mr-2" />
                Copy
            </Button>
            <Button
                variant={"gray"}
                onClick={onDelete}
                disabled={isCardDeleteLoading || isCardCopyLoading}
                className="w-full justify-start"
                size="inline"
            >
                <Trash className="h-4 w-4 mr-2" />
                Delete
            </Button>

        </div>
    );
};


CardModalActions.Skeleton = function CardModalActionsSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    );
};
export default CardModalActions;