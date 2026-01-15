import type { BaseColumnOptions } from '~/types/data-table-type';
export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Mục cha',
		key: 'income_name_parent',
		width: 350,
	},
	{
		title: 'Mục thu',
		key: 'income_name',
		width: 350,
	},
];
