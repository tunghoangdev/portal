import { useAuth, useDataQuery } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { getColumns } from "~/features/shared/common";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks/use-crud-v2";
import { BaseColumns } from "./columns";

const columns = getColumns<any>(BaseColumns);

export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].abroad.profixDetailAll;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    filter: {
      provider_code: true,
    },
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const {
    listData,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    total,
  }: any = getInfinite();

  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        left: [],
        right: [],
      }}
      total={total || 0}
      filterFields={["provider"]}
    />
  );
}
