import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import FormInput from "../../../form/form-input";

//////////////////////////////////////////////

import { useAction } from "@/hooks/use-action";
import { useUpdateCard } from "@/action/update-card";
import { useDeleteColor } from "@/action/delete-color"
import { useUpdateColor } from "@/action/update-color"
import { useBoard } from "@/hooks/use-board";

//////////////////////////////////////////////

interface Label {
    id: string;
    title: string;
    color: string;
    isSelected?: boolean;
}

interface ColorProps {

    label: Label;
    cardId: number;
    disableEditing: () => void;
    setRefreshLabels: React.Dispatch<React.SetStateAction<boolean>>;
    labels: any;
    setLabels: React.Dispatch<React.SetStateAction<any>>;


}

const Color = ({ label, disableEditing, setRefreshLabels, cardId, labels, setLabels }: ColorProps) => {


    const actionRef = useRef<boolean | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const queryClient = useQueryClient();
    const [title, setTitle] = useState(label.title);

    // //////////////////////////
    const { setDescription_audit } = useBoard();

    const updatecolor = useUpdateColor();
    const { execute: executeUpdateColor, fieldErrors: errorUpdateColor } = useAction(updatecolor, {
        onSuccess: (data) => {
            //console.log(data)
            setRefreshLabels((prev) => !prev);
            queryClient.invalidateQueries({ queryKey: ["card", cardId] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", cardId] });

            if (title !== data.title)
                toast.success(`label title from "${title}" to "${data.title}" color`);
            else
                toast.success(`${title}`);
            setTitle(data.title)
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onUpdate = (formData: FormData) => {
        const id = formData.get("id") as string;
        const title_new = formData.get("title") as string;
        const color = formData.get("color") as string;
        //console.log(color);
        if (title !== title_new)
            setDescription_audit(`Update label title from "${title}" to "${title_new}" color.`)
        else
            setDescription_audit(`Update color of the label "${title}".`)
        const result = executeUpdateColor({ id, title: title_new, color, id_card: cardId });
        toast.promise(result,
            {
                loading: "Card reorder loading...",
                success: "Card color updated successfully!",
                error: "Failed to update card color.",
            }
        );

    };

    // //////////////////////////
    const UpdateCard = useUpdateCard();
    const { execute: executeToggleLabel } = useAction(UpdateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["card", cardId] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", cardId] });

            if (actionRef.current)
                toast.success(`Label added to card "${data.title}".`);
            else
                toast.success(`Label removed from card "${data.title}".`);


            disableEditing();

        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const handleLabelToggle = (labelId: string, isSelected: boolean) => {

        actionRef.current = isSelected;
        const updatedLabels = labels.map((label: Label) =>
        label.id === labelId ? { ...label, isSelected } : label
        );


        setLabels(updatedLabels);

        const selectedLabels = updatedLabels
            .filter((label: any) => label.isSelected)
            .map((label: any) => label.id);


        if (isSelected)
            setDescription_audit('Added label');
        else
            setDescription_audit('Removed label');

        executeToggleLabel({ id: cardId, colors: selectedLabels });
    };


    // //////////////////////////
    const DeleteColor = useDeleteColor();
    const { execute: executeDelete } = useAction(DeleteColor, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["card", cardId] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", cardId] });

            setRefreshLabels((prev) => !prev);

            toast.success(`Delete  "${data.title}" color .`);
        },
        onError: (error) => {
            toast.error(error);
        },
    });


    const handleDelete = (id: number, title: string) => {

        executeDelete({ id, title, id_card: cardId });

    };


    const onBlur = () => {
        formRef.current?.requestSubmit();
    };


    return (
        <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-100">
            <input
                type="checkbox"
                checked={label.isSelected || false}
                onChange={(e) => handleLabelToggle(label.id, e.target.checked)}
                className="mr-2"
            />

            <form action={onUpdate} className="flex items-center gap-2" ref={formRef}>
                <input type="hidden" name="id" defaultValue={label.id} />
                <FormInput
                    onBlur={onBlur}
                    id="title"
                    defaultValue={title}
                    placeholder="Name label.."
                    errors={errorUpdateColor}

                />
                <FormInput
                    onBlur={onBlur}
                    id="color"
                    defaultValue={label.color}
                    className="w-8 h-8 p-1"
                    type="color"
                />
            </form>
            <button
                type="button"
                onClick={() => handleDelete(Number(label.id), label.title)}
                title="Delete Label"
            >
                <Trash className="w-4 h-4" />
            </button>
        </div >
    );
}

export default Color;