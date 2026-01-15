import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	LabelCell,
	UserCell,
	ImageCell,
	StatusAgentCell,
	StatusEcontractCell,
} from '~/features/shared/components/cells';
import { formatDate } from '~/utils/formater';
// const UserCell = dynamic(
// 	() =>
// 		import('~/features/shared/components/cells/user-cell').then(
// 			(mod) => mod.UserCell,
// 		),
// 	{
// 		ssr: false,
// 	},
// );
// const ImageCell = dynamic(
// 	() =>
// 		import('~/features/shared/components/cells/image-cell').then(
// 			(mod) => mod.ImageCell,
// 		),
// 	{
// 		ssr: false,
// 	},
// );
// const StatusAgentCell = dynamic(
// 	() =>
// 		import('~/features/shared/components/cells/status-agent-cell').then(
// 			(mod) => mod.StatusAgentCell,
// 		),
// 	{
// 		ssr: false,
// 	},
// );

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
				showLevel
			/>
		),
		width: 250,
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
		title: 'Tổng số TV',
		key: 'child_all',
	},

	{
		title: 'TV trực tiếp',
		key: 'child_direct',
	},
	{
		title: 'Trạng thái thành viên',
		key: 'agent_status_name',
		render: (row) => <StatusAgentCell id={row.id_agent_status} name={row.agent_status_name} />,
		width: 200,
	},
	{
		title: 'Trạng thái hợp đồng',
		key: 'status_econtract',
		render: (row) => <StatusEcontractCell status={row.status_econtract} />,
		width: 200,
	},
	{
		title: 'Khóa truy cập',
		key: 'is_lock',
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang mở"
				inactiveLabel="Đã khóa"
				activeColor="success"
				inactiveColor="danger"
			/>
			// <Chip
			// 	color={row.is_lock ? 'danger' : 'success'}
			// 	radius="sm"
			// 	size="sm"
			// 	variant="bordered"
			// 	className="border"
			// >
			// 	{row.is_lock ? 'Đã khóa' : 'Đang mở'}
			// </Chip>
		),
	},
	{
		title: 'Khóa tuyển dụng',
		key: 'is_open',
		render: (row) => (
			<LabelCell
				active={row.is_open}
				activeLabel="Đang mở"
				inactiveLabel="Đã khóa"
				activeColor="success"
				inactiveColor="danger"
			/>
			// <Chip
			// 	color={!row.is_open ? 'danger' : 'primary'}
			// 	radius="sm"
			// 	size="sm"
			// 	variant="bordered"
			// 	className="border"
			// >
			// 	{!row.is_open ? 'Đã khóa' : 'Đang mở'}
			// </Chip>
		),
	},
	// {
	// 	title: 'Mở trùng TV',
	// 	key: 'is_duplicate',
	// 	render: (row) => (
	// 		<LabelCell
	// 			active={row.is_duplicate}
	// 			activeLabel="Đang mở"
	// 			inactiveLabel="Đã khóa"
	// 			activeColor="success"
	// 			inactiveColor="danger"
	// 		/>
	// 		// <Chip
	// 		// 	color={row.is_duplicate ? 'success' : 'danger'}
	// 		// 	radius="sm"
	// 		// 	size="sm"
	// 		// 	variant="bordered"
	// 		// 	className="border"
	// 		// >
	// 		// 	{row.is_duplicate ? 'Đang mở' : 'Đã khóa'}
	// 		// </Chip>
	// 	),
	// },
	{
		title: 'Doanh nghiệp',
		key: 'is_business',
		render: (row) => (
			<LabelCell
				active={row.is_business}
				activeLabel="Doanh nghiệp"
				inactiveLabel="Cá nhân"
				activeColor="secondary"
				inactiveColor="primary"
			/>
			// <Chip
			// 	color={row.is_business ? 'secondary' : 'primary'}
			// 	radius="sm"
			// 	variant="bordered"
			// 	className="border"
			// 	size="sm"
			// >
			// 	{row.is_business ? 'Doanh nghiệp' : 'Cá nhân'}
			// </Chip>
		),
	},
	{
		title: 'Email',
		key: 'email',
		width: 250,
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
		width: 400,
	},
	// {
	//   title: "Mã số thuế",
	//   key: "tax",
	// },
	{
		title: 'CCCD',
		key: 'id_number',
	},
	{
		title: 'Ngày cấp',
		key: 'issued_date',
		type: 'date',
	},
	// {
	// 	title: 'Nơi cấp',
	// 	key: 'issued_place',
	// 	width: 120,
	// },
	{
		title: 'Ngân hàng',
		key: 'bank_name',
		width: 320,
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
		width: 160,
	},
	{
		title: 'CCCD mặt trước',
		key: 'link_front_id',
		render: (row) => (
			<ImageCell fileName={row.link_front_id} folderPath={'cccd'} showLabel />
		),
		width: 200,
	},
	{
		title: 'CCCD mặt sau',
		key: 'link_back_id',
		render: (row) => (
			<ImageCell fileName={row.link_back_id} folderPath={'cccd'} showLabel />
		),
		width: 200,
	},
	{
		title: 'Ảnh chân dung',
		key: 'link_portrait',
		render: (row) => (
			<ImageCell fileName={row.link_portrait} folderPath={'avatar'} showLabel />
		),
		width: 200,
	},

	{
		title: 'Cấp bậc người giới thiệu',
		exportTitle: 'Cấp bậc người giới thiệu',
		key: 'parent_level_code',
		exportable: true,
		// render: (row) => (
		// 	<UserCell
		// 		data={row}
		// 		nameKey="parent_name"
		// 		phoneKey="parent_phone"
		// 		avatarKey="parent_avatar"
		// 		levelIdKey="id_parent_level"
		// 		levelCodeKey="parent_level_code"
		// 		showLevel
		// 	/>
		// ),
		// width: 200,
	},
	{
		title: 'SĐT Người giới thiệu',
		key: 'parent_phone',
		exportable: true,
	},
];
