import type { BaseColumnOptions } from '@/types/data-table-type';
import { LabelCell, UserCell } from '@/features/shared/components/cells';

export const lifeFinancialColumns: BaseColumnOptions<any>[] = [
	{
		title: 'TVTC',
		key: 'finan_name',
		render: (row) => (
			<UserCell
				data={row}
				// showLevel
				nameKey="finan_name"
				phoneKey="finan_phone"
				avatarKey="finan_avatar"
				levelIdKey="id_finan_level"
				levelCodeKey="finan_code"
			/>
		),
		width: 250,
	},
	{
		title: 'SĐT tư vấn tài chính',
		key: 'finan_phone',
		exportable: true,
	},
	{
		title: 'Mã số tư vấn',
		key: 'finan_code',
	},
	{
		title: 'Nhà cung cấp',
		key: 'provider_name',
	},
	{
		title: 'Trạng thái hoạt động',
		key: 'is_active',
		type: 'currency',
		render: (row) => (
			<LabelCell
				active={row.is_active}
				activeLabel="Hoaạt động"
				inactiveLabel="Không hoạt động"
			/>
		),
	},

	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
