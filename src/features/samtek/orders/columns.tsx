import type { BaseColumnOptions } from '@/types/data-table-type';
export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Mã công ty',
		key: 'key_code',
	},
	{
		title: 'Tên công ty',
		key: 'company_name',
		width: 170,
	},
	{
		title: 'Số chứng từ',
		key: 'receipt_no',
		width: 170,
	},
	{
		title: 'Ngày chứng từ',
		key: 'receipt_date',
		width: 170,
	},
	{
		title: 'Tên sản phẩm',
		key: 'product_name',
		width: 200,
	},
	{
		title: 'Số lượng',
		key: 'quantity',
		width: 120,
	},
	{
		title: 'Số tiền',
		key: 'amount',
		width: 180,
	},
	{
		title: 'Ngày hết hạn',
		key: 'expired_time',
		width: 150,
		type: 'datetime',
	},
	{
		title: 'Khách hàng',
		key: 'customer_name',
		width: 180,
	},
	{
		title: 'Số điện thoại',
		key: 'customer_phone',
		width: 180,
	},
	{
		title: 'Email',
		key: 'customer_email',
		width: 250,
	},
];
