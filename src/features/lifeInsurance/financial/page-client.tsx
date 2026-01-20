import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  financialFormFields,
  generateDefaultValues,
  generateZodSchema,
  lifeFinancialSchema,
} from "@/schema-validations";
import type { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import type { TItemFormFields } from "@/types/form-field";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { lifeFinancialColumns } from "./columns";
import { LifeFinancialForm } from "./form";
const columns = getColumns<any>(lifeFinancialColumns, {
  actions: [
    CRUD_ACTIONS.LOG,
    CRUD_ACTIONS.EDIT,
    CRUD_ACTIONS.CHANGE_STATUS,
    CRUD_ACTIONS.DELETE,
  ],
});
const logColumns = getColumns<any>(lifeFinancialColumns, { isLog: true });
export default function PageClient() {
  // STATE
  const { role } = useAuth();
  const { openFormModal, openDetailModal } = useModal();
  const initialFormValues = useMemo(
    () => generateDefaultValues(financialFormFields),
    [financialFormFields],
  );
  const editFiedls = financialFormFields.filter(
    (field) => field.name !== "agent_phone",
  );
  const editShcema = generateZodSchema(editFiedls);
  const basePath = API_ENDPOINTS[role].lifeInsurance.financial;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, create, update, deleteConfirm, updateConfirm } = useCrud(
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
  }: // refetch,
  any = getInfinite();

  // const { updateConfirm } = useCrud([basePath.active], {
  // 	endpoint: role,
  // });

  const { mutateAsync: createFinancialMutation } = create();
  const { mutateAsync: updateFinancialMutation } = update();
  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.CHANGE_STATUS) {
        await updateConfirm(
          { id: formData?.id },
          {
            title: `${
              formData?.is_active ? "Ngưng" : "Mở"
            } hoạt động tư vấn tài chính`,
            message: `Bạn có chắc chắn muốn Ngưng hoạt động ${
              formData?.finan_name || ""
            }?`,
            _customUrl: basePath.active,
          },
        );
        // refetch();
        return;
      }
      const payload =
        action === CRUD_ACTIONS.ADD ? initialFormValues : formData;
      if (action === CRUD_ACTIONS.DELETE) {
        deleteConfirm(formData);
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
        const titleMap: any = {
          [CRUD_ACTIONS.EDIT]: `Chỉnh sửa tư vấn tài chính ${
            payload?.product_name || ""
          }`,
          [CRUD_ACTIONS.ADD]: "Thêm tư vấn tài chính",
        };
        openFormModal(action as ToolbarAction, {
          itemSchema:
            action === CRUD_ACTIONS.EDIT ? editShcema : lifeFinancialSchema,
          renderFormContent: ({ action, control, formMethods }: any) => (
            <LifeFinancialForm
              action={action}
              control={control}
              removeFields={action === CRUD_ACTIONS.EDIT ? ["agent_phone"] : []}
              formMethods={formMethods}
            />
          ),
          formData: payload,
          title: titleMap[action],
          onItemSubmit: async (
            values: TItemFormFields,
            currentAction: string,
          ) => {
            try {
              if (currentAction === CRUD_ACTIONS.ADD) {
                await createFinancialMutation(
                  values as Omit<TItemFormFields, "id">,
                );
              } else if (currentAction === CRUD_ACTIONS.EDIT) {
                if (!values.id && !payload?.id) {
                  toast.error("Không tìm thấy sản phẩm");
                  return;
                }
                const updateData = {
                  ...payload,
                  ...values,
                };

                await updateFinancialMutation(updateData);
              }
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
        });
      } else {
        openDetailModal(formData, {
          title: `Lịch sử tư vấn tài chính ${formData?.product_name || ""}`,
          tableColumns: logColumns,
          detailUrl: basePath.logList,
        });
      }
    },
    [openFormModal, openDetailModal, updateFinancialMutation],
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
      toolbar={{
        canAdd: true,
      }}
    />
  );
}
