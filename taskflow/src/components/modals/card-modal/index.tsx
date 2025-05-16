
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, isPast } from "date-fns";
import CardModalAttachment from './attachment-modal';


//////////////////////////////////////////////

import { useApiRequest } from "@/action/auth";
import useCardModal from "@/hooks/use-card-modal";
import fetchCardById from "@/pages/api/cards/cardFetch";
import { fetchAuditLogs } from "@/pages/api/cards/logs/auditLogs";
import CardModalHeader from "./header";
import CardModalDescription from "./description";
import CardModalActions from "./actions";
import CardModalActivity from "./activity";
import { CalendarForm } from './calendar';
import fetchAttachment from "@/pages/api/cards/attachmentFetch";

//////////////////////////////////////////////

const CardModal = () => {
    const { isOpen, onClose, id, refetchLists, boardId } = useCardModal();


    const { apiRequest } = useApiRequest();
    const { orgId } = useAuth();


    const { data: cardData } = useQuery({

        queryKey: ["card", id],
        queryFn: () => {

            if (!id || !orgId) throw new Error("Missing ID or Org");

            return fetchCardById(id, orgId, apiRequest);
        },
    });

    useEffect(() => {
        if (id && orgId) {
            refetchLists?.();
        }
    }, [id, orgId, cardData]);



    const { data: auditLogsData } = useQuery({
        queryKey: ["card-logs", id],
        queryFn: () => {
            if (!id || !orgId) throw new Error("Missing ID or Org");
            return fetchAuditLogs(id, orgId, apiRequest);
        },
    });

    const { data: AttachmentData } = useQuery({
        queryKey: ["attachment", id],
        queryFn: () => {
            if (!id || !orgId) throw new Error("Missing ID or Org");
            return fetchAttachment(id, orgId, apiRequest);
        },
    });


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="outline-none overflow-y-auto mt-2" aria-describedby={undefined} >

                {cardData && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {cardData.colors.map((color: any) => (

                            <Button key={color.title} style={{ backgroundColor: color.color }}>{color.title}</Button>

                        ))}
                    </div>
                )}
                <DialogTitle className="flex items-start justify-between w-full ">
                    {cardData ? (
                        <CardModalHeader data={cardData} refetchLists={refetchLists} />
                    ) : (
                        <CardModalHeader.Skeleton />
                    )}
                    {cardData && cardData.due_date && (
                        <CalendarForm data={cardData}>
                            <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">Due date</p>
                                <Button
                                    variant="gray"
                                    className="flex items-center gap-2 text-right"
                                    size="inline"
                                >
                                    <span className="text-md font-medium">
                                        {format(new Date(cardData.due_date), "d MMM")},{" "}
                                        {cardData.time_date && cardData.time_date.slice(0, 5)}

                                    </span>
                                    <span
                                        className={`text-xs font-semibold ${isPast(new Date(cardData.due_date))
                                            ? "text-red-600"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {isPast(new Date(cardData.due_date)) ? "Overdue" : "On track"}
                                    </span>

                                </Button>
                            </div>
                        </CalendarForm>
                    )}
                </DialogTitle>

                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {cardData ? (
                                <CardModalDescription data={cardData} />
                            ) : (
                                <CardModalDescription.Skeleton />
                            )}
                            {AttachmentData && cardData ? (
                                <CardModalAttachment data={AttachmentData} id_card={id} title={cardData.title} />
                            ) : (
                                <CardModalAttachment.Skeleton />
                            )}
                            {auditLogsData ? (
                                <CardModalActivity items={auditLogsData} id_card={id} />
                            ) : (
                                <CardModalActivity.Skeleton />
                            )}
                        </div>
                    </div>
                    {cardData ? (
                        <CardModalActions data={cardData} refetchLists={refetchLists} boardId={boardId} />
                    ) : (
                        <CardModalActions.Skeleton />
                    )}
                </div>

            </DialogContent>
        </Dialog >
    );
};

export default CardModal;

