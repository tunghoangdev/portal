import type { BaseColumnOptions } from '@/types/data-table-type';
import {
	FileDowloadCell,
	HotCell,
	ImageCell,
	ShowHideCell,
} from '@/features/shared/components/cells';

export const notificationColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Thông báo',
		key: 'announcement_name',
		render: (row) => (
			<HotCell value={row.announcement_name} isHot={row.is_hot} />
		),
		width: 500,
	},
	{
		title: 'Hình ảnh',
		key: 'announcement_image',
		render: (row) => (
			<ImageCell fileName={row.announcement_image} folderPath={'notify'} />
		),
		width: 250,
	},
	{
		title: 'File đính kèm',
		key: 'announcement_file',
		render: (row) => (
			<FileDowloadCell
				fileName={row.announcement_file}
				label={'Xem tài liệu'}
			/>
		),
		width: 200,
	},

	{
		title: 'Ẩn thông báo',
		key: 'is_hide',
		render: (row) => <ShowHideCell isShow={!row.is_hide} />,
		width: 200,
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
	},
];
