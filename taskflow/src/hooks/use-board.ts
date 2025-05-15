import { create } from "zustand";

export const useBoard = create((set) => ({
  description_audit: null,
  board: null,
  setDescription_audit: (data) => set({ description_audit: data }),
  setBoard_aud: (data) => set({ board: data }),
}));
