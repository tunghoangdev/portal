
import { useAuth, useCrud, useDataQuery } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { getColumns } from "@/features/shared/common";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { notificationColumns } from "../notification-columns";
const columns = getColumns<any>(notificationColumns, {
  omitKeys: ["is_hide"],
});

export default function PageClient() {
  const { user, role } = useAuth();
  const { queryParams, queryKey } = useDataQuery({
    basePath: API_ENDPOINTS[role].notifications.list,
    filter: {
      id_agent: user?.id,
      id_agent_level: user?.id_agent_level,
    },
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
      columnPinningConfig={{ left: ["title"], right: [] }}
    />
  );
}
