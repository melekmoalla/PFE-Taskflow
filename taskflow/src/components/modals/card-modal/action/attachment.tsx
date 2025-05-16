
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FormSubmit from "../../../form/form-submit";
import { toast } from "sonner";
import { useRef } from 'react';
import { useQueryClient } from "@tanstack/react-query";


//////////////////////////////////////////////

import FormInput from "../../../form/form-input";
import FormErrors from "../../../form/form-errors";
import { useAction } from "@/hooks/use-action";
import { useCreateAttachement } from "@/action/create-attachement";

//////////////////////////////////////////////

interface attachementProps {
    children: React.ReactNode;
    cardId: number;
    title: string;
}
const Attachment = ({ children, cardId, title }: attachementProps) => {

    const closeRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const queryClient = useQueryClient();

    const CreateAttachment = useCreateAttachement();
    const { execute: executeCreateAttachement, fieldErrors } = useAction(CreateAttachment, {
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: ["attachment", cardId] });
            queryClient.invalidateQueries({
                queryKey: ["card-logs", cardId],
            });
            closeRef.current?.click();
            toast.success(`Create attachment from card "${title}".`);

        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSave = (formData: FormData) => {

        const link = formData.get("link") as string;
        const description = formData.get("description") as string;
        executeCreateAttachement({ link, description, id_card: cardId });
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const description = selectedFile.name;
            executeCreateAttachement({ file: selectedFile, id_card: cardId, description });
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                side="bottom"
                sideOffset={4}
                align="end"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Attachement
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
                <div className="space-y-2 px-4">
                    <p className="text-sm">Attach a file from your computer</p>
                    <p className="text-sm text-muted-foreground">
                        You can also drag and drop files to upload them.
                    </p>
                    <div className="pt-4 pb-2">
                        <Button
                            variant="default"
                            className="w-full"
                            onClick={handleButtonClick}
                        >
                            Choose a file
                        </Button>
                        <FormErrors errors={fieldErrors} id='file' />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFile}
                        />
                    </div>
                    <Separator className="my-4" />
                </div>
                <form action={onSave}>
                    <div className="space-y-4 px-4">
                        <FormInput
                            type="text"
                            label="Link"
                            id="link"
                            placeholder="A new link"
                            errors={fieldErrors}
                        />
                        <FormInput
                            type="text"
                            label="Description"
                            id="description"
                            placeholder="Description"
                            errors={fieldErrors}
                        />
                    </div>

                    <div className="px-4 pt-4 pb-2">
                        <FormSubmit variant="default" className="w-full">Save</FormSubmit>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
};

export default Attachment;