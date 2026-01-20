"use client";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  generateDefaultValues,
  lifeProviderSchema,
  providerFormFields,
} from "@/schema-validations";
import { useFormModalStore } from "@/stores";
import type { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import type { TItemFormFields } from "@/types/form-field";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { lifeProviderColumns } from "./columns";
import { LifeProviderForm } from "./form";
const columns = getColumns<any>(lifeProviderColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});
const logColumns = getColumns<any>(lifeProviderColumns, {
  isLog: true,
});
export default function PageClient() {
  const { role } = useAuth();
  const { openFormModal, openDetailModal } = useModal();
  const initialFormValues = useMemo(
    () => generateDefaultValues(providerFormFields),
    [providerFormFields],
  );
  const basePath = API_ENDPOINTS[role].lifeInsurance.providers;
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

  const { mutateAsync: createProductMutation } = create();
  const { mutateAsync: updateProductMutation } = update();

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      const payload =
        action === CRUD_ACTIONS.ADD ? initialFormValues : formData;
      if (action === CRUD_ACTIONS.DELETE) {
        await deleteConfirm(formData);
        return;
      }
      const isForm = (
        [CRUD_ACTIONS.ADD, CRUD_ACTIONS.EDIT] as string[]
      ).includes(action as string);
      if (isForm) {
        const titleMap: any = {
          [CRUD_ACTIONS.EDIT]: `Chỉnh sửa nhà cung cấp ${
            payload?.provider_name || ""
          }`,
          [CRUD_ACTIONS.ADD]: "Thêm nhà cung cấp",
        };
        openFormModal(action as ToolbarAction, {
          itemSchema: lifeProviderSchema,
          renderFormContent: LifeProviderForm,
          formData: payload,
          title: titleMap[action],
          onItemSubmit: async (
            values: TItemFormFields,
            currentAction: string,
          ) => {
            try {
              if (currentAction === CRUD_ACTIONS.ADD) {
                await createProductMutation(
                  values as Omit<TItemFormFields, "id">,
                );
              } else if (currentAction === CRUD_ACTIONS.EDIT) {
                if (!values.id && !payload?.id) {
                  toast.error("Không tìm thấy nhà cung cấp");
                  return;
                }
                const updateData = {
                  ...payload,
                  ...values,
                };
                await updateProductMutation(updateData);
              }
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
          onFormSubmitSuccess: () => {
            useFormModalStore.getState().closeModal();
          },
        });
      } else {
        openDetailModal(formData, {
          title: `Lịch sử nhà cung cấp ${formData?.provider_name || ""}`,
          tableColumns: logColumns,
          detailUrl: basePath.logList,
        });
      }
    },
    [
      openFormModal,
      openDetailModal,
      createProductMutation,
      updateProductMutation,
    ],
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
        columnPinningConfig={{
          left: ["provider_name"],
        }}
        toolbar={{
          canAdd: true,
        }}
      />
    </>
  );
}
