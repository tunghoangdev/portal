import { useAuth, useDataQuery } from "@/hooks";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { DataTable } from "@/features/shared/components/data-table";
import { useCrud } from "@/hooks/use-crud-v2";
import { getColumns } from "@/features/shared/common";
import { noneLifePaidoutDetailColumns } from "./columns";

const columns = getColumns<any>(noneLifePaidoutDetailColumns);

export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].abroad.paidoutDetail;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    monthFilter: true,
    periodFilter: true,
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
    />
  );
}
