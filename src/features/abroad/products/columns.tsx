import type { BaseColumnOptions } from "~/types/data-table-type";
import { ProviderCell, ShowHideCell } from "~/features/shared/components/cells";

export const columns: BaseColumnOptions<any>[] = [
  {
    title: "Sản phẩm",
    key: "product_name",
    width: 300,
  },
  {
    title: "Nhà cung cấp",
    key: "provider_name",
    render: (row) => (
      <ProviderCell code={row.provider_code} name={row.provider_name} />
    ),
    width: 200,
  },
  {
    title: "Doanh số",
    key: "fee",
    type: "number",
  },
  {
    title: "Hệ số tính điểm",
    key: "xp_index",
  },
  {
    title: "Tổng thưởng nhà cung cấp (%)",
    key: "commission_provider",
    width: 250,
  },
  {
    title: "Tổng thưởng trả thành viên (%)",
    key: "commission_agent",
    width: 250,
  },
  {
    title: "Lợi nhuận gộp (%)",
    key: "commission_lng",
  },
  {
    title: "Ẩn sản phẩm",
    key: "is_hide",
    align: "center",
    render: (row) => <ShowHideCell isShow={!row.is_hide} />,
  },
];
