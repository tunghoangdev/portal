import { UserCell } from '@/features/shared/components/cells';
import type { BaseColumnOptions } from '@/types/data-table-type';
export const commissionTypeColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Loại thưởng',
		key: 'commission_type_name',
		width: 300,
	},
];

export const reportCommissionColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => <UserCell data={row} />,
		width: 250,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Nhà cung cấp',
		key: 'provider_name',
		width: 200,
	},
	{
		title: 'Sản phẩm',
		key: 'product_name',
		width: 200,
	},
	{
		title: 'Số hợp đồng',
		key: 'number_contract',
		width: 180,
	},
	{
		title: 'Phí đóng',
		key: 'total_fee',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Điểm tích lũy',
		key: 'total_xp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
