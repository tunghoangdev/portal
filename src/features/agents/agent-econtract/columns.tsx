import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	StatusAgentCell,
	StatusEcontractCell,
	UserCell,
} from '~/features/shared/components/cells';
import { formatDateTimeVN } from '~/utils/formater';

export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thành viên',
		key: 'agent_name',
		render: (row) => (
			<UserCell
				data={row}
				nameKey="agent_name"
				phoneKey="agent_phone"
				avatarKey="agent_avatar"
			/>
		),
		width: 200,
	},
	{
		title: 'SĐT thành viên',
		exportTitle: 'SĐT thành viên',
		key: 'agent_phone',
		exportable: true,
	},
	{
		title: 'Trạng thái thành viên',
		key: 'agent_status_name',
		width: 200,
		render: (row) => (
			<StatusAgentCell id={row.id_agent_status} name={row.agent_status_name} />
		),
	},
	{
		title: 'Trạng thái hợp đồng',
		key: 'status',
		render: (row) => <StatusEcontractCell status={row.status} />,
		width: 170,
	},
	{
		title: 'Hồ sơ',
		key: 'file_name',
		width: 300,
	},
	{
		title: 'Ngày ký',
		key: 'finished_date',
		width: 120,
		// type: 'date',
		render: (row) => formatDateTimeVN(row.finished_date, 'dd/MM/yyyy HH:mm'),
	},
	// {
	// 	title: 'Download',
	// 	key: 'data_pdf',
	// 	render: (row) => <Button>Tải hợp đồng</Button>,
	// },
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		render: (row) => formatDateTimeVN(row.created_date, 'dd/MM/yyyy HH:mm'),
		// type: 'datetime',
	},
];
