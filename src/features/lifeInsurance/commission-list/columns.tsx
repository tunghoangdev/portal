import { LifeTypeCell, UserCell } from "@/features/shared/components/cells";
import type { BaseColumnOptions } from "@/types/data-table-type";

export const commissionColumns: BaseColumnOptions<any>[] = [
  { title: "Nhà cung cấp", key: "provider_name", width: 250 },
  { title: "Số hợp đồng", key: "number_contract", width: 200 },
  { title: "Kỳ tính thưởng", key: "period_name", width: 200 },

  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => <UserCell data={row} />,
    width: 250,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
    width: 200,
  },
  { title: "Khách hàng", key: "customer_name", width: 200 },
  { title: "Sản phẩm", key: "product_name", width: 350 },
  {
    title: "Loại hợp đồng",
    key: "life_type_name",
    render: (row) => (
      <LifeTypeCell id={row.id_life_type} name={row.life_type_name} />
    ),
    width: 250,
  },
  // {
  // 	title: 'Số tiền',
  // 	key: 'fee',
  // 	type: 'number',
  // 	summary: 'sum',
  // },
  // {
  // 	title: 'Tỷ lệ (%)',
  // 	key: 'percentage',
  // },
    {
      title: "Tổng thưởng",
      key: "amount",
      type: "number",
      summary: "sum",
    },
  // {
  //   title: "Tổng thưởng trước thuế",
  //   key: "amount",
  //   type: "number",
  //   summary: "sum",
  // },
  // {
  //   title: "Thuế TNCN",
  //   key: "tax",
  //   type: "number",
  //   summary: "sum",
  // },
  // {
  //   title: "Tổng thưởng sau thuế",
  //   key: "total",
  //   type: "number",
  //   summary: "sum",
  // },
  // {
  //   title: "Tổng thưởng sau thuế",
  //   key: "total",
  //   type: "number",
  //   summary: "sum",
  // },
];
