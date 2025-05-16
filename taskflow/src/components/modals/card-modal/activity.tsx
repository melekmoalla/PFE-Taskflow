import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import ActivityItem from "./activity-item";
import CardModalComment from "./comment";
import { Button } from "@/components/ui/button";

interface ICardModalActivityProps {
    items: any[];
    id_card: string | undefined ;
}

const CardModalActivity = ({ items, id_card }: ICardModalActivityProps) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleShowDetails = () => setShowDetails((prev) => !prev);

    return (
        <div className="flex items-start gap-x-3 w-full">
            <Activity className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-neutral-700">Activity</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs px-2 py-1"
                        onClick={toggleShowDetails}
                    >
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                </div>

                <CardModalComment id_card={id_card}>
                    <ol className="mt-2 max-h-64  space-y-4 pr-2">
                        {items.map((item, index) => (
                            <ActivityItem data={item} key={index} showDetails={showDetails} />
                        ))}
                    </ol>
                </CardModalComment>
            </div>
        </div>
    );
};

CardModalActivity.Skeleton = function CardModalActivitySkeleton() {
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

export default CardModalActivity;
