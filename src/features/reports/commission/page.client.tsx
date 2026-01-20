import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useTableColumns } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { reportCommissionColumns } from "./columns";

export default function PageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { columns } = useTableColumns(reportCommissionColumns, {
    showMonthYear: true,
    showLevel: true,
    // omitKeys: ["period_name", "commission_date"],
    // actions: [
    //   CRUD_ACTIONS.LOG,
    //   CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
    //   CRUD_ACTIONS.EDIT,
    //   CRUD_ACTIONS.VIEW,
    //   CRUD_ACTIONS.DELETE,
    //   CRUD_ACTIONS.CANCEL_CONTRACT,
    // ],
  });
  // CRUD APi
  const basePath = API_ENDPOINTS[role].reports.contractList;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
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
      columnPinningConfig={{
        left: ["agent_name"],
      }}
      isFetchingNextPage={isFetchingNextPage}
      total={total}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
