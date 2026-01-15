import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	LifeTypeCell,
	StatusCell,
	UserCell,
} from '~/features/shared/components/cells';

export const processingColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => <UserCell data={row} showLevel />,
		width: 250,
		pin: 'colPinStart',
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Cấp bậc',
		exportTitle: 'Cấp bậc',
		key: 'agent_level_code',
		exportable: true,
	},
	{
		title: 'Trạng thái',
		key: 'life_status_name',
		type: 'currency',
		render: (row) => (
			<StatusCell id={row.id_life_status} name={row.life_status_name} />
		),
		width: 150,
	},

	{
		title: 'Số yêu cầu',
		key: 'number_request',
	},
	{
		title: 'Số hợp đồng',
		key: 'number_contract',
	},
	{
		title: 'Sản phẩm',
		key: 'product_name',
		width: 200,
	},
	{
		title: 'Ngày phát hành',
		key: 'issued_date',
		type: 'date',
	},
	{
		title: 'Ngày hiệu lực',
		key: 'effective_date',
		type: 'date',
	},
	{
		title: 'Ngày ACK',
		key: 'ack_date',
		type: 'date',
	},
	{
		title: 'Tổng phí đóng',
		key: 'total_fee',
		type: 'number',
		summary: 'sum',
	},

	{
		title: 'Tổng doanh số',
		key: 'total_xfyp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Doanh số SPC',
		key: 'main_xfyp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Doanh số SPBT',
		key: 'sub_xfyp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Tổng điểm tích lũy',
		key: 'total_xp',
		type: 'number',
		summary: 'sum',
	},

	{
		title: 'Nhà cung cấp',
		key: 'life_provider_name',
		width: 200,
	},
	{
		title: 'Loại hợp đồng',
		key: 'life_type_name',
		render: (row) => (
			<LifeTypeCell id={row.id_life_type} name={row.life_type_name} />
		),
	},
	{
		title: 'Loại phí đóng',
		key: 'life_fee_times',
	},
	{
		title: 'Kỳ tính thưởng',
		key: 'period_name',
	},
	{
		title: 'Ngày tính thưởng',
		key: 'commission_date',
		type: 'date',
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
	},
	{
		title: 'TVTC',
		key: 'note',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="finan_name"
				phoneKey="finan_phone"
				avatarKey="finan_avatar"
				levelIdKey="id_finan_level"
				levelCodeKey="finan_code"
			/>
		),
		width: 200,
		hiddenExport: true,
		// roles: ['admin', 'staff'], // hoặc roles
	},
	{
		title: 'TVTC',
		key: 'finan_name',
		exportable: true,
		exportTitle: 'Tên TVTC',
	},
	{
		title: 'TVTC',
		key: 'finan_phone',
		exportable: true,
		exportTitle: 'SĐT TVTC',
	},
	// {
	// 	title: 'Kỳ tính thưởng',
	// 	key: 'period_name',
	// },
	// {
	// 	title: 'Ngày tính thưởng',
	// 	key: 'commission_date',
	// 	type: 'date',
	// },
	{
		title: 'Khách hàng',
		key: 'customer_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="customer_name"
				phoneKey="customer_phone"
				hideAvatar
			/>
		),
		width: 250,
		hiddenExport: true,	
		// roles: ['admin', 'staff'], // hoặc roles
	},
	{
		title: 'Tên khách hàng',
		key: 'customer_name',
		exportable: true,
		exportTitle: 'Tên khách hàng',
	},
	{
		title: 'SĐT khách hàng',
		key: 'customer_phone',
		exportable: true,
		exportTitle: 'SĐT khách hàng',
	},
];
