import type { BaseColumnOptions } from '~/types/data-table-type';
import { ProductCell } from '~/features/shared/components/cells';

export const lifeProductDetailColumns: BaseColumnOptions<any>[] = [
  {
    title: 'Sản phẩm',
    key: 'life_product_name',
    render: (row: any) => (
      <ProductCell name={row.life_product_name} is_main={row.is_main} />
    ),
    width: 300,
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
