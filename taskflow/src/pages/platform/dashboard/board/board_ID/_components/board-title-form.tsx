import { Button } from "@/components/ui/button";
import { Board } from '@/action/update-board/types';
import { ElementRef, useRef, useState } from "react";
import FormInput from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { useUpdateBoard } from "@/action/update-board/index";
import { toast } from 'sonner';
import FormErrors from '@/components/form/form-errors';
import { useOrganization } from "@clerk/clerk-react";

interface IBoardTitleFormProps {
    data: Board;
}
const BoardTitleForm = ({ data }: IBoardTitleFormProps) => {

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setEditing] = useState(false);
    const [title, setTitle] = useState(data.title);

    const { membership } = useOrganization();
    const role = membership?.role;
    const isAdmin = role === "org:admin";


    const disableEditing = () => setEditing(false);
    const enableEditing = () => {
        if (!isAdmin) {
            toast.error("Only admins can rename the board.");
            return;
        }
        setEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
    
        });
    };


    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    const updateBoard = useUpdateBoard();
    const { execute, fieldErrors } = useAction(updateBoard, {
        onSuccess: (data) => {
            // console.log(data);
            toast.success(`Board ${data.title} updated!`);
            setTitle(data.title);
            disableEditing();
        },
        onError: (error) => {
            console.log(error);
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        execute({ title, id: data.id });
    };

    if (isEditing) {
        return (
            <form
                action={onSubmit}
                ref={formRef}
                className="flex items-center gap-x-2"
            >
                <FormInput
                    id="title"
                    ref={inputRef}
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-white border-none"
                />
                <FormErrors id='title' errors={fieldErrors} />

            </form>
        );
    }

    return (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className="font-bold text-lg h-auto w-auto py-1 px-2"
        >
            {title}
        </Button>
    );
};

export default BoardTitleForm;
