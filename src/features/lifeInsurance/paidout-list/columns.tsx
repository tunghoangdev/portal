import type { BaseColumnOptions } from '@/types/data-table-type';

import {
	StatusAgentCell,
	StatusEcontractCell,
	UserCell,
} from '@/features/shared/components/cells';

export const lifePaidoutColumns: BaseColumnOptions<any>[] = [
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
		title: 'Trạng thái thành viên',
		key: 'agent_status_name',
		type: 'currency',
		render: (row) => {
			const { id_agent_status, agent_status_name } = row || {};
			return <StatusAgentCell id={id_agent_status} name={agent_status_name} />;
		},
		width: 180,
	},
	{
		title: 'Trạng thái hợp đồng',
		key: 'econtract_status',
		render: (row) => <StatusEcontractCell status={row.econtract_status} />,
		width: 180,
	},
	{
		title: 'Ngân hàng',
		key: 'bank_name',
		width: 300,
	},
	{
		title: 'Số tài khoản',
		key: 'bank_number',
	},
	{
		title: 'Mã số thuế',
		key: 'tax_no',
	},
	{
		title: 'Tổng tiền trước thuế',
		key: 'amount',
		type: 'number',
		summary: 'sum',
		width: 180,
	},
	{
		title: 'Thuế TNCN',
		key: 'tax',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Tổng tiền sau thuế',
		key: 'total',
		type: 'number',
		summary: 'sum',
	},
];
