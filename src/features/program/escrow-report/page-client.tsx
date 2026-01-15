import { useCallback } from "react";
import { useAuth, useDataQuery, useModal } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { CRUD_ACTIONS } from "~/constant";
import { getColumns } from "~/features/shared/common/get-columns";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks/use-crud-v2";
import { listColumns } from "./columns";
import { detailColumns } from "./detail-columns";
import { CrudActionType } from "~/types/data-table-type";
import { TItemFormFields } from "~/types/form-field";
const columns = getColumns<any>(listColumns, {
  actions: [CRUD_ACTIONS.VIEW],
});
const columnDetail = getColumns<any>(detailColumns);

export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].company.escrowReport;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
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
  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      openDetailModal(formData, {
        title: "Chi tiết báo cáo",
        tableColumns: columnDetail,
        detailUrl: API_ENDPOINTS[role].company.escrowReport.detail,
        tableOptions: {
          endpoint: role,
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
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
    />
  );
}
