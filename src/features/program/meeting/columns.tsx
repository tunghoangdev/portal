import type { BaseColumnOptions } from '~/types/data-table-type';
import { getEventStatus } from '~/utils/formater';
import { Chip, Stack } from '~/components/ui';
import { Icons } from '~/components/icons';
import {
	LevelCell,
	ImageCell,
	HotCell,
	EventDateCell,
	ContentCell,
	PermissionCell,
	ShowHideRevoCell,
	ShowHideCell,
} from '~/features/shared/components/cells';

export const listColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Tiêu đề',
		key: 'title_name',
		width: 300,
		render: (row) => <HotCell value={row.title_name} isHot={row.is_hot} />,
	},
	{
		title: 'Thời gian bắt đầu',
		key: 'start_date',
		type: 'datetime',
		width: 250,
		render: (row) => <EventDateCell startDate={row.start_date} />,	
		// render: (row) => {
		// 	const date = getEventStatus(row.start_date).formattedDate
		// 		? getEventStatus(row.start_date).formattedDate?.split(',')
		// 		: [];
		// 	return (
		// 		<>
		// 			{date?.length ? (
		// 				<div className="text-blue-700 font-medium text-[11px]">
		// 					<div className="text-primary">
		// 						{date[0]}, Lúc: {date[1]}, Ngày: {date[2]}
		// 					</div>
		// 				</div>
		// 			) : (
		// 				<Chip
		// 					color={getEventStatus(row.start_date).color as any}
		// 					size="sm"
		// 					variant="bordered"
		// 					radius="sm"
		// 				>
		// 					{getEventStatus(row.start_date).status}
		// 				</Chip>
		// 			)}
		// 		</>
		// 	);
		// },
	},
	{
		title: 'Trạng thái',
		key: 'status',
		width: 250,	render: (row) => <EventDateCell startDate={row.start_date} type='status' />,	
		// render: (row) => (
		// 	<Chip
		// 		color={(getEventStatus(row.start_date, true).color as any) || 'info'}
		// 		size="sm"
		// 		variant="bordered"
		// 		radius="sm"
		// 	>
		// 		{getEventStatus(row.start_date, true).status}
		// 	</Chip>
		// ),
		hiddenExport: true,
	},
	{
		title: 'Trạng thái',
		key: 'status_meeting',
		exportable: true,
	},
	{
		title: 'ID cuộc họp',
		key: 'id_meeting',
		width: 180,
	},
	{
		title: 'Mật khẩu',
		key: 'pass_meeting',
		width: 160,
	},
	{
		title: 'Hình ảnh',
		key: 'link_image',
		render: (row) => <ImageCell fileName={row.link_image} />,
	},
	{
		title: 'Nội dung',
		key: 'description',
		type: 'content',
		width: 250,
		render: (row) => <ContentCell value={row.description} />,
	},
	{
		title: 'Phân quyền',
		key: 'permission_doc_name',
		width: 350,
		render: (row) => <PermissionCell value={row.permission_doc_name} />,
		hiddenExport: true,
	},
	{
		title: 'Phân quyền',
		key: 'permission_doc_name',
		exportable: true,
		exportTitle: 'Phân quyền',
	},
	{
		title: 'Hiển thị',
		key: 'is_hide',
		render: (row) => <ShowHideCell isShow={!row.is_hide} />,
	},
	// {
	// 	title: 'Nổi bật',
	// 	key: 'is_hot',
	// 	render: (row) => (
	// 		<Stack alignItems={'center'}>
	// 			<span className="text-secondary mr-2">{row.document_name}</span>
	// 			{row.is_hot ? (
	// 				<Icons.star className="fill-secondary" strokeWidth={0} size={18} />
	// 			) : (
	// 				<Icons.star className="fill-default" strokeWidth={0} size={18} />
	// 			)}
	// 		</Stack>
	// 	),
	// },
	{
		title: 'Link cuộc họp',
		key: 'link_meeting',
		width: 280,
		hiddenExport: true,
	},
	{
		title: 'Ngày khởi tạo',
		key: 'created_date',
		type: 'date',
	},
];
