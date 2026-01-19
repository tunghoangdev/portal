
import { useCallback } from 'react';
import { useAuth, useDataQuery, useModal, useTableColumns } from '@/hooks';
import { DataTable } from '@/features/shared/components/data-table';
import type { CrudActionType } from '@/types/data-table-type';
import { CRUD_ACTIONS, ROLES } from '@/constant';
import {
  processingColumns,
} from "~/features/lifeInsurance/processing-columns";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { useCrud } from "@/hooks/use-crud-v2";
import { TItemFormFields } from "@/types/form-field";
import { getColumns } from "@/features/shared/common";
import { productDetailColumns } from '~/features/lifeInsurance/product-detail-columns';
const detailColumns = getColumns<any>(productDetailColumns);
export default function ProcessingPageClient() {
  // Global state
  const { role } = useAuth();
  const { columns } = useTableColumns(processingColumns, {
    showMonthYear: true,

    actions: [CRUD_ACTIONS.DETAIL],
  });
  const { openDetailModal } = useModal();
  // Local state
  const basePath = API_ENDPOINTS[role].lifeInsurance.canceled;
  // CRUD HOOKS
  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    rangeFilter: true,
    filter: {
      provider_code: true,
      contract_type: true,
    },
  });
  const { getInfinite } = useCrud(queryKey, queryParams, {
    enabled: isQueryEnabled,
  });
  const {
    isFetchingNextPage,
    isFetching,
    listData,
    total,
    hasNextPage,
    fetchNextPage,
  } = getInfinite();

  const handleCrudAction = useCallback(
    (action: CrudActionType, formData?: TItemFormFields) => {
      openDetailModal(formData, {
        title: "Chi tiết hợp đồng",
        tableColumns: detailColumns,
        detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
        tableOptions: {
          endpoint: ROLES.AGENT,
          enabled: true,
        },
      });
    },
    [openDetailModal]
  );
  return (
    <>
      <DataTable
        data={listData}
        columns={columns}
        onAction={handleCrudAction}
        total={total}
        loading={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        columnPinningConfig={{
          left: ["agent_name"],
          right: [],
        }}
        customActions={[
          {
            type: "detail",
            label: "Xem chi tiết hợp đồng",
          },
        ]}
        filterFields={["provider", "contractType"]}
      />
    </>
  );
}
