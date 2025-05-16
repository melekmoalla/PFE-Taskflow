
import {  useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import ListWrapper from './wrapper';
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import FormSubmit from "@/components/form/form-submit";
import FormInput from "@/components/form/form-input";
import {  useParams } from 'react-router-dom';
import { toast } from "sonner";
import { useAction } from "@/hooks/use-action";
import { useCreateListd } from "@/action/create-list/index";
import { useOrganization } from "@clerk/clerk-react";
import { Dispatch, SetStateAction } from 'react';

interface ListFormProps {
  setData: Dispatch<SetStateAction<any[]>>;
}
const ListForm = ({ setData }: ListFormProps) => {

    const formRef = useRef<HTMLFormElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { boardId } = useParams();
    const { membership } = useOrganization();
    const role = membership?.role;
    const isAdmin = role === "org:admin";


    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        if (!isAdmin) {
            toast.error("Only admins can Add a card.");
            return;
        }
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const createlistd = useCreateListd();
    const { execute, fieldErrors } = useAction(createlistd, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created`);
            disableEditing();
            setData(prev => [...prev, data]);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        execute({ title, boardId: boardId! });

    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef as React.RefObject<HTMLElement>, disableEditing);


    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    action={onSubmit}
                    className="w-full p-2 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        id="title"
                        ref={inputRef}
                        errors={fieldErrors}
                        className="text-sm px-2 py-1 h-7 border-transparent font-medium hover:border-input focus-within:border-input transition"
                        placeholder="Enter list title..."
                    />
                    <input
                        hidden
                        defaultValue={boardId}
                        name='boardId'
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>Add list</FormSubmit>
                        <Button onClick={disableEditing} size="sm" variant="ghost">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper>
            <button
                onClick={enableEditing}
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add a list
            </button>
        </ListWrapper>
    );
};

export default ListForm;