import { useCallback, useMemo } from "react";
import {
  useAuth,
  useCommon,
  useCommonData,
  useDataQuery,
  useModal,
} from "~/hooks";
import { DataTable } from "~/features/shared/components/data-table";
import { CRUD_ACTIONS, ROLES } from "~/constant";
import { getColumns } from "~/features/shared/common";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import type { TItemFormFields } from "~/types/form-field";
import type { CrudActionType, ToolbarAction } from "~/types/data-table-type";
import { toast } from "sonner";
import { useCrud } from "~/hooks/use-crud-v2";
import { listColumns } from "./columns";
import { formSchema, initialFormValues } from "./form.schema";
import { FormView } from "./form-view";
import { parseString } from "~/utils/util";

const columns = getColumns<any>(listColumns, {
  actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});
const logColumns = getColumns<any>(listColumns, { isLog: true });

const SUFIX_LABEL = " cuộc họp";
export default function PageClient() {
  // Global state
  const { role, user } = useAuth();
  const { agentLevels } = useCommon();
  const { openFormModal, openDetailModal } = useModal();

  const basePath = API_ENDPOINTS[role].company.meeting;
  // CRUD HOOKS
  const { queryParams, queryKey } = useDataQuery({
    basePath: basePath.list,
    filter: {
      id_agent_level: role === ROLES.AGENT && user?.id_agent_level,
    },
  });
  useCommonData("agentLevels", API_ENDPOINTS.dic.agentLevel, {
    enabled: !agentLevels?.length,
  });
  const { getInfinite, create, update, deleteConfirm } = useCrud(
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
        await deleteConfirm(formData);
        return;
      }
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: `Lịch sử ${SUFIX_LABEL}`,
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
          title: `Cập nhật ${SUFIX_LABEL}`,
          formData: {
            ...formData,
            permission_doc:
              typeof formData?.permission_doc === "string"
                ? parseString(formData?.permission_doc, ";", ",")
                : formData?.permission_doc?.join(","),
          },
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error(`Không tìm thấy ${SUFIX_LABEL}`);
              return;
            }
            const payload = {
              ...values,
              id: formData?.id,
              permission_doc: parseString(values?.permission_doc, ",", ";"),
            };
            await updateProductMutation(payload);
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: initialFormValues,
          title: `Tạo mới ${SUFIX_LABEL}`,
          onSubmit: async (values: any) => {
            const payload = {
              ...values,
              id: formData?.id,
              permission_doc: parseString(values?.permission_doc, ",", ";"),
            };
            await createProductMutation(payload);
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
            const { customer_phone, ...payload } = values;
            await typeMap[action].onSubmit({
              ...payload,
              id_agent: +payload.id_agent,
            });
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

  const newListData = useMemo(() => {
    return listData?.map((item: any) => {
      if (
        item.permission_doc &&
        typeof item.permission_doc === "string" &&
        agentLevels?.length
      ) {
        item.permission_doc = item.permission_doc?.split(";");
        item.permissions = agentLevels?.filter((level: any) =>
          item.permission_doc?.includes(level.id.toString())
        );
      }
      return item;
    });
  }, [agentLevels, listData]);

  return (
    <DataTable
      data={newListData}
      columns={columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      onAction={handleCrudAction}
      columnPinningConfig={{
        left: ["title_name"],
        right: ["actions"],
      }}
      toolbar={{
        canAdd: true,
      }}
    />
  );
}
