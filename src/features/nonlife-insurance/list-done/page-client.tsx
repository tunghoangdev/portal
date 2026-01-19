import { useCallback } from 'react'; // Thêm useRef, useCallback
import { useAuth, useDataQuery, useModal, useTableColumns } from '@/hooks';
import { DataTable } from '@/features/shared/components/data-table';
import { CRUD_ACTIONS, ROLES } from '@/constant';
import { getColumns } from '@/features/shared/common';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { CrudActionType } from '@/types/data-table-type';
import { noneLifeBaseColumns } from '../none-life-base-columns';
import { noneLifeContractCommissionColumns } from '../none-life-commission-columns';
import { noneLifeProductDetailColumns } from '../none-life-product-detail-columns';
const commissionColumns = getColumns<any>(noneLifeContractCommissionColumns);
const detailColumns = getColumns<any>(noneLifeProductDetailColumns);
export default function PageClient() {
	// GLOBAL STATE
	const { role } = useAuth();
	const { columns } = useTableColumns(noneLifeBaseColumns, {
		showMonthYear: true,
		omitKeys: ['link_cer'],
		actions: [CRUD_ACTIONS.VIEW, CRUD_ACTIONS.COMMISON_LIST],
	});

	const { openDetailModal } = useModal();

	const basePath = API_ENDPOINTS[role].nonLifeInsurance.done;
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		rangeFilter: true,
		periodFilter: true,
		filter: {
			provider_code: true,
		},
	});
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
					detailUrl: API_ENDPOINTS[ROLES.AGENT].nonLifeInsurance.detail.list,
					tableOptions: {
						endpoint: ROLES.AGENT,
						enabled: true,
					},
				},
				[CRUD_ACTIONS.COMMISON_LIST]: {
					title: 'Danh sách phân bổ thưởng',
					tableColumns: commissionColumns,
					detailUrl:
						API_ENDPOINTS[ROLES.AGENT].nonLifeInsurance?.done?.commission,
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
			customActions={[
				{
					type: CRUD_ACTIONS.VIEW,
					label: 'Xem chi tiết',
				},
				{
					type: CRUD_ACTIONS.COMMISON_LIST,
					label: 'Phân bổ thưởng',
					isHidden(row: any) {
						return role === ROLES.AGENT;
					},
				},
			]}
			onAction={handleCrudAction}
			filterFields={['provider']}
		/>
	);
}
