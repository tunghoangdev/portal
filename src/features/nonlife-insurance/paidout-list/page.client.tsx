import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns, noneLifePaidoutColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useCrud, useDataQuery } from "@/hooks";

const columns = getColumns<any>(noneLifePaidoutColumns);

export default function PageClient() {
  const { user, role } = useAuth();
  const basePath = API_ENDPOINTS[role].nonLifeInsurance.paidoutList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    monthFilter: true,
    periodFilter: true,
    filter: {
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
    <>
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
      />
    </>
  );
}
