// stores/commonStore.ts
import { create } from 'zustand';

type CommonData = Record<string, any>;

type CommonStore = {
  data: CommonData;
  setData: (key: string, value: any) => void;
};

export const useCommonStore = create<CommonStore>((set) => ({
  data: {},
  setData: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value },
    })),
}));