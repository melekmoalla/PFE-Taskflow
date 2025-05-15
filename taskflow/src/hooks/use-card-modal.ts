import { create } from "zustand";

type CardModalStore = {
  id?: string;
  boardId?: string;
  isOpen: boolean;
  refetchLists?: () => void;
  onOpen: (id: string, boardId: string, refetchLists: () => void) => void;
  onClose: () => void;
};

const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  boardId: undefined,
  refetchLists: undefined,
  isOpen: false,
  onOpen: (id, boardId, refetchLists) => set({ isOpen: true, id, boardId, refetchLists }),
  onClose: () => set({ isOpen: false, id: undefined, boardId: undefined,  refetchLists: undefined }),
}));

export default useCardModal;
