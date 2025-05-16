import { Skeleton } from "@/components/ui/skeleton";
import { Paperclip, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAction } from "@/hooks/use-action";
import { useDeleteAttachment } from "@/action/delete-attachment";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Attachment {
    id: number;
    link?: string;
    file?: string;
    description?: string;
}

interface CardModalAttachmentProps {
    data: Attachment[];
    id_card: any;
    title: string;
}

const MAX_VISIBLE = 4;

const CardModalAttachment = ({ data, id_card, title }: CardModalAttachmentProps) => {
    const queryClient = useQueryClient();
    const [expanded, setExpanded] = useState(false);

    if (!data || data.length === 0) {
        return null;
    }

    const DeleteAttachment = useDeleteAttachment();
    const { execute: executeDelete } = useAction(DeleteAttachment, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attachment", id_card] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", id_card] });
            toast.success(`Removed attachment from card "${title}".`);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const handleDelete = (id: number, description?: string) => {
        executeDelete({ id, title: description ?? "", id_card });
    };

    const sortedData = [...data].reverse();
    const visibleData = expanded ? sortedData : sortedData.slice(0, MAX_VISIBLE);
    
    const downloadFile = (url: string, filename: string) => {
        fetch(url, {
            mode: 'cors',
        })
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(() => alert('Failed to download file'));
    };


    return (
        <div className="flex items-start gap-x-3 w-full">
            <Paperclip className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-neutral-700 mb-2">Attachments</p>
                    {data.length > MAX_VISIBLE && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs px-2 py-1"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "Show Less" : `Show ${data.length - MAX_VISIBLE} More`}
                        </Button>
                    )}
                </div>

                <div className="mt-2 max-h-64 overflow-y-auto space-y-2 pr-2">
                    {visibleData.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="p-2 border rounded-md bg-gray-50 flex justify-between items-center"
                        >
                            {attachment.link ? (
                                <a
                                    href={attachment.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {attachment.description || attachment.link}
                                </a>
                            ) : (
                                <button
                                    onClick={() => downloadFile(attachment.file ?? "", attachment.description || "downloaded-file")}
                                    className="text-blue-600 underline cursor-pointer" 
                                >
                                    {attachment.description || "Download file"}
                                </button>

                            )}
                            <button
                                type="button"
                                onClick={() => handleDelete(attachment.id, attachment.description)}
                                title="Delete Attachment"
                            >
                                <Trash2 className="h-4 w-4 cursor-pointer" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CardModalAttachment.Skeleton = function CardModalAttachmentSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-10 bg-neutral-200" />
            </div>
        </div>
    );
};

export default CardModalAttachment;
