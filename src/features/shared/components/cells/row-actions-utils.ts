// utils/row-actions-utils.ts
import { CRUD_ACTIONS } from '~/constant';
import { Icons } from '~/components/icons';
import type { ActionItem, CrudActionType } from '~/types/data-table-type';
import type { TItemFormFields } from '~/types/form-field';

export const ALL_POSSIBLE_ACTIONS: ActionItem<TItemFormFields>[] = [
	{ type: CRUD_ACTIONS.EDIT, label: 'Cập nhật' },
	{ type: CRUD_ACTIONS.DELETE, label: 'Xóa' },
	{ type: CRUD_ACTIONS.VIEW, label: 'Xem chi tiết' },
	{ type: CRUD_ACTIONS.LOG, label: 'Xem lịch sử' },
	{ type: CRUD_ACTIONS.CONFIG_POLICY, label: 'Cấu hình chính sách' },
	{ type: CRUD_ACTIONS.COMMISON_LIST, label: 'Phân bổ thưởng' },
	{ type: CRUD_ACTIONS.CHANGE_STATUS, label: 'Ngưng hoạt động' },
	{ type: CRUD_ACTIONS.REVOCATION_CONTRACT, label: 'Thu hồi hợp đồng' },
	{ type: CRUD_ACTIONS.LOCK, label: 'Khóa' },
	{ type: CRUD_ACTIONS.RESET_PASSWORD, label: 'Đặt lại mật khẩu' },
];

export const getActionIcon = (type: CrudActionType) => {
	const icons: Record<string, { icon: any; color: string; bg: string }> = {
		[CRUD_ACTIONS.EDIT]: {
			icon: Icons.edit,
			color: 'text-blue-500',
			bg: 'primary',
		},
		[CRUD_ACTIONS.VIEW]: {
			icon: Icons.eye,
			color: 'text-black',
			bg: 'secondary',
		},
		[CRUD_ACTIONS.DELETE]: {
			icon: Icons.trash,
			color: 'text-red-600',
			bg: 'danger',
		},
		[CRUD_ACTIONS.LOG]: {
			icon: Icons.clock,
			color: 'text-secondary',
			bg: 'secondary',
		},
		[CRUD_ACTIONS.LOCK]: {
			icon: Icons.lock,
			color: 'text-danger',
			bg: 'danger',
		},
		[CRUD_ACTIONS.CHANGE_STATUS]: {
			icon: Icons.closeCircle,
			color: 'text-default',
			bg: 'default',
		},
	};
	return icons[type];
};
