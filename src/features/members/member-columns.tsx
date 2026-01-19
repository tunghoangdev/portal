import type { BaseColumnOptions } from '@/types/data-table-type';
import { ImageCell, LabelCell, StatusAgentCell, UserCell } from '@/features/shared/components/cells';
import { formatDate } from '@/utils/formater';

export const memberBaseColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell data={row} showLevel levelIdKey="id_agent_level" />
		),
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
		title: 'Tổng số TV',
		key: 'child_all',
	},

	{
		title: 'TV trực tiếp',
		key: 'child_direct',
	},
	{
		title: 'Trạng thái',
		key: 'agent_status_name',
		render: (row) => <StatusAgentCell id={row.id_agent_status} name={row.agent_status_name} />,
	},
	{
		title: 'Khóa truy cập',
		key: 'is_lock',
		render: (row) => <LabelCell active={!row.is_lock} activeLabel='Đang mở' inactiveLabel='Đã khóa' />,
	},
	{
		title: 'Khóa tuyển dụng',
		key: 'is_open',
		render: (row) =><LabelCell active={row.is_open} activeLabel='Đang mở' inactiveLabel='Đã khóa' />
	},
	{
		title: 'Mở trùng TV',
		key: 'is_duplicate',
		render: (row) => <LabelCell active={row.is_duplicate} activeLabel='Đang mở' inactiveLabel='Đã khóa' />,
	},
	{
		title: 'Doanh nghiệp',
		key: 'is_business',
		render: (row) => <LabelCell active={row.is_business} activeLabel='Doanh nghiệp' inactiveLabel='Cá nhân' activeColor='secondary' inactiveColor='default' />,
	},
	{
		title: 'Email',
		key: 'email',
	},
	{
		title: 'Ngày sinh',
		key: 'birthday',
		type: 'date',
	},
	{
		title: 'Giới tính',
		key: 'gender',
	},
	{
		title: 'Địa chỉ',
		key: 'full_address',
	},
	{
		title: 'Mã số thuế',
		key: 'tax',
	},
	{
		title: 'CCCD',
		key: 'id_number',
	},
	{
		title: 'Ngày cấp',
		key: 'issued_date',
		type: 'date',
	},
	{
		title: 'Nơi cấp',
		key: 'issued_place',
	},
	{
		title: 'Ngân hàng',
		key: 'bank_name',
	},
	{
		title: 'Số tài khoản',
		key: 'bank_number',
	},
	{
		title: 'Ngày phê duyệt',
		key: 'approval_date',
		type: 'date',
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		render: (row) => formatDate(row.created_date, 'dd/MM/yyyy HH:mm'),
	},
	{
		title: 'Tỉnh thành',
		key: 'province_name',
	},
	{
		title: 'CCCD mặt trước',
		key: 'link_front_id',
		render: (row) => (
			<ImageCell fileName={row.link_front_id} folderPath={'cccd'} />
		),
		width: 200,
	},
	{
		title: 'CCCD mặt sau',
		key: 'link_back_id',
		render: (row) => (
			<ImageCell fileName={row.link_back_id} folderPath={'cccd'} />
		),
		width: 200,
	},
	{
		title: 'Người giới thiệu',
		key: 'parent_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="parent_name"
				phoneKey="parent_phone"
				avatarKey="parent_avatar"
				levelIdKey="id_parent_level"
				levelCodeKey="parent_level_code"
			/>
		),
		width: 200,
	},
	{
		title: 'SĐT Người giới thiệu',
		key: 'parent_phone',
		exportable: true,
	},
];
