import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	FileDowloadCell,
	ImageCell,
	LabelCell,
} from '~/features/shared/components/cells';

export const incomeOutcomeColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Số chứng từ',
		key: 'receipt_no',
		width: 180,
	},
	{
		title: 'Ngày chứng từ',
		key: 'real_date',
		type: 'date',
	},
	{
		title: 'Loại',
		key: 'type_name',
		width: 120,
	},
	{
		title: 'Hạng mục cha',
		key: 'inout_come_name_parent',
		width: 160,
	},
	{
		title: 'Hạng mục',
		key: 'inout_come_name',
		width: 160,
	},
	{
		title: 'Số tiền',
		key: 'amount',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Ghi chú',
		key: 'description',
		width: 300,
	},

	{
		title: 'Trạng thái',
		key: 'is_lock',
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang mở"
				inactiveLabel="Đã khóa"
			/>
		),
	},
	{
		title: 'Hình ảnh',
		key: 'cash_book_image',
		render: (row) => (
			<ImageCell fileName={row.cash_book_image} folderPath={'notify'} />
		),
		width: 200,
	},
	{
		title: 'File Pdf',
		key: 'cash_book_file',
		render: (row) => (
			<FileDowloadCell fileName={row.cash_book_file} label="Tải file" />
		),
		width: 200,
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
