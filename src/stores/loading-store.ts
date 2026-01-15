import { create } from 'zustand';

type SplashScreenStatus = 'idle' | 'loading' | 'completed';

interface LoadingState {
	status: SplashScreenStatus;
	progress: number; // Tiến trình chỉ dành cho splash screen

	startLoading: () => void;
	setProgress: (progress: number) => void;
	completeLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
	status: 'loading', // Mặc định là 'loading' khi app khởi động
	progress: 0,

	startLoading: () => set({ status: 'loading', progress: 0 }),
	setProgress: (progress) => set({ progress }),
	completeLoading: () => set({ status: 'completed', progress: 100 }),
}));
