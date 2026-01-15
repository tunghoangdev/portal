import { createZustandStore } from '~/stores/store';

interface FilterState {
	queryKeyState: any[];
	queryParamsState?: Record<string, any>;
	dateRange?: any;
	info: string;
	num_date?: string;
	agentId?: string;
	customerId?: string;
	bonusPeriodName?: string;
	emailTypeSelected?: string;
	providerSelected?: string;
	contractTypeSelected?: string;
	agentStatusSelected?: string;
	agentLevelSelected?: string;
	enableFilters?: Record<string, any>;
	provider_code?: string;
	contract_type?: string;
	contractTypeList: any[];
	[key: string]: any;
}

interface FilterActions {
	setFilter: (key: keyof FilterState, value: any) => void;
	resetAllFilters: () => void;
}

const STATE_INITIAL: FilterState = {
	dateRange: undefined,
	queryKeyState: [],
	queryParamsState: undefined,
	logUrl: undefined,
	bonusPeriodName: '',
	providerSelected: '',
	emailTypeSelected: '0',
	contractTypeSelected: '',
	agentStatusSelected: '',
	agentId: '',
	itemId: undefined,
	customerId: '',
	agentLevelSelected: '',
	contractTypeList: [],
	provider_code: undefined,
	contract_type: undefined,
	info: '',
	num_date: '60',
	enableFilters: undefined,
} as FilterState;

export const [filterStore, useFilterStore, createFilterHook] =
	createZustandStore<FilterState & FilterActions>((set) => ({
		...STATE_INITIAL,
		setFilter: (key, value) =>
			set((state: any) => ({ ...state, [key]: value })),
		resetAllFilters: () => set(STATE_INITIAL),
	}));
