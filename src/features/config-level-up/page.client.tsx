import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { configLevelUpSchema } from "@/schema-validations";
import { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { useCallback } from "react";
import { toast } from "sonner";
import { configLevelUpColumns } from "./columns";
import { ConfigLevelUpForm } from "./form";

const columns = getColumns<any>(configLevelUpColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT],
});
const logColumns = getColumns<any>(configLevelUpColumns, { isLog: true });
export default function PageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { openFormModal, openDetailModal, closeModal } = useModal();
  // CRUD APi
  const basePath = API_ENDPOINTS[role].company.configLevel;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, update } = useCrud(queryKey, queryParams);

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();
  const { mutateAsync: updateMutation } = update();

  // HANDLERS
  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.EDIT) {
        openFormModal(action as ToolbarAction, {
          itemSchema: configLevelUpSchema,
          renderFormContent: ConfigLevelUpForm,
          formData,
          title: "Cập nhật cấu hình",
          onItemSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error("Không tìm config");
              return;
            }
            const payload = { ...values, id: formData?.id };
            await updateMutation(payload);
          },
          onFormSubmitSuccess: () => {
            closeModal();
          },
        });
      } else {
        const typeMap: any = {
          [CRUD_ACTIONS.LOG]: {
            title: "Lịch sử cấu hình",
            tableColumns: logColumns,
            detailUrl: basePath?.log,
            tableOptions: {
              endpoint: role,
              enabled: true,
            },
          },
          [CRUD_ACTIONS.DETAIL]: {
            title: "Chi tiết cấu hình",
            tableColumns: columns,
            detailUrl: basePath?.get,
            tableOptions: {
              endpoint: role,
            },
          },
        };
        openDetailModal(formData, {
          ...typeMap?.[action],
        });
      }
    },
    [openFormModal, openDetailModal, updateMutation],
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
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        right: ["actions"],
      }}
    />
  );
}
