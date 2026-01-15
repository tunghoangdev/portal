import { Icons } from '~/components/icons';
import { Button } from '~/components/ui';
import { CRUD_ACTIONS } from '~/constant';
import { cn } from '~/lib/utils';
import type { ActionItem, CrudActionType } from '~/types/data-table-type';
import {
	type ButtonProps,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@heroui/react';
import { type ReactNode, useMemo, useRef } from 'react';
import type { TItemFormFields } from '~/types/form-field';

interface RowActionsCellProps<T> {
	row: T;
	onAction?: (type: CrudActionType, row?: TItemFormFields) => void;
	actions: CrudActionType[] | ['all'];
	customActions?: ActionItem<T>[];
}

const classNameBtns = 'min-w-0 w-auto min-h-0 h-auto p-2 text-sm font-semibold';
const ALL_POSSIBLE_ACTIONS: ActionItem<TItemFormFields>[] = [
	{ type: CRUD_ACTIONS.EDIT, label: 'Cập nhật' },
	{ type: CRUD_ACTIONS.DELETE, label: 'Xóa' },
	{ type: CRUD_ACTIONS.VIEW, label: 'Xem chi tiết' },
	// { type: CRUD_ACTIONS.DETAIL, label: "Xem chi tiết" },
	{ type: CRUD_ACTIONS.LOG, label: 'Xem lịch sử' },
	{ type: CRUD_ACTIONS.CONFIG_POLICY, label: 'Cấu hình chính sách' },
	{ type: CRUD_ACTIONS.COMMISON_LIST, label: 'Phân bổ thưởng' },
	{ type: CRUD_ACTIONS.CHANGE_STATUS, label: 'Ngưng hoạt động' },
	{ type: CRUD_ACTIONS.REVOCATION_CONTRACT, label: 'Thu hồi hợp đồng' },
	{ type: CRUD_ACTIONS.LOCK, label: 'Khóa' },
	{ type: CRUD_ACTIONS.RESET_PASSWORD, label: 'Đặt lại mật khẩu' },
	// Thêm các hành động mặc định khác tại đây
];
const actionIcon = (
	type: CrudActionType,
): { icon: ReactNode; color: string; bg: string } | undefined => {
	const items: Record<string, { icon: ReactNode; color: string; bg: string }> =
		{
			[CRUD_ACTIONS.EDIT]: {
				icon: <Icons.edit size={16} strokeWidth={1} />,
				color: 'text-blue-500',
				bg: 'primary',
			},
			[CRUD_ACTIONS.VIEW]: {
				icon: <Icons.eye size={16} strokeWidth={1} />,
				color: 'text-black',
				bg: 'secondary',
			},
			[CRUD_ACTIONS.DETAIL]: {
				icon: <Icons.eye size={16} strokeWidth={1} />,
				color: 'text-default-800',
				bg: 'secondary',
			},
			[CRUD_ACTIONS.LOG]: {
				icon: <Icons.clock size={16} strokeWidth={1} />,
				color: 'text-secondary',
				bg: 'secondary',
			},
			[CRUD_ACTIONS.DELETE]: {
				icon: <Icons.trash size={16} strokeWidth={1} />,
				color: 'text-red-600',
				bg: 'danger',
			},
			[CRUD_ACTIONS.CONFIG_POLICY]: {
				icon: <Icons.settings size={16} strokeWidth={1} />,
				color: 'text-green-600 hover:!text-white',
				bg: 'secondary',
			},
			[CRUD_ACTIONS.COMMISON_LIST]: {
				icon: <Icons.dollarSign size={16} strokeWidth={1} />,
				color: 'text-default-800 hover:!text-white',
				bg: 'secondary',
			},
			[CRUD_ACTIONS.REVOCATION_CONTRACT]: {
				icon: <Icons.rotateCcw size={16} strokeWidth={1} />,
				color: 'text-danger hover:!text-white',
				bg: 'danger',
			},
			[CRUD_ACTIONS.CHANGE_STATUS]: {
				icon: <Icons.closeCircle size={16} strokeWidth={1} />,
				color: 'text-default-800 hover:!text-white',
				bg: 'default',
			},
		};
	return items?.[type];
};

const RowActionsCell = <T,>({
	row,
	onAction,
	actions,
	customActions = [],
}: RowActionsCellProps<T>) => {
	if (!actions?.length && !customActions?.length) return null;
	const dropdownTriggerRef = useRef<any>(null);

	const allDefinedActions = useMemo(() => {
		// Tạo một Map để ưu tiên các custom actions nếu chúng có cùng loại với action mặc định
		const actionMap = new Map<
			CrudActionType | string,
			ActionItem<TItemFormFields>
		>();

		ALL_POSSIBLE_ACTIONS.forEach((action) =>
			actionMap.set(action.type, action),
		);
		customActions.forEach((action) =>
			actionMap.set(
				action.type as CrudActionType | string,
				action as unknown as ActionItem<TItemFormFields>,
			),
		);

		return Array.from(actionMap.values());
	}, [customActions]);
	const displayedActions = useMemo(() => {
		const isAllActions = (actions as string[])?.includes('all');

		// Bước 1: Lấy các hành động mặc định/ghi đè từ allDefinedActions
		let filteredBuiltInActions: ActionItem<TItemFormFields>[] = [];
		if (isAllActions) {
			// Nếu là 'all', lấy tất cả các hành động đã định nghĩa (bao gồm cả custom overwrite)
			filteredBuiltInActions = allDefinedActions;
		} else {
			// Nếu không phải 'all', chỉ lọc các hành động có trong `actions` prop
			filteredBuiltInActions = allDefinedActions.filter((action) =>
				(actions as (CrudActionType | string)[]).includes(action.type),
			);
		}

		// Bước 2: Thêm các customActions mà không bị trùng lặp với filteredBuiltInActions
		// Điều này đảm bảo rằng customActions chỉ là bổ sung, không thay đổi logic lọc chính.
		// Nếu bạn muốn customActions luôn được hiển thị bất kể `actions` là gì,
		// hãy loại bỏ phần `filter` này hoặc điều chỉnh logic để chỉ thêm những cái duy nhất.
		const uniqueCustomActions = customActions.filter(
			(customAction) =>
				!filteredBuiltInActions.some(
					(action) =>
						action.type === (customAction.type as CrudActionType | string),
				),
		) as ActionItem<TItemFormFields>[];
		const combinedActions = [...filteredBuiltInActions, ...uniqueCustomActions];
		return combinedActions.filter((action) => {
			if (action.isHidden?.(row as TItemFormFields)) {
				return false;
			}
			return true;
		});
	}, [actions, allDefinedActions, customActions, row]);

	const sortedDisplayedActions = useMemo(() => {
		return [...displayedActions].sort(
			(a: ActionItem<TItemFormFields>, b: ActionItem<TItemFormFields>) => {
				const indexA =
					Array.isArray(actions) && actions[0] === 'all'
						? -1
						: (actions as CrudActionType[]).indexOf(a.type as CrudActionType);
				const indexB =
					Array.isArray(actions) && actions[0] === 'all'
						? -1
						: (actions as CrudActionType[]).indexOf(b.type as CrudActionType);
				if (a.type === CRUD_ACTIONS.DELETE) return 1;
				if (b.type === CRUD_ACTIONS.DELETE)
					// a là DELETE, đưa a xuống sau b
					return -1;

				if (indexA === -1 && indexB === -1)
					if (indexA === -1 && indexB === -1)
						// b là DELETE, đưa b xuống sau a

						// Xử lý các trường hợp không tìm thấy trong mảng 'actions'
						return 0; // Cả hai đều không có trong 'actions', giữ nguyên thứ tự tương đối
				if (indexA === -1) return 1; // A không có, B có -> A xuống sau B
				if (indexB === -1) return -1; // B không có, A có -> B xuống sau A

				return indexA - indexB; // Sắp xếp theo thứ tự trong 'actions'
			},
		);
	}, [displayedActions, actions]);

	const handleAction = (action: ActionItem<TItemFormFields>) => {
		dropdownTriggerRef.current?.close();
	};

	return (
		<Dropdown
			shouldBlockScroll={false}
			radius="sm"
			placement="bottom-end"
			isKeyboardDismissDisabled={false}
		>
			<DropdownTrigger>
				<Button isIconOnly variant="light" size="sm" className="rounded-full">
					<Icons.more_vertical
						size={18}
						strokeWidth={1.5}
						className="text-secondary"
					/>
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label="Hành động"
				onAction={(key) => {
					onAction?.(key as CrudActionType, row as TItemFormFields);
				}}
				classNames={{
					base: 'max-h-[450px] overflow-y-auto',
				}}
			>
				{sortedDisplayedActions.map((action, index) => {
					if (action.type === CRUD_ACTIONS.LOCK) {
						// @ts-ignore
						action.label = row?.is_lock ? 'Mở khóa' : 'Khóa';
						// @ts-ignore
						action.icon = row?.is_lock ? (
							<Icons.lock size={16} strokeWidth={2} />
						) : (
							<Icons.lockOpen size={16} strokeWidth={2} />
						);
					}
					if (action.type === CRUD_ACTIONS.CHANGE_STATUS) {
						// @ts-ignore
						action.label = row?.is_active ? 'Ngưng hoạt động' : 'Hoạt động';
						// @ts-ignore
						action.icon = row?.is_active ? (
							<Icons.closeCircle size={16} strokeWidth={2} />
						) : (
							<Icons.circleCheck size={16} strokeWidth={2} />
						);
					}
					if (
						action.type === CRUD_ACTIONS.APPROVE ||
						action.type === CRUD_ACTIONS.DELETE
					) {
						// @ts-ignore
						const statusType = row?.id_none_life_status;
						if (statusType > 1 && action.type === CRUD_ACTIONS.DELETE) {
							return null;
						}
						if (action.type === CRUD_ACTIONS.APPROVE) {
							if (statusType === 1) {
								action.label = 'Duyệt hợp đồng';
								action.icon = <Icons.circleCheck size={16} strokeWidth={2} />;
							} else {
								action.label = 'Hủy duyệt hợp đồng';
								action.icon = <Icons.closeCircle size={16} strokeWidth={2} />;
							}
						}
					}
					//   if(action.type === CRUD_ACTIONS.DELETE){

					//   }
					return (
						<DropdownItem
							key={action.type}
							className={cn(
								classNameBtns,
								actionIcon(action.type as CrudActionType)?.color ||
									action?.color ||
									action?.bg,
							)}
							startContent={
								action?.icon || actionIcon(action.type as CrudActionType)?.icon
							}
							showDivider={
								index === sortedDisplayedActions.length - 2 &&
								sortedDisplayedActions.length > 1
							}
							color={
								actionIcon(action.type as CrudActionType)
									?.bg as ButtonProps['color']
							}
						>
							{action.label}
						</DropdownItem>
					);
				})}
			</DropdownMenu>
		</Dropdown>
	);
};
RowActionsCell.displayName = 'RowActionsCell';
export { RowActionsCell };
