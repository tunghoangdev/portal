import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common/get-columns";
import { DataTable } from "@/features/shared/components/data-table";
import { FormField } from "@/features/shared/components/form-fields";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  documentTypeInternalFormFields,
  documentTypeInternalSchema,
  initialTypeInternalFormValues,
} from "@/schema-validations/document-type-internal.schema";
import { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import { FormFieldConfig, TItemFormFields } from "@/types/form-field";
import { useCallback } from "react";
import { toast } from "sonner";
import { docTypeInternalColumns } from "../shared/common";

const columns = getColumns<any>(docTypeInternalColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});
const logColumns = getColumns<any>(docTypeInternalColumns, { isLog: true });
export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openFormModal, openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].documents.typesInternal;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, create, update, deleteConfirm } = useCrud(
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
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: "Lịch sử loại tài liệu nội bộ",
          detailUrl: basePath.logList,
          tableColumns: logColumns,
          tableOptions: {
            enabled: true,
          },
        });
        return;
      }
      const typeMap: any = {
        [CRUD_ACTIONS.EDIT]: {
          formData,
          title: "Cập nhật loại tài liệu nội bộ",
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error("Không tìm thấ loại tài liệu");
              return;
            }
            const payload = { ...values, id: formData?.id };
            await updateProductMutation(payload);
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: initialTypeInternalFormValues,
          title: "Tạo mới loại tài liệu nội bộ",
          onSubmit: async (values: any) => {
            await createProductMutation(values);
          },
        },
      };
      openFormModal(action as ToolbarAction, {
        itemSchema: documentTypeInternalSchema,
        size: "md",
        renderFormContent: ({ control }: any) =>
          DocumentTypeForm(documentTypeInternalFormFields[0], control),
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
      });
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
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        right: ["actions"],
      }}
      toolbar={{
        canAdd: true,
      }}
      onAction={handleCrudAction}
    />
  );
}

function DocumentTypeForm(item: FormFieldConfig, control: any) {
  return <FormField key={item.name} control={control} {...(item as any)} />;
}
