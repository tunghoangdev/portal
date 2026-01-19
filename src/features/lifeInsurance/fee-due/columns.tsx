import type { BaseColumnOptions } from "@/types/data-table-type";
import { UserCell } from "@/features/shared/components/cells";

export const feeDueColumns: BaseColumnOptions<any>[] = [
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => <UserCell data={row} showLevel />,
    width: 250,
  },
  {
    title: "Cấp bậc",
    exportTitle: "Cấp bậc",
    key: "agent_level_code",
    exportable: true,
  },
  {
    title: "SĐT thành viên",
    exportTitle: "SĐT thành viên",
    key: "agent_phone",
    exportable: true,
  },
  {
    title: "Khách hàng",
    key: "customer_name",
    render: (row) => (
      <UserCell
        data={row}
        nameKey="customer_name"
        phoneKey="customer_phone"
        hideAvatar
      />
    ),
    width: 200,
  },
  // {
  // 	title: 'Tên khách hàng',
  // 	key: 'customer_name',
  // 	exportable: true,
  // 	exportTitle: 'Tên khách hàng',
  // },
  {
    title: "Tên khách hàng",
    key: "customer_phone",
    exportable: true,
    exportTitle: "SĐT khách hàng",
  },
  {
    title: "Số hợp đồng",
    key: "number_contract",
  },
  {
    title: "Sản phẩm",
    key: "product_name",
    width: 250,
  },
  {
    title: "Tổng phí đóng",
    key: "total_fee",
    type: "number",
    summary: "sum",
  },
  {
    title: "Ngày phát hành",
    key: "issued_date",
    type: "date",
  },
  {
    title: "Ngày hiệu lực",
    key: "effective_date",
    type: "date",
  },
  // {
  // 	title: 'Trạng thái',
  // 	key: 'life_status_name',
  // 	type: 'currency',
  // 	render: (row) => {
  // 		const { id_life_status, life_status_name } = row || {};
  // 		return <StatusCell id={id_life_status} name={life_status_name} />;
  // 	},
  // },
  {
    title: "Nhà cung cấp",
    key: "provider_name",
  },
];
