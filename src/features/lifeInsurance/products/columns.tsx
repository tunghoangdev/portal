import type { BaseColumnOptions } from '@/types/data-table-type';
import { Icons } from '@/components/icons';
import {
	ProductCell,
	ProviderCell,
	ShowHideCell,
} from '@/features/shared/components/cells';

export const lifeProductColumns: BaseColumnOptions<any>[] = [
	{
		title: 'Sản phẩm',
		key: 'product_name',
		render: (row) => (
			<ProductCell is_main={row.is_main} name={row.product_name} />
		),
		width: 300,
	},
	{
		title: 'Sản phẩm chính',
		exportable: true,
		key: 'is_main',
	},
	{
		title: 'Nhà cung cấp',
		key: 'provider_name',
		render: (row) => (
			<ProviderCell name={row.provider_name} code={row.provider_code} />
		),
	},
	{
		title: 'Hệ số tính thưởng',
		key: 'xfyp_index',
		type: 'number',
	},
	{
		title: 'Hệ số tính điểm',
		key: 'xp_index',
		type: 'number',
	},
	{
		title: 'Hệ số điểm K2',
		key: 'xp_index_k2',
		type: 'number',
	},
	{
		title: 'Hệ số điểm K3',
		key: 'xp_index_k3',
		type: 'number',
	},
	{
		title: 'Hệ số điểm K4',
		key: 'xp_index_k4',
		type: 'number',
	},
	{
		title: 'Ẩn sản phẩm',
		key: 'is_hide',
		align: 'center',
		render: (row) => <ShowHideCell isShow={!row.is_hide} />,
	},
];

export const lifeProductPercentageColumns: BaseColumnOptions<any>[] = [
	// {
	// 	title: 'Thưởng TVTC (%)',
	// 	key: 'percentage_finan',
	// 	type: 'number',
	// },
	{
		title: 'Thưởng bán hàng K2 (%)',
		key: 'percentage_sale_k2',
		type: 'number',
		width: 200,
	},
	{
		title: 'Thưởng TVTC K2 (%)',
		key: 'percentage_finan_k2',
		type: 'number',
		width: 200,
	},
	{
		title: 'Thưởng bán hàng K3 (%)',
		key: 'percentage_sale_k3',
		type: 'number',
		width: 200,
	},
	{
		title: 'Thưởng TVTC K3 (%)',
		key: 'percentage_finan_k3',
		type: 'number',
		width: 200,
	},
	{
		title: 'Thưởng bán hàng K4 (%)',
		key: 'percentage_sale_k4',
		type: 'number',
		width: 200,
	},
	{
		title: 'Thưởng TVTC K4 (%)',
		key: 'percentage_finan_k4',
		type: 'number',
		width: 200,
	},
];
