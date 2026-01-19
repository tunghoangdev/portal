import { Icons } from '~/components/icons';
import { CRUD_ACTIONS } from '~/constant';
import { useRowActionsDropdown } from '~/hooks';
import { CrudActionType, ActionItem } from '~/types/data-table-type';
import { TItemFormFields } from '~/types/form-field';
import { ButtonProps, DropdownTrigger, cn } from '@heroui/react';
import { useMemo } from 'react';
const classNameBtns = 'min-w-0 w-auto min-h-0 h-auto p-2 text-sm font-semibold';
const actionIcon = (type: CrudActionType) => {
	const items: Record<
		string,
		{ icon: React.ReactNode; color: string; bg: string }
	> = {
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
import { ALL_POSSIBLE_ACTIONS } from './cells/row-actions-utils';
import { Button, Dropdown, DropdownItem, DropdownMenu } from '~/components/ui';
export function RowActionsDropdownPortal() {
	const {
		isOpen,
		position,
		row,
		actions,
		customActions,
		onAction,
		closeDropdown,
	} = useRowActionsDropdown();

	const allDefinedActions = useMemo(() => {
		const map = new Map<CrudActionType | string, ActionItem<TItemFormFields>>();
		ALL_POSSIBLE_ACTIONS.forEach((a) => map.set(a.type, a));
		(customActions || []).forEach((a) =>
			map.set(a.type as CrudActionType | string, a as any),
		);
		return Array.from(map.values());
	}, [customActions]);

	const displayedActions = useMemo(() => {
		const isAll = (actions as string[])?.includes('all');
		let filtered = isAll
			? allDefinedActions
			: allDefinedActions.filter((a) =>
					(actions as (CrudActionType | string)[])?.includes(a.type),
				);

		const uniqueCustom = (customActions || []).filter(
			(customA) =>
				!filtered.some(
					(a) => a.type === (customA.type as CrudActionType | string),
				),
		) as ActionItem<TItemFormFields>[];
		const combined = [...filtered, ...uniqueCustom];
		return combined.filter((a) => !a.isHidden?.(row as TItemFormFields));
	}, [actions, allDefinedActions, customActions, row]);

	const sortedDisplayedActions = useMemo(() => {
		return [...displayedActions].sort((a, b) => {
			const indexA =
				Array.isArray(actions) && actions[0] === 'all'
					? -1
					: (actions as CrudActionType[]).indexOf(a.type as CrudActionType);
			const indexB =
				Array.isArray(actions) && actions[0] === 'all'
					? -1
					: (actions as CrudActionType[]).indexOf(b.type as CrudActionType);
			if (a.type === CRUD_ACTIONS.DELETE) return 1;
			if (b.type === CRUD_ACTIONS.DELETE) return -1;
			if (indexA === -1 && indexB === -1) return 0;
			if (indexA === -1) return 1;
			if (indexB === -1) return -1;
			return indexA - indexB;
		});
	}, [displayedActions, actions]);
	if (!isOpen) return null;
	if (!isOpen || !position || !row) return null;
	return (
		<div
			style={{
				position: 'fixed',
				left: position.x,
				top: position.y,
				zIndex: 999999,
			}}
		>
			<Dropdown
				isOpen
				shouldBlockScroll={false}
				radius="sm"
				placement="bottom-end"
				isKeyboardDismissDisabled={false}
				onClose={closeDropdown}
			>
				<DropdownTrigger>
					<Button isIconOnly variant="light" size="sm" className="rounded-full">
						<Icons.more_vertical
							size={18}
							strokeWidth={1.5}
							className="text-secondary hidden"
						/>
					</Button>
				</DropdownTrigger>

				<DropdownMenu
					aria-label="Hành động"
					onAction={(key: any) => {
						onAction?.(key as CrudActionType, row as TItemFormFields);
						closeDropdown();
					}}
					classNames={{ base: 'max-h-[450px] overflow-y-auto' }}
				>
					{sortedDisplayedActions.map((action, index) => {
						if (action.type === CRUD_ACTIONS.LOCK) {
							// @ts-ignore
							action.label = row?.is_lock ? 'Mở khóa' : 'Khóa';
							// @ts-ignore
							action.icon = row?.is_lock ? (
								<Icons.lockOpen size={16} strokeWidth={2} />
							) : (
								<Icons.lock size={16} strokeWidth={2} />
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
									action?.icon ||
									actionIcon(action.type as CrudActionType)?.icon
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
		</div>
	);
}
