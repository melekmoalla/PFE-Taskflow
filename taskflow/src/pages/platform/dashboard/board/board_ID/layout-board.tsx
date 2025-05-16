import { useAuth } from '@clerk/clerk-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApiRequest } from "@/action/auth";
import React, { useEffect, useState } from "react";
import BoardNavbar from './_components/board-navbar'
import { useBoard } from "@/hooks/use-board";

const BoardIdLayout = ({ children }: { children: React.ReactNode; }) => {
    const { apiRequest } = useApiRequest();
    const navigate = useNavigate();
    const { orgId } = useAuth();
    const { boardId } = useParams();
    const [board, setBoard] = useState<any | null>(null);
    const { setBoard_aud } = useBoard() as { setBoard_aud: (board: any) => void };



    useEffect(() => {
        const fetchBoard = async () => {
            if (!orgId) {
                navigate("/select-org");
                return;
            }

            try {
                //console.log(boardId)
                const response = await apiRequest(`/api/board/${boardId}/?orgId=${orgId}`, boardId, 'GET');

                if (!response) {
                    //console.log('no')
                    navigate("/not-found");
                    return;
                }
                //console.log(response);
                setBoard(response);
                setBoard_aud(response);
            } catch (error: any) {
                console.error('Failed to fetch board:', error.message);
                //console.log('no')
                navigate("/error");
            }
        };

        fetchBoard();
    }, [orgId, boardId]);

    if (!board) return null;

    return (
        <>
            <img src={board.image_full_url} style={{ display: 'none' }} alt="preload" />
            <div
                className="fixed inset-0 bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: `url(${board.image_full_url})` }}
            >
                <BoardNavbar board={board} />
                <div className="absolute inset-0 bg-black/10" />
                <main className="relative pt-28 h-full">{children}</main>
            </div>
        </>
    );
};

export default BoardIdLayout