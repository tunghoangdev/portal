
import { useAuth, useCrud, useDataQuery } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { getColumns } from "@/features/shared/common/get-columns";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { changeManagerColumns } from "./columns";

const columns = getColumns<any>(changeManagerColumns);
export default function PageClient() {
  // HOOKS
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].agents.changeManager;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite } = useCrud(queryKey, queryParams);

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
    />
  );
}
