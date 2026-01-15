import type { BaseColumnOptions } from '~/types/data-table-type';
export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Mục cha',
		key: 'outcome_name_parent',
		width: 350,
	},
	{
		title: 'Mục chi',
		key: 'outcome_name',
		width: 350,
	},
];
