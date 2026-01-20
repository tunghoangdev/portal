import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useTableColumns } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { commissionColumns } from "./columns";
const staticColumns: any = [
  {
    title: "Thưởng tư vấn tài chính",
    key: "commission_type_level_tvtc",
    type: "number",
    summary: "sum",
    width: 200,
  },
  {
    title: "Thưởng bán hàng k2",
    key: "commission_type_sale_k2",
    type: "number",
    summary: "sum",
    width: 200,
  },
  {
    title: "Thưởng tư vấn tài chính k2",
    key: "commission_type_tvtc_k2",
    type: "number",
    summary: "sum",
    width: 250,
  },
  {
    title: "Thưởng bán hàng K3",
    key: "commission_type_sale_k3",
    type: "number",
    summary: "sum",
    width: 200,
  },
  {
    title: "Thưởng tư vấn tài chính k3",
    key: "commission_type_tvtc_k3",
    type: "number",
    summary: "sum",
    width: 250,
  },
  {
    title: "Thưởng bán hàng K4",
    key: "commission_type_sale_k4",
    type: "number",
    summary: "sum",
    width: 200,
  },
  {
    title: "Thưởng tư vấn tài chính k4",
    key: "commission_type_tvtc_k4",
    type: "number",
    summary: "sum",
    width: 250,
  },
];
export default function PageClient() {
  const { user, role } = useAuth();
  const { columns } = useTableColumns(commissionColumns, {
    showCommission: true,
    hiddenPercent: true,
    extraConfigs: staticColumns,
    insertExtraAt: {
      position: "end",
    },
  });

  const basePath = API_ENDPOINTS[role].lifeInsurance.commissionList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    periodFilter: true,
    filter: {
      provider_code: true,
      contract_type: true,
      id_agent: user?.id,
    },
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();

  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        left: ["life_provider_name"],
      }}
      filterFields={["provider", "contractType"]}
    />
  );
}
