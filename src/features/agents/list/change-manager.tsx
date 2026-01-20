import { Icons } from "@/components/icons";
import { Button } from "@/components/ui";
import { CRUD_ACTIONS, DEFAULT_PARAMS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { PhoneSearchField } from "@/features/shared/components/form-fields";
import { useAuth, useSwal } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { CrudActionType } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { testValidPhone } from "@/utils/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { changeManagerColumns } from "./change-manager-columns";

const columns = getColumns<any>(changeManagerColumns, {
  actions: [
    CRUD_ACTIONS.APPROVE_CHANGE_MANAGER,
    CRUD_ACTIONS.DELETE_ASSIGN_LEVEL,
  ],
});

const Schema = z.object({
  new_agent_phone: z
    .string()
    .min(1, "SĐT thành viên không được để trống")
    .refine((value) => testValidPhone(value), {
      message: "Số điện thoại không hợp lệ",
    }),
});

const AgentChangeManager = ({ data: row, refetch: refetchParent }: any) => {
  const { confirm } = useSwal();
  const { role } = useAuth();
  const [filter] = useState(DEFAULT_PARAMS);
  const basePath = API_ENDPOINTS[role].agents.changeManager;
  // *** QUERY ***
  const { getAll, create, updateConfirm, deleteConfirm } = useCrud(
    [basePath.change, filter, row?.id],
    {
      endpoint: role,
      ...filter,
      id: row?.id,
    },
    {
      enabled: Boolean(row?.id),
    },
  );

  const { data: listData, refetch }: any = getAll();
  const { mutateAsync: createProductMutation } = create();

  // *** Hook Form
  const { control, handleSubmit, reset, watch, setValue, formState, setError } =
    useForm({
      mode: "onChange",
      resolver: zodResolver(Schema),
      defaultValues: {
        new_agent_phone: "",
      },
    });

  // *** WATCH ***
  const watchAgentPhone = watch("new_agent_phone");
  const basePathPhone = API_ENDPOINTS.agent.search.byPhone;
  // const { data: agentSearchDetail } = useSearchAgentByPhone(watchAgentPhone);
  const { getAll: searchAgent } = useCrud(
    [basePathPhone, watchAgentPhone],
    {
      // listUrl: API_ENDPOINTS.agent.search.byPhone,
      agent_phone: watchAgentPhone,
    },
    {
      enabled: !!testValidPhone(watchAgentPhone),
    },
  );
  const { data: agentSearchDetail }: any = searchAgent();

  // *** HANDLERS ***
  const handleCreate = async () => {
    const res = await confirm({
      title: `${row?.parent_name} -> ${agentSearchDetail?.agent_name}`,
      text: "Bạn có chắc chắn muốn thay đổi quản lý?",
    });
    if (res.isConfirmed) {
      await createProductMutation({
        id: row?.id,
        id_agent_new: agentSearchDetail?.id,
        _customUrl: basePath.create,
        _customMessage: "Thay đổi quản lý thành công",
        _closeModal: false,
      });
      reset({ new_agent_phone: "" });
      // refetchParent();
      refetch();
    }
  };

  const handleCrudAction = useCallback(
    async (action: CrudActionType, formData?: TItemFormFields) => {
      if (action === CRUD_ACTIONS.DELETE_CHANGE_MANAGER) {
        await deleteConfirm(formData, {
          title: "Xóa",
          message: "Bạn có chắc chắn muốn xóa yêu cầu này?",
          _customUrl: basePath.delete,
        });
        refetch();
        // refetchParent();
        return;
      }
      if (
        action === CRUD_ACTIONS.APPROVE_CHANGE_MANAGER ||
        action === CRUD_ACTIONS.CANCEL_CHANGE_MANAGER
      ) {
        await updateConfirm(formData, {
          title:
            action === CRUD_ACTIONS.APPROVE_CHANGE_MANAGER
              ? "Duyệt yêu cầu chuyển quản lý"
              : "Hủy duyệt yêu cầu chuyển quản lý",
          message: `Bạn có chắc chắn muốn ${
            action === CRUD_ACTIONS.APPROVE_CHANGE_MANAGER
              ? "duyệt"
              : "hủy duyệt"
          } bổ nhiệm này?`,
          _customUrl:
            action === CRUD_ACTIONS.APPROVE_CHANGE_MANAGER
              ? basePath.approve
              : basePath.cancel,
          _closeModal: false,
          _customMessage: `${
            action === CRUD_ACTIONS.APPROVE_CHANGE_MANAGER
              ? "Duyệt"
              : "Hủy duyệt"
          } bổ nhiệm thành công!`,
          onSuccess: () => {
            refetch();
          },
        });
        // refetchParent();
        return;
      }
    },
    [deleteConfirm, updateConfirm, refetchParent],
  );
  return (
    <>
      <form onSubmit={handleSubmit(handleCreate)} className="mb-4">
        <div className="sm:max-w-[400px]">
          <PhoneSearchField
            name="new_agent_phone"
            label="Số điện thoại quản lý mới"
            placeholder="Nhập số điện thoại quản lý mới..."
            control={control}
            formMethods={{
              setValue,
              formState,
              setError,
            }}
            // className="mb-0 w-full"
            classNames={{
              inputWrapper: "!pr-0",
            }}
            endContent={
              <Button
                isDisabled={!watchAgentPhone || !agentSearchDetail}
                onPress={handleCreate}
                className="min-w-[90px] h-9 -mr-px px-1.5 text-xs"
                color="secondary"
                radius="none"
                startContent={<Icons.add size={14} />}
              >
                Tạo mới
              </Button>
            }
          />
        </div>
      </form>
      <DataTable
        data={listData || []}
        columns={columns}
        // loading={isFetching}
        searchValue={filter.info}
        columnPinningConfig={{
          left: ["agent_name"],
          right: [],
        }}
        onAction={handleCrudAction}
        customActions={[
          {
            type: CRUD_ACTIONS.APPROVE_CHANGE_MANAGER,
            label: "Duyệt yêu cầu",
            icon: <Icons.circleCheck size={14} />,
            isHidden: (row: any) => {
              return row?.is_approved;
            },
          },
          {
            type: CRUD_ACTIONS.CANCEL_CHANGE_MANAGER,
            label: "Hủy duyệt yêu cầu",
            icon: <Icons.close size={14} />,
            isHidden: (row: any) => {
              return !row?.is_approved;
            },
          },
          {
            type: CRUD_ACTIONS.DELETE_CHANGE_MANAGER,
            label: "Xóa",
            icon: <Icons.trash size={14} />,
            color: "text-danger",
            isHidden: (row: any) => {
              return row?.is_approved;
            },
          },
        ]}
        toolbar={{
          hideExportExcel: true,
          hideSearch: true,
          hiddenFilters: true,
        }}
      />
    </>
  );
};

export default AgentChangeManager;
