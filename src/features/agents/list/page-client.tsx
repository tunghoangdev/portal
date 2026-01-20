import { CRUD_ACTIONS, MORE_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import {
  useAuth,
  useDataQuery,
  useFilter,
  useModal,
  useTableColumns,
} from "@/hooks";
import { useCallback, useEffect, useState } from "react"; // Thêm useRef, useCallback
// import { EXTRA_ACTIONS } from './config';
import { Icons } from "@/components/icons";
import { memberBaseColumns } from "@/features/shared/common";
import { AgentDetailView } from "@/features/shared/components/agent-detail";
import { DataTable } from "@/features/shared/components/data-table";
import RecruitmentQRCode from "@/features/shared/components/recruitment-qrcode";
import { useCrud } from "@/hooks/use-crud-v2";
import { exportSchema } from "@/schema-validations";
import { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { exportToExcel } from "@/utils/export";
import { toast } from "sonner";
import { AgentFormView } from "./agent-form";
import { agentFormSchema, agentInitialFormValues } from "./agent-form.schema";
import AgentAssignLevel from "./assign-level";
import AgentChangeManager from "./change-manager";
import { EXTRA_ACTIONS } from "./config";
import { formSchema } from "./form.schema";
import FormActions from "./forms";

const customActions = EXTRA_ACTIONS.map((action) => {
  const IconComponent = Icons[action.icon as keyof typeof Icons];
  return {
    type: action.id,
    icon: <IconComponent size={16} />,
    label: action.title,
    isHidden: action.isHidden,
  };
});

export default function PageClient() {
  // GLOBAL STATES
  const { role } = useAuth();
  const { setFilter } = useFilter();
  const { openFormModal, openDetailModal, closeModal } = useModal();
  // *** STATE ***
  const [selectedItemId, setSelectedItemId] = useState<any>(null);
  const basePath = API_ENDPOINTS[role].agents;
  //   const [filter, setFilter] = useState(DEFAULT_PARAMS);
  // const queryKey = {
  // 	filter,
  // 	periodDate,
  // 	agentStatusSelected,
  // 	agentLevelSelected,
  // };
  const { columns, logColumns } = useTableColumns(memberBaseColumns, {
    showLevel: true,
    actions: [
      CRUD_ACTIONS.LOG,
      CRUD_ACTIONS.EDIT,
      // CRUD_ACTIONS.DELETE,
      CRUD_ACTIONS.VIEW,
    ],
  });
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    filter: {
      id_agent_level: true,
      id_agent_status: true,
    },
    // periodFilter: true,
  });
  const { getInfinite, create, update, updateConfirm, deleteConfirm } = useCrud(
    queryKey,
    queryParams,
    {
      enabled: isQueryEnabled,
    },
  );

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
    refetch,
  }: any = getInfinite();

  const { getAll: getAllChild } = useCrud(
    [basePath.listChild, selectedItemId],
    {
      endpoint: role,
      id: selectedItemId,
    },
    {
      enabled: !!selectedItemId,
      staleTime: 1,
    },
  );

  const { data: allChild }: any = getAllChild();
  // HANDLERS
  const { mutateAsync: createProductMutation } = create();
  const { mutateAsync: updateProductMutation } = update();
  useEffect(() => {
    if (selectedItemId && allChild?.length) {
      openFormModal(CRUD_ACTIONS.EXPORT_EXCEL_AGENT as any, {
        exportSchema,
        title: "Xuất hệ thống",
        onExportSubmit: handleExportFile,
        isExport: true,
        onFormSubmitSuccess: () => {
          setSelectedItemId("");
          closeModal();
        },
      });
    }
  }, [selectedItemId, allChild]);

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      const actionUrl: any =
        EXTRA_ACTIONS.find((ac: any) => ac.id === action)?.url || "";
      const actionTitle =
        EXTRA_ACTIONS.find((ac: any) => ac.id === action)?.title || "Xác nhận";
      // if (action === CRUD_ACTIONS.DELETE) {
      // 	await deleteConfirm(
      // 		{ id: formData?.id },
      // 		{
      // 			title: actionTitle,
      // 			message: `Bạn có chắc chắn muốn ${actionTitle.toLowerCase()} ${
      // 				formData?.agent_name
      // 			}?`,
      // 		},
      // 	);
      // 	return;
      // }
      if (
        [
          CRUD_ACTIONS.LOCK_COMMISSION_PERIOD,
          CRUD_ACTIONS.UNLOCK_COMMISSION_PERIOD,
          CRUD_ACTIONS.LOCK_RECRUITMENT_LINK,
          CRUD_ACTIONS.UNLOCK_RECRUITMENT_LINK,
          CRUD_ACTIONS.OPEN_DUPLICATE,
          CRUD_ACTIONS.CLOSE_DUPLICATE,
          CRUD_ACTIONS.SET_BUSINESS,
          CRUD_ACTIONS.RESET_PASSWORD,
          CRUD_ACTIONS.SET_PERSONAL,
          CRUD_ACTIONS.LOCK_ACCESS,
          CRUD_ACTIONS.UNLOCK_ACCESS,
          CRUD_ACTIONS.CANCEL_APPROVE,
          CRUD_ACTIONS.LOCK_REFERRAL_LINK,
          CRUD_ACTIONS.UNLOCK_REFERRAL_LINK,
        ].includes(action as any)
      ) {
        if (!actionUrl) {
          toast.error("Không tìm thấy đường dẫn");
          return;
        }
        const payload = {
          id: formData?.id,
        };
        await updateConfirm(payload, {
          _customUrl: basePath[actionUrl],
          title: actionTitle,
          message: `Bạn có chắc chắn muốn ${actionTitle.toLowerCase()} ${
            formData?.agent_name
          }?`,
        });
        return;
      }
      if (action === CRUD_ACTIONS.LOG) {
        openDetailModal(formData, {
          title: "Lịch sử thành viên",
          detailUrl: basePath.logList,
          tableColumns: logColumns,
          // tableOptions: {
          //   enabled: true,
          // },
        });
        return;
      }
      if (action === CRUD_ACTIONS.EXPORT_EXCEL_AGENT) {
        // console.log('EXPORT_EXCEL', formData);
        setSelectedItemId(formData?.id);
        return;
      }
      if (action === CRUD_ACTIONS.RECRUITMENT_LINK) {
        openDetailModal(formData, {
          title: "Link tuyển dụng",
          size: "md",
          renderContent: ({ data }: any) => <RecruitmentQRCode data={data} />,
        });
        return;
      }
      if (action === CRUD_ACTIONS.ASSIGN_LEVEL) {
        openDetailModal(formData, {
          title: "Quản lý bổ nhiệm",
          renderContent: ({ data }: any) => (
            <AgentAssignLevel data={data} refetch={refetch} />
          ),
        });
        return;
      }
      if (action === CRUD_ACTIONS.CHANGE_MANAGER) {
        openDetailModal(formData, {
          title: "Quản lý chuyển nhánh",
          renderContent: ({ data }: any) => (
            <AgentChangeManager data={data} refetch={refetch} />
          ),
        });
        return;
      }
      if (action === CRUD_ACTIONS.VIEW) {
        setFilter("agentId", formData?.id);
        openDetailModal(formData, {
          title: `Thông tin chi tiết Thành viên: ${formData?.agent_name}`,
          renderContent: AgentDetailView,
          modalProps: {
            scrollBehavior: "outside",
            className: "!max-w-[90vw] !w-[90vw]",
          },
        });
        return;
      }

      const typeMap: any = {
        [CRUD_ACTIONS.EDIT]: {
          title: "Cập nhật thông tin thành viên",
          formData: { ...formData, id_agent: formData?.id_agent?.toString() },
          onSubmit: async (values: any) => {
            if (!formData?.id && !values?.id) {
              toast.error("Không tìm thấy thành viên");
              return;
            }
            const payload = {
              ...formData,
              ...values,
              id: formData?.id,
              id_agent_level: undefined,
              id_agent_status: undefined,
              _customUrl: basePath.update,
            };
            await updateProductMutation(payload);
          },
        },
        [CRUD_ACTIONS.ADD]: {
          formData: agentInitialFormValues,
          title: "Tạo mới thành viên",
          onSubmit: async (values: any) => {
            await createProductMutation({
              ...values,
              birthday: values.birthday || "",
              agent_avatar: values.agent_avatar || "",
              tax: values.id_number || "",
              id_agent_level: undefined,
              id_agent_status: undefined,
            });
          },
        },
        [MORE_ACTIONS.APPROVE_AGENT]: {
          title: actionTitle,
          formData: {
            ...formData,
            id_agent_status: undefined,
          },
          onSubmit: async (values: any) => {
            if (!formData?.id) {
              toast.error("Không tìm thấy thành viên");
              return;
            }
            await updateConfirm(
              { id: formData?.id, id_agent_status: values.id_agent_status },
              {
                _customUrlSegment: basePath?.[actionUrl],
                message: `Bạn có chắc chắn muốn ${actionTitle.toLowerCase()} ${
                  formData?.agent_name
                }?`,
              },
            );
          },
        },
      };
      if (!typeMap[action]) {
        return;
      }
      openFormModal(action as ToolbarAction, {
        title: typeMap[action].title,
        modalProps: {
          scrollBehavior: "outside",
        },
        itemSchema:
          action === CRUD_ACTIONS.EDIT || action === CRUD_ACTIONS.ADD
            ? agentFormSchema
            : formSchema,
        renderFormContent: ({ control, formMethods }: any) =>
          action === CRUD_ACTIONS.EDIT || action === CRUD_ACTIONS.ADD ? (
            <AgentFormView
              control={control}
              formMethods={formMethods}
              isEdit={action === CRUD_ACTIONS.EDIT}
            />
          ) : (
            // <AgentForm
            //   open={false}
            //   data={formData}
            //   refetch={refetch}
            //   toggle={undefined} // toggle={onCloseForm}
            // />
            <FormActions
              control={control}
              name="id_agent_status"
              data={formData}
            />
          ),
        size:
          action === CRUD_ACTIONS.EDIT ||
          action === CRUD_ACTIONS.ADD ||
          action === CRUD_ACTIONS.APPROVE_AGENT
            ? "5xl"
            : "md",
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
      logColumns,
      agentInitialFormValues,
    ],
  );

  const handleExportFile = useCallback(
    (values: any) => {
      const { fileName } = values || {};
      if (fileName && allChild?.length) {
        exportToExcel(allChild, columns, fileName);
      }
    },
    [columns, allChild],
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
        left: ["agent_name"],
        right: [],
      }}
      customActions={customActions}
      onAction={handleCrudAction}
      toolbar={{
        canAdd: true,
        addLabel: "Tạo mới thành viên",
      }}
      filterFields={["agentLevel", "agentStatus"]}
    />
  );
}
