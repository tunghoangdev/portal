
import { useCallback } from "react"; // Thêm useRef, useCallback
import { useAuth, useCrud, useDataQuery, useModal } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { CRUD_ACTIONS, ROLES } from "@/constant";
import { getColumns } from "@/features/shared/common";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { lifeProductDetailColumns } from "@/features/shared/common";
import { CrudActionType } from "@/types/data-table-type";
import { lostEffectiveColumns } from "./columns";

const columns = getColumns<any>(lostEffectiveColumns, {
  omitKeys: ["product_name"],
  actions: [CRUD_ACTIONS.VIEW],
});

const detailColumns = getColumns<any>(lifeProductDetailColumns);
export default function LostEffectivePageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { openDetailModal } = useModal();
  // CRUD HOOK
  const basePath = API_ENDPOINTS[role].lifeInsurance.lostEffective;
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
    filter: {
      provider_code: true,
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
  // HANDLER
  const handleCrudAction = useCallback(
    async (action: CrudActionType, detail: any) => {
      openDetailModal(detail, {
        title: "Chi tiết hợp đồng",
        tableColumns: detailColumns,
        detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
        tableOptions: {
          endpoint: ROLES.AGENT,
          enabled: true,
        },
      });
    },
    [openDetailModal]
  );
  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      onAction={handleCrudAction}
      columnPinningConfig={{
        left: ["agent_name"],
        right: ["actions"],
      }}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      filterFields={["provider"]}
    />
  );
}
