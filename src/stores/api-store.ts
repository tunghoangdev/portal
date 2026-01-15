import { create } from "zustand";

type ApiState = {
	baseUrl: string;
	staffEndpoint: string;
	agentEndpoint: string;
	setBaseUrl: (url: string) => void;
	setStaffEndpoint: (endpoint: string) => void;
	setAgentEndpoint: (endpoint: string) => void;
};

export const useApiStore = create<ApiState>((set) => ({
	baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
	staffEndpoint: "/staff",
	agentEndpoint: "/agent",

	setBaseUrl: (url: string) => set({ baseUrl: url }),
	setStaffEndpoint: (endpoint: string) => set({ staffEndpoint: endpoint }),
	setAgentEndpoint: (endpoint: string) => set({ agentEndpoint: endpoint }),
}));
