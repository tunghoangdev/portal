import { useCallback } from "react";
import { Icons } from "~/components/icons";
import { CRUD_ACTIONS, ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  getColumns,
  lifeProductDetailColumns,
  processingColumns,
} from "~/features/shared/common";
import { DataTable } from "~/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal, useTableColumns } from "~/hooks";
import { useCrud } from "~/hooks/use-crud-v2";
import { lifeContractAckSchema } from "~/schema-validations";
import type { CrudActionType, ToolbarAction } from "~/types/data-table-type";
import { lifeContractCommissionColumns } from "./commission-columns";
import { LifeContractAckForm } from "./life-contract-ack.form";
const detailColumns = getColumns<any>(lifeProductDetailColumns);
const commissionColumns = getColumns<any>(lifeContractCommissionColumns);
export default function PageClient() {
  // GLOBAL STATE
  const { role } = useAuth();
  const { openDetailModal, openFormModal } = useModal();
  const { columns, logColumns } = useTableColumns(processingColumns, {
    showMonthYear: true,
    showLevel: true,
    actions: [
      CRUD_ACTIONS.LOG,
      CRUD_ACTIONS.VIEW,
      CRUD_ACTIONS.UPDATE_ACK,
      CRUD_ACTIONS.COMMISON_LIST,
    ],
  });
  // CRUD HOOK
  const basePath = API_ENDPOINTS[role].lifeInsurance.done;
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    periodFilter: true,
    filter: {
      provider_code: true,
      contract_type: true,
    },
  });
  const { getInfinite, update } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });
  const { updateConfirm } = useCrud([basePath.return], {
    endpoint: role,
  });

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();
  const { mutateAsync: updateACK } = update();
  //   const tableCol = useMemo(() => {
  //     const baseColumns = [
  //       ...columns,
  //       ...getColumns<any>(levelColumns?.flat()),
  //       ...getColumns<any>([
  //         {
  //           title: "Thao tác",
  //           key: "actions",
  //           align: "center",
  //           actions: [
  //             CRUD_ACTIONS.LOG,
  //             CRUD_ACTIONS.VIEW,
  //             CRUD_ACTIONS.UPDATE_ACK,
  //             // CRUD_ACTIONS.COMMISON_LIST,
  //           ],
  //         },
  //       ]),
  //     ];
  //     return {
  //       columns: baseColumns,
  //       logColumns: [
  //         ...getColumns<any>(actionInfoColumns),
  //         ...baseColumns.map((item) => ({
  //           ...item,
  //           meta: { ...item.meta, summary: undefined },
  //         })),
  //       ],
  //     };
  //   }, [columns, levelColumns]);

  // HANDLER
  const handleCrudAction = useCallback(
    async (action: CrudActionType, detail: any) => {
      if (action === CRUD_ACTIONS.REVOCATION_CONTRACT) {
        await updateConfirm(
          { id: detail?.id, _queryKey: queryKey },
          {
            title: "Thu hồi hợp đồng hợp đồng",
            message: `Bạn có chắc chắn muốn thu hồi hợp đồng ${detail?.number_contract}?`,
            _customUrl: API_ENDPOINTS[role]?.lifeInsurance?.done.return,
          },
        );
        return;
      }
      if (action === CRUD_ACTIONS.UPDATE_ACK) {
        openFormModal(action as ToolbarAction, {
          itemSchema: lifeContractAckSchema,
          renderFormContent: LifeContractAckForm,
          formData: {
            id: detail?.id,
            ack_date: detail?.ack_date,
          },
          title: "Cập nhật ngày ACK",
          size: "md",
          onItemSubmit: async (values: any) => {
            try {
              await updateACK({
                id: detail?.id,
                ...values,
                // _queryKey: listQueryKey,
                _customUrl: basePath.updateAck,
              });
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
          // onFormSubmitSuccess: () => {
          // 	refetch();
          // },
        });
        return;
      }
      const newLogColumns = logColumns.filter(
        (item: any) => !item?.prop?.startsWith("level_"),
      );
      const typeMap: any = {
        [CRUD_ACTIONS.VIEW]: {
          title: "Chi tiết hợp đồng",
          tableColumns: detailColumns,
          detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
          tableOptions: {
            endpoint: ROLES.AGENT,
            enabled: true,
          },
        },
        [CRUD_ACTIONS.LOG]: {
          title: "Lịch sử hợp đồng",
          tableColumns: newLogColumns,
          detailUrl: API_ENDPOINTS[role]?.lifeInsurance?.common?.logList,
          tableOptions: {
            endpoint: role,
            enabled: true,
          },
        },
        [CRUD_ACTIONS.COMMISON_LIST]: {
          title: "Danh sách phân bổ thưởng",
          tableColumns: commissionColumns,
          detailUrl: API_ENDPOINTS[role]?.lifeInsurance?.done?.commission,
          tableOptions: {
            endpoint: role,
            enabled: true,
          },
        },
      };
      openDetailModal(detail, {
        ...typeMap?.[action],
      });
    },
    [openDetailModal],
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
      customActions={[
        {
          type: CRUD_ACTIONS.UPDATE_ACK,
          label: "Cập nhật ACK",
          icon: <Icons.edit size={16} strokeWidth={1.5} />,
          // color: 'text-secondary',
          // bg: 'secondary',
        },
        {
          type: CRUD_ACTIONS.REVOCATION_CONTRACT,
          label: "Thu hồi tính thưởng",
          icon: <Icons.rotateCcw size={16} strokeWidth={1.5} />,
          color: "text-danger",
          bg: "danger",
        },
      ]}
      onAction={handleCrudAction}
      filterFields={["provider", "contractType"]}
    />
  );
}
