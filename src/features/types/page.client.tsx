"use client";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common/get-columns";
import { DataTable } from "@/features/shared/components/data-table";
import { FormField } from "@/features/shared/components/form-fields";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  documentTypeFormFields,
  documentTypeSchema,
  generateDefaultValues,
} from "@/schema-validations";
import { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import { FormFieldConfig, TItemFormFields } from "@/types/form-field";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { docTypeColumns } from "../shared/common";

const columns = getColumns<any>(docTypeColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});
const logColumns = getColumns<any>(docTypeColumns, { isLog: true });
export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openFormModal, openDetailModal } = useModal();
  const initialFormValues = useMemo(
    () => generateDefaultValues(documentTypeFormFields),
    [documentTypeFormFields],
  );
  const basePath = API_ENDPOINTS[role].documents.types;
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
          title: "Lịch sử loại tài liệu",
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
          itemSchema: documentTypeSchema,
          renderFormContent: DocumentTypeForm,
          formData,
          title: "Cập nhật loại tài liệu",
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
          itemSchema: documentTypeSchema,
          renderFormContent: DocumentTypeForm,
          formData: initialFormValues,
          title: "Tạo mới loại tài liệu",
          onSubmit: async (values: any) => {
            await createProductMutation(values);
          },
        },
      };
      openFormModal(action as ToolbarAction, {
        itemSchema: typeMap[action].itemSchema,
        size: "md",
        renderFormContent: ({ control }: any) =>
          DocumentTypeForm(documentTypeFormFields[0], control),
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
