import type { BaseColumnOptions } from '~/types/data-table-type';
import { LabelCell } from '~/features/shared/components/cells';

export const levelColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Cấp bậc',
		key: 'level_code',
		width: 200
	},
	{
		title: 'Trạng thái',
		key: 'is_lock',
		render: (row) => (
			<LabelCell
				active={!row.is_lock}
				activeLabel="Đang hoạt động"
				inactiveLabel="Đã khóa"
			/>
		),
	}
];
