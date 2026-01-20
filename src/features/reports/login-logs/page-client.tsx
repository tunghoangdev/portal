import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useTableColumns } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { agentLoginReportsColumns } from "./columns";

export default function PageClient() {
  const { role } = useAuth();
  const { columns } = useTableColumns(agentLoginReportsColumns, {
    showLevel: true,
  });
  const { queryParams, queryKey } = useDataQuery({
    basePath: API_ENDPOINTS[role].agents.loginReport,
    endpoint: "",
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
      columnPinningConfig={{
        left: ["agent_name"],
      }}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
