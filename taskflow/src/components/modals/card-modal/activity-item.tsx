import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface IActivityData {
    userImage: string;
    userName: string;
    entityType: string;
    entityTitle: string;
    createdAt: string | Date;
}

interface IActivityItemProps {
    data: IActivityData;
    showDetails?: boolean;
}

const ActivityItem = ({ data, showDetails = false }: IActivityItemProps) => {
    const createdAtFormatted = format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a");

    const renderHeader = () => (
        <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage} />
            </Avatar>
            <p className="text-sm text-muted-foreground">
                <span className="font-semibold lowercase text-neutral-700">
                    {data.userName}
                </span>
                <span className="ml-1">{generateLogMessage(data)}</span>
            </p>
        </div>
    );

    // Only render if showDetails is true or if it's a COMMENT
    const shouldRender = showDetails || data.entityType === "COMMENT";

    if (!shouldRender) return null; // prevent space reservation

    return (
        <li className="flex items-center gap-x-2">
            <div className="flex flex-col">
                {showDetails && renderHeader()}

                {data.entityType === "COMMENT" && (
                    <div className="mt-1 space-y-1">
                        {!showDetails && renderHeader()}
                        <Button variant="gray" className="w-full justify-start" size="inline">
                            {data.entityTitle}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            {createdAtFormatted}
                        </p>
                    </div>
                )}
            </div>
        </li>
    );
};

export default ActivityItem;
