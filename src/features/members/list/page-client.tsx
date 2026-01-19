import { useAuth, useDataQuery, useFilter, useModal } from "@/hooks";
import { DataTable } from "@/features/shared/components/data-table";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { useCrud } from "@/hooks/use-crud-v2";
import { getColumns } from "@/features/shared/common";
import { AgentDetailView } from "@/features/shared/components/agent-detail";
import { CRUD_ACTIONS } from "@/constant";
import { useCallback } from "react";
import { memberBaseColumns } from "../member-columns";
const columns = getColumns<any>(memberBaseColumns, {
  actions: [CRUD_ACTIONS.DETAIL],
  omitKeys: [
    "email",
    "birthday",
    "gender",
    "address",
    "full_address",
    "tax",
    "id_number",
    "issued_date",
    "issued_place",
    "bank_name",
    "bank_number",
    "is_duplicate",
    "link_front_id",
    "link_back_id",
    "is_business",
    "province_name",
  ],
});

export default function PageClient() {
  // GLOBALS STATE
  const { role } = useAuth();
  const { openDetailModal } = useModal();
  const { setFilter } = useFilter();
  // CRUD API HOOK
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: API_ENDPOINTS[role].list,
    rangeFilter: true,
    filter: {
      id_agent_status: true,
      id_agent_level: true,
    },
  });

  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });

  const {
    listData,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    total,
  }: any = getInfinite();

  const handleCrudAction = useCallback(
    async (action: any, formData?: any) => {
      if (action === CRUD_ACTIONS.DETAIL) {
        setFilter("agentId", formData?.id);
        openDetailModal(formData, {
          title: "",
          modalProps: {
            scrollBehavior: "outside",
            className: "!max-w-[90vw] !w-[90vw]",
          },
          renderContent: () => <AgentDetailView />,
        });
      }
    },
    [openDetailModal]
  );

  return (
    <DataTable
      data={listData}
      columns={columns}
      loading={isFetching}
      total={total}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      columnPinningConfig={{
        left: ["agent_name"],
        right: [],
      }}
      customActions={[
        {
          label: "Xem chi tiết",
          type: CRUD_ACTIONS.DETAIL,
        },
      ]}
      filterFields={["agentLevel", "agentStatus"]}
      onAction={handleCrudAction}
    />
  );
}
