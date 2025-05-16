import { HelpCircle, User2 } from 'lucide-react';
import Hint from "@/components/hint";
import FormPopover from "@/components/form/form-popover";
import { useApiRequest } from '@/action/auth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARD } from '@/constants/boards';
import { hasAvailableCount_or_getAvailableCount } from '@/action/org-limit';
import { useCheckSubscription } from '@/lib/subscription';

export const BoardList = () => {

    const { orgId } = useAuth();
    const navigate = useNavigate();

    if (!orgId) {
        navigate("/select-org");
    }

    const { apiRequest } = useApiRequest();
    const [boards, setBoards] = useState([]);
    const [availableCount, setAvailableCount] = useState({ count: 0, hasAvailableCount: true });
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            // console.log(orgId);
            const data = await apiRequest('/api/boards/?orgId=' + orgId, null, 'GET');
            //console.log(data);
            setBoards(data);
        } catch (error: any) {
            console.error('Failed to fetch boards:', error.message);
        }
    };

    const { checkSubscription } = useCheckSubscription();

    useEffect(() => {
        const getCountAndSubscription = async () => {
            const result = await hasAvailableCount_or_getAvailableCount(orgId!, apiRequest);
            setAvailableCount(result);

            const isPro = await checkSubscription();
            setIsPro(isPro);
            // Optionally: set a state like setIsPro(isPro);
        };

        getCountAndSubscription();
    }, []);




    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your Boards
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((board: any) => (

                    <Link

                        to={`/board/${board.id}`}
                        key={board.id}
                        className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                        style={{ backgroundImage: `url(${board.image_thumb_url})` }}
                    >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                        <p className="relative font-semibold text-white">{board.title}</p>
                    </Link>
                ))}

                <FormPopover side="right" sideOffset={10}>
                    <div
                        className="aspect-video relative w-full h-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
                        role="button">
                        <p className="text-sm">Create new board</p>
                        <span className='text-xs'>
                            {isPro ? 'Unlimited' : `${MAX_FREE_BOARD - availableCount.count} remaining`}
                        </span>
                        <Hint
                            side="bottom"
                            sideOffset={40}
                            description={`Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this worskpace.`}
                        >
                            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    )
}

BoardList.Skeleton = function BoardListSkeleton() {
    return (
        <div>
            <Skeleton className="aspect-video h-7 w-60 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
                <Skeleton className="aspect-video h-full w-full p-2" />
            </div>
        </div>
    );
};

export default BoardList;