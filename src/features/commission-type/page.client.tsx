import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common/get-columns";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  commissionTypeFormFields,
  commissionTypeSchema,
  generateDefaultValues,
} from "@/schema-validations";
import { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { commissionTypeColumns } from "./commission-type-columns";
import { CommissionTypeForm } from "./commisson-type.form";

const columns = getColumns<any>(commissionTypeColumns, {
  actions: [
    CRUD_ACTIONS.LOG,
    CRUD_ACTIONS.ADD,
    CRUD_ACTIONS.EDIT,
    CRUD_ACTIONS.DELETE,
  ],
});
const logColumns = getColumns<any>(commissionTypeColumns, { isLog: true });
export default function PageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { openFormModal, openDetailModal, closeModal } = useModal();
  // Local state
  const initialFormValues = useMemo(
    () => generateDefaultValues(commissionTypeFormFields),
    [commissionTypeFormFields],
  );
  // CRUD HOOKS
  const basePath = API_ENDPOINTS[role].commissionType;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
  });

  const { getInfinite, update, create, deleteConfirm } = useCrud(
    queryKey,
    queryParams,
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
        await deleteConfirm(formData);
        return;
      }
      const isForm = (
        [
          CRUD_ACTIONS.ADD,
          CRUD_ACTIONS.EDIT,
          CRUD_ACTIONS.CONFIG_POLICY,
        ] as string[]
      ).includes(action as string);
      if (isForm) {
        const typeMap: any = {
          [CRUD_ACTIONS.ADD]: {
            formData: initialFormValues,
            title: "Tạo mới loại thưởng",
            onSubmit: async (values: any) => {
              await createProductMutation(values);
            },
          },
          [CRUD_ACTIONS.EDIT]: {
            formData,
            title: "Cập nhật loại thưởng",
            onSubmit: async (values: any) => {
              if (!formData?.id && !values?.id) {
                toast.error("Không tìm thấy loại thưởng");
                return;
              }
              const payload = {
                ...values,
                id: formData?.id,
                _customUrl: basePath.update,
                // _customUrlSegment: "edit",
              };
              await updateProductMutation(payload);
            },
          },
        };
        openFormModal(action as ToolbarAction, {
          itemSchema: commissionTypeSchema,
          size: "md",
          renderFormContent: CommissionTypeForm,
          formData: typeMap[action].formData,
          title: typeMap[action].title,
          onItemSubmit: async (values: TItemFormFields) => {
            try {
              await typeMap[action].onSubmit(values);
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
          onFormSubmitSuccess: () => {
            closeModal();
          },
        });
      } else {
        const typeMap: any = {
          [CRUD_ACTIONS.DETAIL]: {
            title: "Chi tiết loại thưởng",
            tableColumns: columns,
            detailUrl: basePath.get,
            tableOptions: {
              endpoint: role,
              enabled: true,
            },
          },
          [CRUD_ACTIONS.LOG]: {
            title: "Lịch sử loại thưởng",
            tableColumns: logColumns,
            detailUrl: basePath.log,
            tableOptions: {
              endpoint: role,
              enabled: true,
            },
          },
        };
        openDetailModal(formData, {
          ...typeMap?.[action],
        });
      }
    },
    [
      openFormModal,
      updateProductMutation,
      createProductMutation,
      deleteConfirm,
      openDetailModal,
    ],
  );
  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      onAction={handleCrudAction}
      isFetchingNextPage={isFetchingNextPage}
      total={total}
      hasNextPage={hasNextPage}
      columnPinningConfig={{
        right: ["actions"],
      }}
      fetchNextPage={fetchNextPage}
      toolbar={{
        canAdd: true,
      }}
    />
  );
}
