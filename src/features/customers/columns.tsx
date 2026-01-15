import type { BaseColumnOptions } from "~/types/data-table-type";
import { LabelCell, UserCell } from "~/features/shared/components/cells";
export const customerColumns: BaseColumnOptions<any>[] = [
  {
    title: "Mã khách hàng",
    key: "customer_code",
    width: 180,
  },
  {
    title: "Thành viên",
    key: "agent_name",
    render: (row) => <UserCell data={row} hideAvatar />,
    width: 200,
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
        hideAvatar
        phoneKey="customer_phone"
        nameKey="customer_name"
      />
    ),
    width: 200,
  },
  {
    title: "",
    exportTitle: "Số điện thoại khách hàng",
    key: "customer_phone",
    hidden: true,
    exportable: true,
  },
  { title: "Tổng doanh số", key: "fyp_all", type: "number", summary: "sum" },
  {
    title: "Ngày sinh",
    key: "birthday",
    type: "date",
    width: 200,
  },
  {
    title: "Giới tính",
    key: "gender",
    width: 120,
  },
  {
    title: "Email",
    key: "email",
    width: 250,
  },
  {
    title: "Địa chỉ",
    key: "full_address",
    width: 250,
  },
  {
    title: "Loại khách hàng",
    key: "is_company",
    align: "center",
    render: (row) => (
      <LabelCell
        active={row?.is_company}
        activeLabel="Doanh nghiệp"
        activeColor="primary"
        inactiveColor="secondary"
        inactiveLabel="Cá nhân"
      />
    ),
  },
  {
    title: "Thành viên",
    key: "is_agent",
    align: "center",
    render: (row) => (
      <LabelCell
        active={row?.is_agent}
        activeLabel="Thành viên"
        inactiveLabel="Không"
      />
    ),
  },
  {
    title: "Ngày khởi tạo",
    key: "created_date",
    type: "date",
  },
];
