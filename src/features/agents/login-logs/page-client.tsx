import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { agentLoginLogsColumns } from "./columns";
import { DataTable } from "@/features/shared/components/data-table";
import { useCrud } from "@/hooks/use-crud-v2";
import { getColumns } from "@/features/shared/common";
import { useAuth, useDataQuery } from "@/hooks";

const columns = getColumns<any>(agentLoginLogsColumns);

export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].agents.loginList;
  // CRUD HOOKS
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    endpoint: "",
    basePath: basePath,
    rangeFilter: true,
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
    />
  );
}
