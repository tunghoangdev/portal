import type { BaseColumnOptions } from '@/types/data-table-type';

export const lifeProviderColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Nhà cung cấp',
		key: 'provider_name',
		render: (row) => `${row.provider_code} - ${row.provider_name}`,
		width: 250,
	},
	{
		title: 'Địa chỉ',
		key: 'address',
		width: 300,
	},
	{
		title: 'Số điện thoại',
		key: 'phone',
	},
	{
		title: 'Email',
		key: 'email',
		width: 250,
	},
	{
		title: 'Người liên hệ',
		key: 'person_contact',
	},
	{
		title: 'Điện thoại người liên hệ',
		key: 'person_contact_phone',
		width: 200,
	},
	// {
	// 	title: 'Thao tác',
	// 	key: 'actions',
	// 	actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
	// },
];
