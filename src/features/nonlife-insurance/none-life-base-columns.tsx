import type { BaseColumnOptions } from '@/types/data-table-type';
import {
	StatusCell,
	UserCell,
	FileDowloadCell,
	HotCell,
} from '@/features/shared/components/cells';
export const noneLifeBaseColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => <UserCell data={row} showLevel />,
		width: 250,
	},
	{
		title: 'Cấp bậc',
		exportTitle: 'Cấp bậc',
		key: 'agent_level_code',
		exportable: true,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Trạng thái',
		key: 'none_life_status_name',
		render: (row) => (
			<StatusCell
				id={row.id_none_life_status}
				name={row.none_life_status_name}
				isNoneLife
			/>
		),
		width: 250,
	},
	{
		title: 'Số hợp đồng',
		key: 'number_contract',
		width: 150,
	},
	{
		title: 'Sản phẩm',
		key: 'product_name',
		render: (row) => <HotCell value={row.product_name} isHot={row.is_main} />,
		width: 250,
	},
	{
		title: 'Tổng doanh số',
		key: 'total_fee',
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
		title: 'Tải giấy chứng nhận',
		key: 'link_cer',
		render: (row) => (
			<FileDowloadCell
				fileName={row.link_cer}
				label="Tải giấy chứng nhận"
				extra
			/>
		),
		width: 200,
	},
	// {
	// 	title: 'File đính kèm',
	// 	key: 'announcement_file',
	// 	render: (row) => <FileDowloadCell fileName={row.announcement_file} />,
	// },
	// {
	// 	title: 'Link tài liệu',
	// 	key: 'link_doc',
	// 	render: (row) => <FileDowloadCell fileName={row.link_doc} />,
	// },
	// {
	// 	title: 'File pdf',
	// 	key: 'cash_book_file',
	// 	render: (row) => <FileDowloadCell fileName={row.cash_book_file} />,
	// },
	// {
	// 	title: 'Loại hợp đồng',
	// 	key: 'life_type_name',
	// 	render: (row) => (
	// 		<LifeTypeCell id={row.id_life_type} name={row.life_type_name} />
	// 	),
	// },
	// {
	// 	title: 'Loại Loại đóng phí',
	// 	key: 'life_fee_times',
	// },

	// {
	// 	title: 'Doanh số SPC',
	// 	key: 'main_xfyp',
	// 	type: 'number',
	// 	summary: 'sum',
	// },
	// {
	// 	title: 'Doanh số SPBT',
	// 	key: 'sub_xfyp',
	// 	type: 'number',
	// 	summary: 'sum',
	// },
	// {
	// 	title: 'Tổng điểm tích lũy',
	// 	key: 'total_xp',
	// 	type: 'number',
	// 	summary: 'sum',
	// },
	{
		title: 'Nhà cung cấp',
		key: 'none_life_provider_name',
		width: 200,
	},
	{
		title: 'Kỳ tính thưởng',
		key: 'period_name',
	},
	{
		title: 'Ngày hiệu lực',
		key: 'effective_date',
		type: 'date',
	},
	{
		title: 'Tháng hiệu lực',
		key: 'effective_month',
	},
	{
		title: 'Ngày hết hạn',
		key: 'expired_date',
		type: 'date',
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
	},

	// {
	// 	title: 'Ngày phát hành',
	// 	key: 'issued_date',
	// 	type: 'date',
	// },
	// {
	// 	title: 'Ngày hiệu lực',
	// 	key: 'effective_date',
	// 	type: 'date',
	// },
	// {
	// 	title: 'Ngày ACK',
	// 	key: 'ack_date',
	// 	type: 'date',
	// },

	// {
	// 	title: 'TVTC',
	// 	key: 'note',
	// 	render: (row) => (
	// 		<UserCell
	// 			data={row}
	// 			nameKey="finan_name"
	// 			phoneKey="finan_phone"
	// 			avatarKey="finan_avatar"
	// 			levelIdKey="id_finan_level"
	// 			levelCodeKey="finan_code"
	// 		/>
	// 	),
	// 	// roles: ['admin', 'staff'], // hoặc roles
	// },
	{
		title: 'Nguồn',
		key: 'origin',
		width: 120,
		// roles: ['admin', 'staff'], // hoặc roles
	},
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
	},
	{
		title: 'Tên khách hàng',
		key: 'customer_name',
		exportable: true,
		exportTitle: 'Tên khách hàng',
	},
	{
		title: 'Tên khách hàng',
		key: 'customer_phone',
		exportable: true,
		exportTitle: 'SĐT khách hàng',
	},
];
