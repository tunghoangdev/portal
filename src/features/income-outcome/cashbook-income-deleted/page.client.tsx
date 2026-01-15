import { useCallback, useState } from "react";
import { useCrud } from "~/hooks/use-crud-v2";
import { CRUD_ACTIONS, DEFAULT_PARAMS } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  actionInfoColumns,
  getColumns,
  incomeOutcomeColumns,
} from "~/features/shared/common";
import { useAuth, useCommon, useDataQuery, useModal } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { CrudActionType } from "~/types/data-table-type";
import { TItemFormFields } from "~/types/form-field";
const MODAL_TITLE = " phiếu thu đã xóa";
const columns = getColumns<any>(incomeOutcomeColumns, {
  actions: [CRUD_ACTIONS.LOG],
});
const logColumns = getColumns<any>(incomeOutcomeColumns, {
  isLog: true,
});
export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { closeModal, openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].incomeOutcome.cashbookIncomeDeleted;
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
  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: `Lịch sử ${MODAL_TITLE}`,
          detailUrl: basePath.logList,
          tableColumns: logColumns,
          tableOptions: {
            enabled: true,
          },
        });
        return;
      }
    },
    [closeModal, openDetailModal]
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
      onAction={handleCrudAction}
      columnPinningConfig={{
        left: ["income_name"],
        right: ["actions"],
      }}
    />
  );
}
