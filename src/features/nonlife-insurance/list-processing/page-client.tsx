import { CRUD_ACTIONS, ROLES } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useAuth, useDataQuery, useModal, useTableColumns } from "@/hooks";
import { useCrud } from "@/hooks/use-crud-v2";
import { CrudActionType } from "@/types/data-table-type";
import { TItemFormFields } from "@/types/form-field";
import { useCallback } from "react"; // Thêm useRef, useCallback
import { noneLifeBaseColumns } from "../none-life-base-columns";
import { noneLifeProductDetailColumns } from "../none-life-product-detail-columns";
const detailColumns = getColumns<any>(noneLifeProductDetailColumns);
export default function ListProcessingPageClient() {
  // Store
  const { role } = useAuth();
  const { columns } = useTableColumns(noneLifeBaseColumns, {
    showMonthYear: true,
    omitKeys: ["period_name", "link_cer"],
    actions: [CRUD_ACTIONS.VIEW],
  });
  const { openFormModal, openDetailModal } = useModal();

  const basePath = API_ENDPOINTS[role].nonLifeInsurance.processing;
  // API CRUD
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.processingList,
    rangeFilter: true,
    filter: {
      provider_code: true,
    },
  });
  const { getInfinite, updateConfirm, create } = useCrud(
    queryKey,
    queryParams,
    {
      enabled: isQueryEnabled,
    },
  );

  const {
    isFetchingNextPage,
    isFetching,
    listData,
    total,
    hasNextPage,
    fetchNextPage,
  }: any = getInfinite();
  // HANDLERS
  const { mutateAsync: createProductMutation } = create();
  const handleCrudAction = useCallback(
    async (action: CrudActionType | string, formData?: TItemFormFields) => {
      openDetailModal(formData, {
        title: "Chi tiết hợp đồng",
        tableColumns: detailColumns,
        detailUrl: API_ENDPOINTS[ROLES.AGENT].nonLifeInsurance.detail.list,
        tableOptions: {
          endpoint: ROLES.AGENT,
          enabled: true,
        },
      });
    },
    [openFormModal, openDetailModal, createProductMutation, updateConfirm],
  );

  return (
    <DataTable
      data={listData}
      columns={columns}
      total={total}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      columnPinningConfig={{
        left: ["agent_name"],
        right: [],
      }}
      onAction={handleCrudAction}
      filterFields={["provider"]}
    />
  );
}
