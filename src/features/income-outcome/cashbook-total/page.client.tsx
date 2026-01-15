import CashbookTotalStatistics from "./statistics";
import { useCrud } from "~/hooks/use-crud-v2";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  columnMonthYears,
  getColumns,
  incomeOutcomeColumns,
} from "~/features/shared/common";
import { DataTable } from "~/features/shared/components/data-table";
import { useAuth, useCommon, useDataQuery } from "~/hooks";
const newColumns = [...incomeOutcomeColumns, ...columnMonthYears("real_date")];
const columns = getColumns<any>(newColumns);
const PageClient = () => {
  const { role } = useAuth();
  const { periodDate } = useCommon();
  // *** STATE ***
  const basePath = API_ENDPOINTS[role].incomeOutcome.cashbookTotal;
  // CRUD HOOKS
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
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
  const { getAll } = useCrud(
    [API_ENDPOINTS[role].incomeOutcome.cashbookTotal.statistic, periodDate],
    {
      endpoint: role,
      ...periodDate,
    },
    {
      enabled: !!periodDate,
    }
  );
  const { data: statisticQuery }: any = getAll();
  return (
    <div className="flex flex-col gap-8">
      <CashbookTotalStatistics data={statisticQuery || {}} />
      <DataTable
        data={listData}
        columns={columns}
        loading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        total={total || 0}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default PageClient;
