import type { BaseColumnOptions } from '@/types/data-table-type';
import { HotCell } from '@/features/shared/components/cells';

export const noneLifeProductDetailColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Sản phẩm',
		key: 'none_life_product_name',
		// render: (row: any) => (
		// 	<Stack alignItems={'center'} className="gap-2">
		// 		<Typography variant={'body2r'}>{row.none_life_product_name}</Typography>
		// 		{row.is_main && (
		// 			<Icons.star size={12} className="text-warning fill-warning" />
		// 		)}
		// 	</Stack>
		// ),
		render: (row: any) => (
			<HotCell value={row.none_life_product_name} isHot={row.is_main} />
		),
		width: 300
	},
	{
		title: 'Tổng doanh số',
		key: 'fee',
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
