import type { BaseColumnOptions } from '~/types/data-table-type';

export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Loại',
		key: 'type_name',
		width: 120,
	},
	{
		title: 'Hạng mục cha',
		key: 'inout_come_name_parent',
		width: 300,
	},
	{
		title: 'Hạng mục',
		key: 'inout_come_name',
		width: 300,
	},
	{
		title: 'Số tiền',
		key: 'amount',
		type: 'number',
		summary: 'sum',
	},
];
