import type { BaseColumnOptions } from '~/types/data-table-type';
import {
	FileDowloadCell,
	HotCell,
	ImageCell,
	PermissionCell,
	ShowHideCell,
} from '~/features/shared/components/cells';

export const docMemberColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Tên tài liệu',
		key: 'document_name',
		render: (row) => <HotCell value={row.document_name} isHot={row.is_hot} />,
		width: 400,
	},
	{
		title: 'Loại tài liệu',
		key: 'document_type_name',
		width: 180,
	},

	{
		title: 'Link tài liệu',
		key: 'link_doc',
		render: (row) => (
			<FileDowloadCell fileName={row.link_doc} label={'Xem tài liệu'} />
		),
		width: 300,
	},
	{
		title: 'Quyền xem',
		key: 'permission_doc',
		render: (row) => <PermissionCell row={row} />,
		width: 350,
		hiddenExport: true,
	},
	{
		title: 'Quyền xem',
		key: 'permission_doc_name',
		exportable: true,
		// render: (row) => row?.permissions?.map((item: any) => item.level_code),
		exportTitle: 'Quyền xem',
	},
	{
		title: 'Ẩn tài liệu',
		key: 'is_hide',
		align: 'center',
		render: (row) => <ShowHideCell isShow={!row.is_hide}/>,
		width: 150,
	},
];

export const docMemberInternalColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Loại tài liệu',
		key: 'document_internal_type_name',
		width: 180,
	},
	{
		title: 'Tên tài liệu',
		key: 'document_internal_name',
		width: 300,
	},
	{
		title: 'Hình ảnh',
		key: 'document_internal_image',
		render: (row) => (
			<ImageCell fileName={row.document_internal_image} folderPath={'notify'} />
		),
		width: 350,
	},

	{
		title: 'Link tài liệu',
		key: 'document_internal_file',
		render: (row) => (
			<FileDowloadCell
				fileName={row.document_internal_file}
				label={'Xem tài liệu'}
			/>
		),
		width: 300,
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		// align: 'center',
		type: 'date',
		width: 300,
	},
];
