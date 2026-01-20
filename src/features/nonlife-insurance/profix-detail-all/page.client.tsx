import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { noneLifeProfixDetailColumns } from "../none-life-profix-detail-columns";

const columns = getColumns<any>(noneLifeProfixDetailColumns);

export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].nonLifeInsurance.profixDetailAll;
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
