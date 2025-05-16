
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@clerk/clerk-react'
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

//////////////////////////////////////////////

import { useAction } from "@/hooks/use-action";
import { useUpdateCard } from "@/action/update-card";
import { useApiRequest } from "@/action/auth";
import { useBoard } from "@/hooks/use-board";

//////////////////////////////////////////////

interface Member {
  id: string;
  email: string;
  userImage: string;
  isSelected: boolean | null;
}


interface AssignProps {
    children: React.ReactNode;
    select: string[];
    cardId: number;
}

const Assign = ({ children, select, cardId }: AssignProps) => {

    const actionRef = useRef<boolean | null>(null);
    const queryClient = useQueryClient();

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const { orgId } = useAuth();
    const [assigns, setAssign] = useState<Member[]>([]);
    const { setDescription_audit } = useBoard();

    const fetchmembers = async () => {

        if (!orgId) {
            navigate("/select-org");
            return;
        }
        try {
            const response = await apiRequest(`/api/board/organization/${orgId}/`, null, 'GET');

            if (!response) {
                toast.error('Error occurred while fetching data');
                return;
            }

            setAssign(response.members.map((assign: any) => ({
                ...assign,
                isSelected: select.includes(assign.id),
            })));


        } catch (error: any) {
            console.error('Failed to fetch List:', error.message);
            navigate("/error");
        }
    }
    useEffect(() => {
        fetchmembers();
    }, [orgId]);

    const UpdateCard = useUpdateCard();
    const { execute: executeToggleLabel } = useAction(UpdateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["card", cardId] });
            queryClient.invalidateQueries({ queryKey: ["card-logs", cardId] });
            //console.log(data)

            if (actionRef.current)
                toast.success(`Added assignment to card "${data.title}".`);
            else
                toast.success(`Removed assignment from card "${data.title}".`);

        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const handleAssignToggle = (assignId: string, isSelected: boolean | null)  => {

        actionRef.current = isSelected;
        const updatedAssign = assigns.map(assign =>
            assign.id === assignId ? { ...assign, isSelected } : assign
        );

        setAssign(updatedAssign);

        const selectedLabels = updatedAssign.filter(assign => assign.isSelected).map(assign => assign.id);

        if (isSelected)
            setDescription_audit('Added assignment');
        else
            setDescription_audit('Removed assignment');

        executeToggleLabel({ id: cardId, members: selectedLabels.map(Number) });

    };


    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="end"
                className="px-0 pt-3 pb-3 w-80"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Members
                </div>
                <PopoverClose asChild>
                    <Button
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <div className="max-h-48 overflow-y-auto px-4 ">
                    {assigns.map((member, index) => (
                        <div
                            key={member.id || index}
                            onClick={() => handleAssignToggle(member.id, !member.isSelected)}
                            className="flex items-center gap-2 p-2 rounded hover:bg-neutral-100 cursor-pointer"
                        >
                            <input type="checkbox"
                                className="mr-2"
                                checked={member.isSelected || false}
                                readOnly
                            />
                            <form className="flex items-center gap-2 " >

                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.userImage} />
                                </Avatar>
                                <span className="text-sm font-semibold lowercase text-neutral-700 ">
                                    {member.email || "Unnamed"}
                                </span>
                            </form>
                        </div>
                    ))}


                </div>
            </PopoverContent>

        </Popover>

    )
}

export default Assign