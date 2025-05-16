import { create } from "zustand";


interface BoardState {
  description_audit: string | null;
  board: any; 
  setDescription_audit: (data: string | null) => void;
  setBoard_aud: (data: any) => void;
}


export const useBoard = create<BoardState>((set) => ({
  description_audit: null,
  board: null,
  setDescription_audit: (data) => set({ description_audit: data }),
  setBoard_aud: (data) => set({ board: data }),
}));
