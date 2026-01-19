import { useCallback } from 'react'; // Thêm useRef, useCallback
import { useCrud } from '@/hooks/use-crud-v2';
import { DataTable } from '@/features/shared/components/data-table';
import { CRUD_ACTIONS, ROLES } from '@/constant';

import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useAuth, useDataQuery, useModal, useTableColumns } from '@/hooks';
import { CrudActionType } from '@/types/data-table-type';
import { getColumns, processingColumns } from '@/features/shared/common';
import { productDetailColumns } from '@/features/lifeInsurance/product-detail-columns';
import { commissionBaseColumns } from '@/features/lifeInsurance/commission-columns';
const detailColumns = getColumns<any>(productDetailColumns);
const commissionColumns = getColumns<any>(commissionBaseColumns);

export default function DonePageClient() {
	// GLOBAL STATE
	const { role } = useAuth();
	const { columns } = useTableColumns(processingColumns, {
		showMonthYear: true,
		actions: [CRUD_ACTIONS.VIEW],
	});

	const { openDetailModal } = useModal();
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
	// CRUD HOOK
	const { getInfinite } = useCrud(queryKey, queryParams, {
		enabled: isQueryEnabled,
	});

	const {
		listData,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		total,
	}: any = getInfinite();
	// HANDLER
	const handleCrudAction = useCallback(
		async (action: CrudActionType, detail: any) => {
			const typeMap: any = {
				[CRUD_ACTIONS.VIEW]: {
					title: 'Chi tiết hợp đồng',
					tableColumns: detailColumns,
					detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
					tableOptions: {
						endpoint: ROLES.AGENT,
						enabled: true,
					},
				},
				[CRUD_ACTIONS.COMMISON_LIST]: {
					title: 'Danh sách phân bổ thưởng',
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
				left: ['agent_name'],
				right: [],
			}}
			onAction={handleCrudAction}
			// customActions={[
			//   {
			//     type: CRUD_ACTIONS.DETAIL,
			//     label: "Xem chi tiết hợp đồng",
			//   },
			// ]}
			filterFields={['provider', 'contractType']}
		/>
	);
}
