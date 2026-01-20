import { Icons } from "@/components/icons";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common/get-columns";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { CrudActionType } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { useCallback } from "react"; // Thêm useRef, useCallback
import { commissionPeriodColumns } from "./columns";

const columns = getColumns<any>(commissionPeriodColumns, {
  actions: [CRUD_ACTIONS.LOG],
});

const logColumns = getColumns<any>(commissionPeriodColumns, { isLog: true });
export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openDetailModal } = useModal();
  // Local state
  const basePath = API_ENDPOINTS[role].commissionPeriod.commissionPeriodList;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, updateConfirm } = useCrud(queryKey, queryParams);

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();

  // HANDLERS
  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: `Lịch sử kỳ thưởng ${formData?.commission_period_name || ""}`,
          tableColumns: logColumns,
          detailUrl: basePath.log,
        });

        return;
      }
      await updateConfirm(formData, {
        title: "Xác nhận",
        message: formData?.is_lock
          ? "Bạn chắc chắn mở khóa?"
          : "Bạn chắc chắn khóa?",
        _customUrl: basePath.lock,
      });
    },
    [openDetailModal, updateConfirm],
  );
  return (
    <>
      <DataTable
        data={listData}
        columns={columns}
        loading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        total={total || 0}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        onAction={handleCrudAction}
        customActions={[
          {
            label: "Khóa",
            type: CRUD_ACTIONS.LOCK_COMMISSION_PERIOD,
            isHidden: (row: any) => row?.is_lock,
            color: "text-danger",
            icon: <Icons.lock className="w-4 h-4" />,
          },
          {
            label: "Mở khóa",
            type: CRUD_ACTIONS.LOCK_COMMISSION_PERIOD,
            isHidden: (row: any) => !row?.is_lock,
            color: "success",
            icon: <Icons.lock className="w-4 h-4" />,
          },
        ]}
      />
    </>
  );
}
