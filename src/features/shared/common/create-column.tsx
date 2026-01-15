import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@heroui/react';
import { formatCurrency, formatDate, formatNumber } from '~/utils/formater';
import type { BaseColumnOptions } from '~/types/data-table-type';
import { UserCell } from '../components/cells';
import { UserRevoCell } from '../components/cells/user-cell';
import { makeRevoCellTemplate } from './convert-cell-revo';
const DEFAULT_USER_PROPS = {
	nameKey: 'agent_name',
	phoneKey: 'agent_phone',
	avatarKey: 'agent_avatar',
	levelIdKey: 'id_agent_level',
	levelCodeKey: 'agent_level_code',
	showLevel: true,
};

// export const createCellTemplate = ({
// 	type,
// 	accessorKey,
// }: {
// 	type?: string;
// 	accessorKey?: string;
// 	render?: (model: any) => any;
// }) => {
// 	return (h: any, { model, value }: any) => {
// 		if (accessorKey === 'agent_name') {
// 			return UserCellRendererLite(h, {
// 				model,
// 				props: {
// 					...DEFAULT_USER_PROPS,
// 					accessorKey,
// 				},
// 			});
// 		}

// 		// Các loại dữ liệu cơ bản
// 		switch (type) {
// 			case 'currency':
// 				return h('div', { class: 'text-right' }, formatCurrency(value));
// 			case 'date':
// 				return h(
// 					'div',
// 					{ class: 'text-xs text-content2' },
// 					value ? formatDate(value) : '',
// 				);
// 			case 'number':
// 			case 'total':
// 				return h('div', { class: 'text-right' }, formatNumber(value));
// 			default:
// 				return h('div', {}, value ?? '');
// 		}
// 	};
// };

export function createColumn<T>(
	options: BaseColumnOptions<T>,
): ColumnDef<T> & { prop?: string; cellTemplate?: any; visible?: boolean } {
	const {
		title,
		key,
		type = 'text',
		sortable = true,
		hidden = false,
		align = 'left',
		className = '',
		width,
		minWidth,
		maxWidth,
		render,
		summary,
		actions,
		exportable,
		exportTitle,
		hiddenExport,
		customActions,
		pin,
	} = options;

	const accessorKey = key as string;

	// if (hidden) return null as any;

	const cell = ({ row }: { row: any }) => {
		if (hidden) return null as any;
		const value = row.original[key];

		if (render) return render(row?.original || row);
		switch (type) {
			case 'currency':
				return formatCurrency(value);
			case 'date':
				return (
					<div className={'text-xs text-content2'}>
						{value ? formatDate(value) : ''}
					</div>
				);
			case 'total':
				return formatNumber(value);
			case 'number':
				return formatNumber(value);
			default:
				return value;
		}
	};

	const autoMinWidth =
		width || minWidth || maxWidth
			? undefined
			: Math.min(Math.max((title?.length ?? 0) * 10, 120), 300);
	return {
		header: title,
		name: title,
		accessorKey,
		prop: accessorKey,
		cell,
		// enableSorting: sortable,
		visible: !hidden || !exportable,
		size: typeof width === 'number' ? width : autoMinWidth,
		minSize: typeof minWidth === 'number' ? minWidth : autoMinWidth,
		maxSize: typeof maxWidth === 'number' ? maxWidth : undefined,
		align: align as 'left' | 'center' | 'right',
		meta: {
			align,
			key,
			summary,
			type,
			actions,
			hiddenExport,
			exportable,
			exportTitle,
			customActions,
		},
		pin,
		cellTemplate: makeRevoCellTemplate({
			type,
			render,
		}),
	} as ColumnDef<T>;
}

export const createColumnDef =
	(prefix: string, titlePrefix: string, options?: { hiddenPercent?: boolean, hiddenSummary?: boolean }) =>
	(item: any) => ({
		title: `${titlePrefix} ${options?.hiddenPercent ? item.level_code : `${item.level_code}%`}`,
		key: `${prefix}${item.id}`,
		type: 'number',
		summary: options?.hiddenSummary ? undefined : 'sum',
		width:
			prefix === 'com_level_same_' || prefix === 'percentage_same_level_'
				? 200
				: 160,
	});

export const createColumnUserDef =
	(prefix: string, titlePrefix: string) =>
	(item: any): BaseColumnOptions<any>[] => {
		const commonProps = {
			width: 160,
		};

		const commonKeys = {
			nameKey: `${prefix}${item.id}_agent_name`,
			phoneKey: `${prefix}${item.id}_agent_phone`,
		};

		// Cột tổng hợp để hiển thị trên UI
		const combinedColumn: BaseColumnOptions<any> = {
			title: `${titlePrefix} ${item.level_code}`,
			key: `${prefix}${item.id}`,
			...commonProps,
			hiddenExport: true,
			render: (row: any) => (
				<UserCell
					data={row}
					hideAvatar
					nameKey={commonKeys.nameKey}
					phoneKey={commonKeys.phoneKey}
				/>
			),
		};

		// Cột riêng cho tên, chỉ xuất hiện khi export
		const nameColumn: BaseColumnOptions<any> = {
			title: `Tên ${titlePrefix} ${item.level_code}`,
			key: commonKeys.nameKey,
			...commonProps,
			exportable: true,
		};

		// Cột riêng cho số điện thoại, chỉ xuất hiện khi export
		const phoneColumn: BaseColumnOptions<any> = {
			title: `SĐT ${titlePrefix} ${item.level_code}`,
			key: commonKeys.phoneKey,
			...commonProps,
			exportable: true, // Chỉ xuất hiện khi export
		};

		return [combinedColumn, nameColumn, phoneColumn];
	};
export const createColumnUserNameDef =
	(prefix: string, titlePrefix: string) =>
	(item: any): BaseColumnOptions<any>[] => {
		const commonProps = {
			width: 160,
		};

		const commonKeys = {
			nameKey: `${prefix}${item.id}_agent_name`,
		};

		// Cột tổng hợp để hiển thị trên UI
		const combinedColumn: BaseColumnOptions<any> = {
			title: `${titlePrefix} ${item.level_code}`,
			key: `${prefix}${item.id}_agent_name`,
			...commonProps,
			hiddenExport: true,
			render: (row: any) => (
				<span className="text-default-800 font-semibold">
					{row[commonKeys.nameKey]}
				</span>
			),
			// render: (row: any) => (
			// 	<UserCell
			// 		data={row}
			// 		hideAvatar
			// 		nameKey={commonKeys.nameKey}
			// 		phoneKey="_"
			// 	/>
			// ),
		};

		// Cột riêng cho tên, chỉ xuất hiện khi export
		const nameColumn: BaseColumnOptions<any> = {
			title: `Tên ${titlePrefix} ${item.level_code}`,
			key: commonKeys.nameKey,
			...commonProps,
			exportable: true,
		};
		return [combinedColumn, nameColumn];
	};
