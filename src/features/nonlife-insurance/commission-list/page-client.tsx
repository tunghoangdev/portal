"use client";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { noneLifeContractCommissionColumns } from "@/features/nonlife-insurance/none-life-commission-columns";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useCrud, useDataQuery, useTableColumns } from "@/hooks";

export default function PageClient() {
  const { user, role } = useAuth();
  // const { getAll } = useCrud([API_ENDPOINTS.dic.agentLevel], {
  // 	endpoint: '',
  // });
  const { columns } = useTableColumns(noneLifeContractCommissionColumns, {
    showCommission: true,
    hiddenPercent: true,
  });

  // CRUD API HOOK
  const basePath = API_ENDPOINTS[role].nonLifeInsurance.commissionList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    periodFilter: true,
    filter: {
      provider_code: true,
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
        left: ["agent_name"],
      }}
      filterFields={["provider"]}
    />
  );
}
