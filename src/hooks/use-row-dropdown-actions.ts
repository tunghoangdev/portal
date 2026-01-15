import { CrudActionType, ActionItem } from '~/types/data-table-type';
import { TItemFormFields } from '~/types/form-field';
import { create } from 'zustand';
interface DropdownState {
	isOpen: boolean;
	position: { x: number; y: number } | null;
	row: TItemFormFields | null;
	actions?: CrudActionType[] | ['all'];
	customActions?: ActionItem<TItemFormFields>[];
	onAction?: (type: CrudActionType, row?: TItemFormFields) => void;
	openDropdown: (
		pos: { x: number; y: number },
		row: TItemFormFields,
		options?: {
			actions?: CrudActionType[] | ['all'];
			customActions?: ActionItem<TItemFormFields>[];
			onAction?: (type: CrudActionType, row?: TItemFormFields) => void;
		},
	) => void;
	closeDropdown: () => void;
}
export const useRowActionsDropdown = create<DropdownState>((set) => ({
	isOpen: false,
	position: null,
	row: null,
	openDropdown: (position, row, options) =>
		set({ isOpen: true, position, row, ...options }),
	closeDropdown: () => set({ isOpen: false, position: null, row: null }),
}));
