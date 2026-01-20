import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useCrud, useDataQuery, useModal } from "@/hooks";
import type { CrudActionType } from "@/types/data-table-type";
import { useCallback } from "react";
import { noneLifeProfixBaseColumns } from "../none-life-profix-columns";
import { noneLifeProfixDetailColumns } from "../none-life-profix-detail-columns";

const columns = getColumns<any>(noneLifeProfixBaseColumns, {
  actions: [CRUD_ACTIONS.VIEW],
});

const detailColumns = getColumns<any>(noneLifeProfixDetailColumns);
export default function ListProcessingPageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].nonLifeInsurance.profix;
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
  // HANDLER
  const handleCrudAction = useCallback(
    async (action: CrudActionType, detail: any) => {
      const typeMap: any = {
        [CRUD_ACTIONS.VIEW]: {
          title: "Chi tiết hợp đồng",
          tableColumns: detailColumns,
          detailUrl: basePath.detail,
          tableOptions: {
            endpoint: role,
            enabled: isQueryEnabled,
            from_date: queryParams.from_date,
            to_date: queryParams.to_date,
          },
        },
      };
      openDetailModal(
        { id: detail?.id_none_life_product },
        {
          ...typeMap?.[action],
        },
      );
    },
    [openDetailModal, role, queryParams],
  );
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
        left: ["none_life_product_name"],
        right: [],
      }}
      filterFields={["provider"]}
      onAction={handleCrudAction}
      customActions={[
        {
          label: "Xem chi tiết",
          type: CRUD_ACTIONS.VIEW,
        },
      ]}
    />
  );
}
