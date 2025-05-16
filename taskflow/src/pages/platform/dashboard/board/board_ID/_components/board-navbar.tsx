
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react'
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

//////////////////////////////////////////////

import { Board } from '@/action/create-board/types';
import BoardTitleForm from "./board-title-form";
import BoardOptions from './board-options';
import { useApiRequest } from "@/action/auth";

//////////////////////////////////////////////

interface IBoardNavbarProps {
    board: Board;

}
type Member = {
    userImage: string;

};

const BoardNavbar = ({ board }: IBoardNavbarProps) => {
    //console.log(board);
    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const { orgId } = useAuth();
    const [assigns, setAssign] = useState([]);

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

            setAssign(response.members);


        } catch (error: any) {
            console.error('Failed to fetch List:', error.message);
            navigate("/error");
        }
    }
    useEffect(() => {
        fetchmembers();
    }, [orgId]);


    return (
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
            <BoardTitleForm data={board} />
            <div className="ml-auto">
                <div className='flex'>
                    {assigns.map((member: Member, index) => (
                        <Avatar key={index} className="h-8 w-8 ">
                            <AvatarImage src={member.userImage} />
                        </Avatar>
                    ))}

                    <BoardOptions id={board.id} title={board.title} />
                </div>
            </div>
        </div>
    );
};


export default BoardNavbar;