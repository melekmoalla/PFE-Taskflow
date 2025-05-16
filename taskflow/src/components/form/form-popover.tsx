
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { useCreateBoard } from "@/action/create-board/index";
import FormInput from "./form-input";
import FormSubmit from "./form-submit";
import { toast } from 'sonner';
import { FormPicker } from './form-picker';
import React, {  useRef } from "react";
import { useNavigate } from 'react-router-dom';
import useProModal from "@/hooks/use-pro-modal";
import { useOrganization } from '@clerk/clerk-react';

interface IFormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "bottom" | "top";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
}: IFormPopoverProps) => {
    
    const ProModal = useProModal();
    const navigate = useNavigate();
    const createBoard = useCreateBoard();
    const closeRef = useRef<HTMLButtonElement>(null);
    const { membership } = useOrganization();
    const role = membership?.role;

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            // console.log(data);
            closeRef.current?.click();
            toast.success('Board created');
            navigate(`/board/${data.id}`);
        },
        onError: (error) => {
            // console.log(error);  
            toast.error(error);
            ProModal.onOpen();
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image });
    };
    if (role !== 'org:admin') {
        return (
            <Popover>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
                <PopoverContent
                    align={align}
                    className="w-80 pt-4 pb-6 px-4 bg-white shadow-lg rounded-md"
                    side={side}
                    sideOffset={sideOffset}
                >
                    <div className="flex flex-col items-center text-center text-neutral-700 space-y-2">
                        <X className="h-8 w-8 text-red-500" />
                        <p className="text-sm font-semibold">Permission Denied</p>
                        <p className="text-xs text-neutral-500">
                            Only organization admins can create new boards. Contact your admin if you need access.
                        </p>
                    </div>
                    <PopoverClose asChild ref={closeRef}>
                        <Button
                            variant="ghost"
                            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </PopoverClose>
                </PopoverContent>
            </Popover>

        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board
                </div>
                <PopoverClose asChild ref={closeRef}>
                    <Button
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker id='image' errors={fieldErrors} />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                        <FormSubmit className="w-full">Create</FormSubmit>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
};



export default FormPopover;