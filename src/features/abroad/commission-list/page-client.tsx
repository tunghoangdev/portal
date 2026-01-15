import { useAuth, useCrud, useDataQuery, useTableColumns } from "~/hooks";
import { nonLifeCommissionColumns } from "~/components/table-columns";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { DataTable } from "~/features/shared/components/data-table";

export default function PageClient() {
  const { user, role } = useAuth();
  const { columns } = useTableColumns(nonLifeCommissionColumns, {
			showCommission: true,
			hiddenPercent: true,
		});
  // const { getAll } = useCrud([API_ENDPOINTS.dic.agentLevel], {
  //   endpoint: "",
  // });
  // const { data: agentLevelList }: any = getAll();
  // const levelColumns = useMemo(() => {
  //   if (!agentLevelList?.length) return [];

  //   const rewardColumns = agentLevelList.map(
  //     createColumnDef("com_level_", "Thưởng")
  //   );
  //   const sameLevelColumns = agentLevelList.map(
  //     createColumnDef("com_level_same_", "Thưởng đồng cấp")
  //   );

  //   return [...rewardColumns, ...sameLevelColumns];
  // }, [agentLevelList]);

  // const tableColumns = useMemo(
  //   () => getColumns<any>([...nonLifeCommissionColumns, ...levelColumns]),
  //   [nonLifeCommissionColumns, levelColumns]
  // );
  // CRUD API HOOK
  const basePath = API_ENDPOINTS[role].abroad.commissionList;
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
      columnPinningConfig={{
        left: ["agent_name"],
      }}
      filterFields={["provider"]}
    />
  );
}
