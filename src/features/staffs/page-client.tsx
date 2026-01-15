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
import { actionInfoColumns } from "~/features/shared/common";
import { listColumns } from "./columns";
import { formSchema, initialFormValues } from "./form.schema";
import { FormView } from "./form-view";
import { Icons } from "~/components/icons";

const columns = getColumns<any>(listColumns, {
  actions: [
    CRUD_ACTIONS.LOG,
    CRUD_ACTIONS.EDIT,
    CRUD_ACTIONS.DELETE,
    CRUD_ACTIONS.LOCK,
  ],
});
const logColumns = getColumns<any>([...actionInfoColumns, ...listColumns]);

export default function PageClient() {
  // Global state
  const { role } = useAuth();
  const { openFormModal, closeModal, openDetailModal } = useModal();
  const basePath = API_ENDPOINTS[role].staffs;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
  });
  const { getInfinite, create, update, deleteConfirm, updateConfirm } = useCrud(
    queryKey,
    queryParams
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
          title: "Xóa nhân viên",
          message: `Bạn có muốn xóa nhân viên ${formData?.staff_name} không?`,
        });
        return;
      }
      if (action === CRUD_ACTIONS.LOCK) {
        await updateConfirm(formData, {
          title: "Khoá nhân viên",
          message: `Bạn có muốn khoá nhân viên ${formData?.staff_name} không?`,
          _customUrl: basePath.lockAccess,
        });
        return;
      }
      if (action === CRUD_ACTIONS.RESET_PASSWORD) {
        await updateConfirm(formData, {
          title: "Đặt lại mật khẩu",
          message: `Bạn có muốn đặt lại mật khẩu cho ${formData?.staff_name} không?`,
          _customUrl: basePath.resetPassword,
        });
        return;
      }

      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: "Lịch sử nhân viên",
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
          title: "Cập nhật nhân viên",
          formData,
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error("Không tìm thấy nhân viên");
              return;
            }
            const payload = {
              ...formData,
              ...values,
              birthday: values.birthday || "",
              id_bank: values.id_bank || "",
              issued_date: values.issued_date || "",
              id: formData?.id,
              tax_number: values.id_number || "",
            };
            await updateProductMutation(payload);
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: initialFormValues,
          title: "Tạo mới nhân viên",
          onSubmit: async (values: any) => {
            const payload = {
              ...initialFormValues,
              ...values,
              tax_number: values.id_number || "",
            };
            await createProductMutation(payload, {
              onSuccess: (data) => {
                if (!data.error_code) {
                  closeModal();
                }
              },
            });
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
        onFormSubmitSuccess: () => {
          // closeModal();
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
        left: ["staff_name"],
        right: ["actions"],
      }}
      toolbar={{
        canAdd: true,
      }}
      customActions={[
        {
          type: CRUD_ACTIONS.RESET_PASSWORD,
          label: "Đặt lại mật khẩu",
          icon: <Icons.refresh size={16} strokeWidth={1.5} />,
        },
        {
          type: CRUD_ACTIONS.DELETE,
          label: "Xóa",
          isHidden: (row: any) => row?.is_root,
        },
        {
          type: CRUD_ACTIONS.EDIT,
          label: "Cập nhật",
          isHidden: (row: any) => row?.is_root,
        },
        {
          type: CRUD_ACTIONS.LOCK,
          label: "Khoá",
          isHidden: (row: any) => row?.is_root,
        },
      ]}
    />
  );
}
