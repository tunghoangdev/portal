import { useCallback, useMemo } from "react"; // Thêm useRef, useCallback
import { useCrud } from "~/hooks/use-crud-v2";
import { DataTable } from "~/features/shared/components/data-table";
import { CRUD_ACTIONS } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useAuth, useDataQuery, useFilter, useModal } from "~/hooks";
import {
  generateDefaultValues,
  customerFormFields,
  customerSchema,
} from "~/schema-validations";
import { CrudActionType, ToolbarAction } from "~/types/data-table-type";
import { TItemFormFields } from "~/types/form-field";
import { toast } from "sonner";
import { Icons } from "~/components/icons";
import { getColumns } from "~/features/shared/common";
import { CustomerForm } from "~/features/shared/components/customer.form";
import { StaffCustomerForm } from "./staff-customer.form";
import { customerColumns } from "./columns";
import OrderHistory from "./order-history";

const columns = getColumns<any>(customerColumns, {
  omitKeys: ["agent_name"],
  actions: [CRUD_ACTIONS.EDIT],
});

export default function PageClient() {
  // GLOBALS STATE
  const { role, user } = useAuth();
  const { setFilter } = useFilter();
  const { openFormModal, openDetailModal } = useModal();

  const initialFormValues = useMemo(
    () => generateDefaultValues(customerFormFields),
    [customerFormFields]
  );

  // CRUD API HOOK
  const { queryParams, queryKey } = useDataQuery({
    basePath: API_ENDPOINTS[role].customers.list,
  });

  const { getInfinite, create, update } = useCrud(queryKey, queryParams);

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();
  const { mutateAsync: createMutation } = create();
  const { mutateAsync: updateMutation } = update();
  // HANDLERS

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      const isForm = (
        [CRUD_ACTIONS.ADD, CRUD_ACTIONS.EDIT] as string[]
      ).includes(action as string);
      if (isForm) {
        const typeMap: any = {
          [CRUD_ACTIONS.EDIT]: {
            itemSchema: customerSchema,
            renderFormContent: CustomerForm,
            formData: {
              ...formData,
              id_agent: user?.id || "",
              agent_phone: user?.agent_phone || "",
              birthday: formData?.birthday || "",
            },
            title: "Cập nhật khách hàng",
            onSubmit: async (values: any) => {
              if (!formData?.id && !values?.id) {
                toast.error("Không tìm thấy khách");
                return;
              }
              const payload = { ...values, id: formData?.id };
              await updateMutation(payload);
            },
          },
          [CRUD_ACTIONS.ADD]: {
            formData: {
              ...initialFormValues,
              id_agent: user?.id || "",
              agent_phone: user?.agent_phone || "",
              birthday: formData?.birthday || "",
            },
            itemSchema: customerSchema,
            title: "Tạo mới khách hàng",
            onSubmit: async (values: any) => {
              await createMutation(values);
            },
          },
        };
        openFormModal(action as ToolbarAction, {
          itemSchema: customerSchema,
          renderFormContent: ({ formMethods, control }: any) => (
            <StaffCustomerForm
              formMethods={formMethods}
              control={control}
              formData={typeMap[action].formData}
            />
          ),
          formData: typeMap[action].formData,
          title: typeMap[action].title,
          onItemSubmit: async (values: TItemFormFields) => {
            try {
              await typeMap[action].onSubmit({ ...values, _closeModal: true });
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
          // onFormSubmitSuccess: () => {
          // 	closeModal();
          // },
        });
      } else {
        setFilter("customerId", formData?.id);
        setFilter("agentId", formData?.id_agent);
        openDetailModal(formData, {
          title: `Thông tin chi tiết ${formData?.customer_name}`,
          renderContent: () => <OrderHistory />,
        });
      }
    },
    [
      openFormModal,
      openDetailModal,
      createMutation,
      updateMutation,
      user,
      setFilter,
    ]
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
        columnPinningConfig={{
          left: ["agent_name"],
          right: [],
        }}
        onAction={handleCrudAction}
        toolbar={{
          canAdd: true,
        }}
        customActions={[
          {
            type: CRUD_ACTIONS.ORDER_HISTORY,
            label: "Lịch sử mua hàng",
            icon: <Icons.cart size={16} />,
          },
        ]}
      />
    </>
  );
}
