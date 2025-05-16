import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useRef, useState, useEffect } from "react";
import FormInput from "../../../form/form-input";
import FormSubmit from "../../../form/form-submit";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { useApiRequest } from "@/action/auth";
import { useAuth } from '@clerk/clerk-react'
import { useAction } from "@/hooks/use-action";
import { useCreateColor } from "@/action/create-color"
import Color from './list-color';





export const FormPopoverLabel = ({
    children,
    boardId,
    cardId,
    select,

}: {
    children: React.ReactNode;
    boardId: string;
    cardId: number;
    select: any;
}) => {
    //console.log(select)
    const [isEditing, setIsEditing] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [labels, setLabels] = useState([]);
    const [refreshLabels, setRefreshLabels] = useState(false);

    const closeRef = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();

    const enableEditing = () => {
        setIsEditing(true);
    };

    const disableEditing = () => {
        // console.log("disableEditing");
        setIsEditing(false);
    };


    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const { orgId } = useAuth();

    const fetchcolor = async () => {

        if (!orgId) {
            navigate("/select-org");
            return;
        }

        try {
            const response = await apiRequest(`/api/board/card/color/?orgId=${orgId}&boardId=${boardId}`, null, 'GET');

            if (!response) {
                toast.error('Error occurred while fetching data');
                return;
            }
            //console.log(response);
            //console.log(response)
            setLabels(
                response.map((label: any) => ({
                    ...label,
                    isSelected: select.includes(label.id)
                }))
            );

            //console.log(labels)

        } catch (error: any) {
            console.error('Failed to fetch List:', error.message);
            navigate("/error");
        }
    };


    useEffect(() => {
        fetchcolor();
    }, [orgId, refreshLabels]);

    // //////////////////////////
    const createColor = useCreateColor();
    const { execute: executeCreateColor, fieldErrors: errorCreateColor } = useAction(createColor, {
        onSuccess: (data) => {
            //console.log(data)
            toast.success(`Crate new color "${data.title}".`);
            setIsEditing(false);
            queryClient.invalidateQueries({
                queryKey: ["card-logs", cardId],
            });
            setRefreshLabels((prev) => !prev);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onCreate = (formData: FormData) => {
        const title = formData.get("title") as string;
        const color = formData.get("color") as string;
        // console.log(boardId)
        const result = executeCreateColor({ boardId: boardId, title, color, id_card: cardId });
        toast.promise(result, {
            loading: "Card reorder loading...",
            success: "Card color updated successfully!",
            error: "Failed to update card color.",
        });
    };



    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => {
                setIsPopoverOpen(open);
                if (!open) {
                    disableEditing();
                }
            }}
        >
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                className="px-0 pt-3 pb-3 w-80"
            >
                {isEditing && (
                    <Button
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 left-2 text-neutral-600"
                        onClick={disableEditing}
                    >
                        ← Back
                    </Button>
                )}
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    {isEditing ? "Create Label" : "Manage Labels"}
                </div>

                <PopoverClose asChild>
                    <Button
                        ref={closeRef}
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>

                {isEditing ? (
                    <form action={onCreate} className="space-y-4 px-4">
                        <div className="flex items-center gap-2 p-2 rounded hover:bg-neutral-100">
                            <FormInput
                                id="title"
                                type="text"
                                placeholder="Label name"
                                errors={errorCreateColor}
                            />
                            <FormInput
                                id="color"
                                className="w-14 h-8"
                                type="color"
                                defaultValue="#0000ff"
                            />
                        </div>
                        <div className="pb-2">
                            <FormSubmit variant="default">Create Label</FormSubmit>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-2">
                        <div className="max-h-48 overflow-y-auto px-4">
                            {labels.map((label: any) => (
                                <div key={label.id} >
                                    <Color label={label} disableEditing={disableEditing} setRefreshLabels={setRefreshLabels} cardId={cardId} labels={labels}
                                        setLabels={setLabels} />
                                </div>
                            ))}

                        </div>
                        <div className="px-4 pt-4 pb-2">
                            <Button
                                variant="default"
                                onClick={enableEditing}
                                className="w-full"
                            >
                                Create New Label
                            </Button>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};