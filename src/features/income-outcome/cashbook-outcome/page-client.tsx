import { useCallback } from "react";
import { useAuth, useDataQuery, useModal } from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { CRUD_ACTIONS } from "~/constant";
import { getColumns } from "~/features/shared/common/get-columns";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import type { TItemFormFields } from "~/types/form-field";
import type { CrudActionType, ToolbarAction } from "~/types/data-table-type";
import { toast } from "sonner";
import { useCrud } from "~/hooks/use-crud-v2";
import {
  columnMonthYears,
  incomeOutcomeColumns,
} from "~/features/shared/common";
import { formSchema, initialFormValues } from "./form.schema";
import { FormView } from "./form-view";
const newColumns = [...incomeOutcomeColumns, ...columnMonthYears("real_date")];
const columns = getColumns<any>(newColumns, {
  actions: [
    CRUD_ACTIONS.LOG,
    CRUD_ACTIONS.EDIT,
    CRUD_ACTIONS.DELETE,
    CRUD_ACTIONS.LOCK,
  ],
});
const logColumns = getColumns<any>(incomeOutcomeColumns, { isLog: true });
const MODAL_TITLE = " phiếu chi";
export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openFormModal, closeModal, openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].incomeOutcome.cashbookOutcome;
  // CRUD HOOKS
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
  });
  const { getInfinite, create, update, deleteConfirm, updateConfirm } = useCrud(
    queryKey,
    queryParams,
    {
      enabled: isQueryEnabled,
    }
  );

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();

  // HANDLERS
  const { mutateAsync: createProductMutation } = create();
  const { mutateAsync: updateProductMutation } = update();

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.DELETE) {
        await deleteConfirm(formData, {
          title: `Xóa ${MODAL_TITLE}`,
          message: `Bạn có muốn xóa ${MODAL_TITLE} không?`,
        });
        return;
      }
      if (action === CRUD_ACTIONS.LOCK) {
        await updateConfirm(formData, {
          title: formData?.is_lock ? "Mở khoá phiếu chi" : "Khoá phiếu chi",
          message: `Bạn có muốn ${formData?.is_lock ? "mở khoá" : "khoá"} phiếu chi ${formData?.receipt_no} không?`,
          _customUrl: basePath.lock,
        });
        return;
      }
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: `Lịch sử ${MODAL_TITLE}`,
          detailUrl: basePath.logList,
          tableColumns: logColumns.map((item) => ({
            ...item,
            meta: { ...item.meta, summary: undefined },
          })),
          tableOptions: {
            enabled: true,
          },
        });
        return;
      }
      const typeMap: any = {
        [CRUD_ACTIONS.EDIT]: {
          title: `Cập nhật ${MODAL_TITLE}`,
          formData: {
            ...formData,
            amount: formData?.amount ? Math.abs(formData?.amount) : "0",
            outcome_name_parent: formData?.inout_come_name_parent,
          },
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error(`Không tìm thấy ${MODAL_TITLE}`);
              return;
            }
            await updateProductMutation(
              { ...values, id: formData?.id, amount: -values.amount },
              {
                onSuccess: (data) => {
                  if (!data.error_code) {
                    closeModal();
                  }
                },
              }
            );
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: initialFormValues,
          title: `Tạo mới ${MODAL_TITLE}`,
          onSubmit: async (values: any) => {
            await createProductMutation(
              { ...values, amount: -values.amount },
              {
                onSuccess: (data) => {
                  if (!data.error_code) {
                    closeModal();
                  }
                },
              }
            );
          },
        },
      };
      openFormModal(action as ToolbarAction, {
        title: typeMap[action].title,
        itemSchema: formSchema,
        renderFormContent: FormView,
        formData: typeMap[action].formData,
        onItemSubmit: async (values: TItemFormFields) => {
          try {
            await typeMap[action].onSubmit(values);
          } catch (error) {
            console.error("Failed to submit item:", error);
            throw error;
          }
        },
      });
    },
    [
      openFormModal,
      updateProductMutation,
      createProductMutation,
      deleteConfirm,
      openDetailModal,
    ]
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
        left: ["outcome_name"],
        right: ["actions"],
      }}
      toolbar={{
        canAdd: true,
      }}
      customActions={[
        {
          type: CRUD_ACTIONS.DELETE,
          isHidden: (formData: any) => formData?.is_lock,
          label: "Xóa",
        },
        {
          type: CRUD_ACTIONS.EDIT,
          isHidden: (formData: any) => formData?.is_lock,
          label: "Cập nhật",
        },
      ]}
    />
  );
}
