import type { BaseColumnOptions } from '@/types/data-table-type';
import {
	LabelCell,
	FileDowloadCell,
	ImageCell,
	ShowHideCell,
	PermissionCell,
} from '@/features/shared/components/cells';
import { formatDateTimeVN } from '@/utils/formater';
export const programColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Chương trình',
		key: 'program_name',
		width: 250,
	},
	{
		title: 'Trạng thái',
		key: 'is_start',
		render: (row) => (
			<LabelCell
				active={row.is_start}
				activeLabel={'Đang hoạt động'}
				inactiveLabel={'Đã kết thúc'}
			/>
		),
		// render: (row) => (
		//   <Chip
		//     size="sm"
		//     color={row.is_start ? "success" : "danger"}
		//     className="text-white"
		//   >
		//     {row.is_start ? "Đang hoạt động" : "Đã kết thúc"}
		//   </Chip>
		// ),
	},
	{
		title: 'Thời gian bắt đầu',
		key: 'start_date',
		render: (row) => formatDateTimeVN(row.start_date, 'dd/MM/yyyy HH:mm'),
		hiddenExport: true,
	},
	{
		title: 'Thời gian kết thúc',
		key: 'finished_date',
		render: (row) => formatDateTimeVN(row.finished_date, 'dd/MM/yyyy HH:mm'),
		hiddenExport: true,
	},
{
		title: 'Thời gian bắt đầu',
		key: 'start_date',
		type: 'datetime',
		exportable: true,
		exportTitle: 'Thời gian bắt đầu',
		// render: (row) => formatDateTimeVN(row.start_date, 'dd/MM/yyyy HH:mm'),
	},
	{
		title: 'Thời gian kết thúc',
		key: 'finished_date',
		type: 'datetime',
		exportable: true,
		exportTitle: 'Thời gian kết thúc',
		// render: (row) => formatDateTimeVN(row.finished_date, 'dd/MM/yyyy HH:mm'),
	},

	{
		title: 'Quyền xem',
		key: 'permission_doc_name',
		exportable: true,
		exportTitle: 'Quyền xem',
	},
	{
		title: 'Hình ảnh',
		key: 'program_image',
		render: (row) => (
			<ImageCell fileName={row.program_image} folderPath={'notify'} />
		),
		width: 200,
	},
	{
		title: 'File chương trình',
		key: 'program_file',
		render: (row) => (
			<FileDowloadCell fileName={row.program_file} label={'Xem tài liệu'} />
		),
		width: 200,
	},
	{
		title: 'File kết quả',
		key: 'result_file',
		render: (row) => (
			<FileDowloadCell fileName={row.result_file} label={'Xem tài liệu'} />
		),
		width: 200,
	},
	{
		title: 'Ẩn chương trình',
		key: 'is_hide',
		render: (row) => <ShowHideCell isShow={!row.is_hide} />,
	},
	{
		title: 'Quyền xem',
		key: 'permission_doc',
		render: (row) => <PermissionCell row={row} />,
		width: 350,
		align: 'center',
		hiddenExport: true,
	},
	{
		title: 'Ngày tạo',
		key: 'created_date',
		type: 'date',
	},
];
