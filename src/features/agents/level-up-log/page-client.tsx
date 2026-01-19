
import { useAuth, useCrud, useDataQuery } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { getColumns } from "@/features/shared/common/get-columns";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { levelUpLogBaseColumns } from "./columns";

const columns = getColumns<any>(levelUpLogBaseColumns);

export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].agents.promotionHistory;
  // CRUD HOOKS
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const {
    listData,
    isFetching,
    fetchNextPage,
    total,
    isFetchingNextPage,
    hasNextPage,
  }: any = getInfinite();
  return (
    <DataTable
      data={listData}
      columns={columns}
      total={total}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
