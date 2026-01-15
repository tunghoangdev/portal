import type { BaseColumnOptions } from '~/types/data-table-type';

export const listColumns: BaseColumnOptions<any>[] = [
	{ title: 'Nhà cung cấp', key: 'provider_name', width: 160 },
	{ title: 'Số hợp đồng', key: 'number_contract' },
	{ title: 'Kỳ tính thưởng', key: 'period_name' },
	{ title: 'Sản phẩm', key: 'product_name' },
	{
		title: 'Tổng thưởng',
		key: 'amount',
		type: 'number',
		summary: 'sum',
	},
];
