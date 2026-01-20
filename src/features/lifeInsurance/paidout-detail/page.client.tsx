import { API_ENDPOINTS } from "@/constant/api-endpoints";
import {
  getColumns,
  noneLifePaidoutDetailColumns,
} from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
const columns = getColumns<any>(noneLifePaidoutDetailColumns);
export default function PageClient() {
  const { user, role } = useAuth();
  const basePath = API_ENDPOINTS[role].lifeInsurance.paidoutDetail;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    periodFilter: true,
    filter: {
      provider_code: true,
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
