import { useAuth, useCrud, useDataQuery } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { getColumns } from "~/features/shared/common";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { reportPaidoutColumns } from "~/components/table-columns";

const columns = getColumns<any>(reportPaidoutColumns);

export default function PageClient() {
  const { role } = useAuth();
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: API_ENDPOINTS[role].reports.paidoutList.list,
    rangeFilter: true,
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
    />
  );
}
