import type { BaseColumnOptions } from '@/types/data-table-type';
import { HotCell } from '@/features/shared/components/cells';

export const productDetailColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Sản phẩm',
		key: 'life_product_name',
		render: (row: any) => (
			<HotCell value={row.life_product_name} isHot={row.is_main} />
		),
		width: 250,
	},
	{
		title: 'Tổng phí đóng',
		key: 'fee',
		type: 'number',
		summary: 'sum',
	},

	{
		title: 'Hệ số thưởng',
		key: 'xfyp_index',
	},
	{
		title: 'Tổng doanh số',
		key: 'xfyp',
		type: 'number',
		summary: 'sum',
	},
	{
		title: 'Hệ số điểm',
		key: 'xp_index',
	},
	{
		title: 'Tổng điểm tích lũy',
		key: 'xp',
		type: 'number',
		summary: 'sum',
	},
];
