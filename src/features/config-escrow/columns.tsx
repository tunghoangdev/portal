import type { BaseColumnOptions } from '@/types/data-table-type';
import { LevelCell } from '@/features/shared/components/cells';
export const configEscrowColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Cấp bậc',
		key: 'level_code',
		render: (row) => (
			<LevelCell
				data={row}
				levelCodeKey="level_code"
				levelIdKey="id_agent_level"
			/>
		),
		width: 100,
	},

	{
		title: 'Tiền ký quỹ',
		key: 'amount_escrow',
		type: 'number',
		width: 250,
	},
	{
		title: '% ký quỹ trên kỳ',
		key: 'percentage_period',
		width: 250,
	},
	{
		title: 'Ký quỹ tối đa trên kỳ',
		key: 'max_escrow',
		type: 'number',
	},
];
