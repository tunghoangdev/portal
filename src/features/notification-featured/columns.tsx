import type { BaseColumnOptions } from '~/types/data-table-type';
import { ImageCell, LabelCell } from '~/features/shared/components/cells';

export const columns: BaseColumnOptions<any>[] = [
	{
		title: 'Hình ảnh',
		key: 'image_notice',
		render: (row) => (
			<ImageCell fileName={row.image_notice} folderPath={'notify'} />
		),
	},
	{
		title: 'Trạng thái',
		key: 'is_start',
		render: (row) => (
			<LabelCell
				active={row.is_start}
				activeLabel="Đang hoạt động"
				inactiveLabel="Đã kết thúc"
			/>
		),
	},
];
