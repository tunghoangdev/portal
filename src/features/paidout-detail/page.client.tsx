import { useAuth, useCrud, useDataQuery } from "~/hooks";
import { getColumns } from "~/features/shared/common/get-columns";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { DataTable } from "~/features/shared/components/data-table";
import { noneLifePaidoutDetailColumns } from "~/features/shared/common";

const columns = getColumns<any>(noneLifePaidoutDetailColumns);

export default function PageClient() {
  const { user, role } = useAuth();
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: API_ENDPOINTS[role].nonLifeInsurance.paidoutDetail.list,
    rangeFilter: true,
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
