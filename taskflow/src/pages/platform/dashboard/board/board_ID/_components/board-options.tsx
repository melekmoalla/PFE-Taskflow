
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { useDeleteBoard } from "@/action/delete-board/index";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@clerk/clerk-react';

interface BoardOptionProps {
    id: number;
    title: string;
}

const BoardOptions = ({ id, title }: BoardOptionProps) => {

    const navigate = useNavigate();
    const deleteBoard = useDeleteBoard();
    const { membership } = useOrganization();
    const role = membership?.role;

    const { execute, isLoading } = useAction(deleteBoard, {
        onSuccess: () => {
            // console.log(data);
            toast.success('Board Deleted');
            navigate('/');
        },
        onError: (error) => {
            //console.log(error);
            toast.error(error);
        },
    });

    const onDelete = () => {

        execute({ id, title });
    };



    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="h-auto w-auto p-2" variant={"transparent"}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                {role !== "org:admin" ? (
                    <PopoverContent className="px-4 pt-4 pb-6 w-72" side="bottom" align="start">
                        <div className="flex flex-col items-center text-center text-neutral-700 space-y-2">
                            <X className="h-8 w-8 text-red-500" />
                            <p className="text-sm font-semibold">Permission Denied</p>
                            <p className="text-xs text-neutral-500">
                                Only organization admins can manage board settings.
                            </p>
                        </div>
                        <PopoverClose asChild>
                            <Button
                                variant="ghost"
                                className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </PopoverClose>
                    </PopoverContent>
                ) : (
                    <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
                        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                            Board Actions
                        </div>
                        <PopoverClose asChild>
                            <Button
                                className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                                variant="ghost"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </PopoverClose>
                        <Button
                            variant="ghost"
                            className="rounded-none w-full h-auto p-2 px-5 font-normal text-sm justify-start"
                            disabled={isLoading}
                            onClick={onDelete}
                        >
                            Delete this board
                        </Button>

                    </PopoverContent>)}

            </Popover>
        </div>
    );
};



export default BoardOptions;