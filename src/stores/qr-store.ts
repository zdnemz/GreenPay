import { TrashVerifyData } from "@/types";
import { create } from "zustand";

interface QRState {
  data: TrashVerifyData | null;
  setData: (data: TrashVerifyData) => void;
}

export const useQRStore = create<QRState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));

export const useQRData = () => useQRStore((s) => s.data);

export const useQRActions = () => {
  const setQRData = useQRStore((s) => s.setData);

  return { setQRData };
};
