import type { BaseColumnOptions } from '@/types/data-table-type';

export const configBusinessColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Số chứng từ',
		key: 'receipt_no',
		width: 200
	},
	{
		title: 'Ngày chứng từ',
		key: 'receipt_date',
		type: 'date',
	},{
		title: 'Sản phẩm',
		key: 'product_name',
		width: 250,
	},{ title: 'Số lượng', key: 'quantity', width: 150 },
	{ title: 'Số tiền', key: 'amount', width: 150, type: 'number' },
	{
		title: 'Ngày hết hạn',
		key: 'expired_time',
		type: 'date',
	},
];
