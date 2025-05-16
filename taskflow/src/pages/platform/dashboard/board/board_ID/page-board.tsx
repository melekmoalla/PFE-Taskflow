import { useAuth } from '@clerk/clerk-react'
import { useNavigate, useParams } from 'react-router-dom';
import { useApiRequest } from '@/action/auth';
import { useState, useEffect } from 'react';
import ListContainer from './_components/board-list/container'

const BoardIdPage = () => {

    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const { orgId } = useAuth();
    const { boardId } = useParams();

    const [lists, setLists] = useState<any[]>([]);

    const fetchBoard = async () => {
        if (!orgId) {
            navigate("/select-org");
            return;
        }

        try {
            const response = await apiRequest(`/api/board/list/?orgId=${orgId}&boardId=${boardId}`, null, 'GET');

            if (!response) {
                navigate("/not-found");
                return;
            }
            //console.log(response);
            setLists(response);
        } catch (error: any) {
            console.error('Failed to fetch List:', error.message);
            navigate("/error");
        }
    };

    useEffect(() => {
        fetchBoard();
    }, [orgId, boardId]);

    if (!lists) return null;

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer data={lists} setData={setLists} refetchLists={fetchBoard} />
        </div>
    );
};

export default BoardIdPage 