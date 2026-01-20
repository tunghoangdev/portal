import type { BaseColumnOptions } from '@/types/data-table-type';

export const noneLifeProfixBaseColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Sản phẩm',
		key: 'none_life_product_name',
		width: 300,
	},
	{
		title: 'Nhà cung cấp',
		key: 'none_life_provider_name',
		width: 200,
	},

	{
		title: 'Thưởng nhà cung cấp',
		key: 'commission_provider',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Thưởng trả thành viên',
		key: 'commission_agent',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Lợi nhuận gộp',
		key: 'commission_lng',
		type: 'number',
		summary: 'sum',
	},
];
