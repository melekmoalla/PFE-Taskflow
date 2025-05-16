import  { useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import FormInput from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { useUpdateBoard } from "@/action/update-list/index";
import ListOptions from './list';


interface IListHeaderProps {
    data: any;
    onAddCard: () => void;
    refetchLists: () => void;
}

const ListHeader = ({ data, onAddCard, refetchLists }: IListHeaderProps) => {

    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);
    const formRef =  useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => setIsEditing(false);

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);

    const createlistd = useUpdateBoard();
    const { execute, fieldErrors } = useAction(createlistd, {
        onSuccess: (data) => {

            toast.success(`List title renamed from "${title}" to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        if (title === data.title) {
            return disableEditing();
        }
        console.log(data);
        
        execute({ title, listId: data.id  });

    };

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ? (
                <form action={onSubmit} ref={formRef} className="flex-1 px-0.5">
                    <FormInput
                        errors={fieldErrors}
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        defaultValue={title}
                        placeholder="Enter list title.."
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                    />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
                >
                    {title}
                </div>
            )}
            <ListOptions onAddCard={onAddCard} data={data} refetchLists={refetchLists} />

        </div>
    );
};

export default ListHeader;