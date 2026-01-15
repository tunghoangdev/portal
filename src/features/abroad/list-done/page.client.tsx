import { useCallback } from 'react';
import { useAuth, useDataQuery, useModal, useTableColumns } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS, ROLES } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import type { CrudActionType } from '~/types/data-table-type';
import { Icons } from '~/components/icons';
import { getColumns } from '~/features/shared/common';
import { BaseColumns } from './columns';
import { CommissionColumns } from './commission-columns';
import { columnsDetail } from './detail-columns';
const commissionColumns = getColumns<any>(CommissionColumns);
const detailColumns = getColumns<any>(columnsDetail);

export default function PageClient() {
	// GLOBAL STATE
	const { role } = useAuth();
	const basePath = API_ENDPOINTS[role].abroad;
	const basePathStaff = API_ENDPOINTS[ROLES.STAFF].abroad;
	const { openDetailModal } = useModal();

	const { columns, logColumns } = useTableColumns(BaseColumns, {
		showMonthYear: true,
		// showLevel: true,
		actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.VIEW, CRUD_ACTIONS.COMMISON_LIST],
	});

	// CRUD HANDLER
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.done.list,
		rangeFilter: true,
		periodFilter: true,
		filter: {
			provider_code: true,
		},
	});
	// const queryKey = [
	// 	basePath.done.list,
	// 	filter,
	// 	periodDate || {
	// 		start_date: '',
	// 		end_date: '',
	// 	},
	// 	period_name || '',
	// 	providerSelected,
	// ];

	const { getInfinite, updateConfirm } = useCrud(
		queryKey,
		queryParams,
		{ enabled: isQueryEnabled },
		// {
		// 	endpoint: role,
		// 	...filter,
		// 	...periodDate,
		// 	period_name: period_name || '',
		// 	provider_code: providerSelected,
		// },
		// {
		// 	enabled: !!periodDate,
		// },
	);

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
			if (action === CRUD_ACTIONS.REVOCATION_CONTRACT) {
				await updateConfirm(
					{ id: detail?.id },
					{
						title: 'Thu hồi hợp đồng hợp đồng',
						message: `Bạn có chắc chắn muốn thu hồi hợp đồng ${detail?.number_contract}?`,
						_customUrl: basePath?.done.return,
						// _queryKey: queryKey,
					},
				);
				// refetch();
				return;
			}
			const newLogColumns = logColumns.filter(
				(item: any) => !item?.prop?.startsWith('level_'),
			);
			const typeMap: any = {
				[CRUD_ACTIONS.VIEW]: {
					title: 'Chi tiết hợp đồng',
					tableColumns: detailColumns,
					detailUrl: basePath?.detail?.list,
					tableOptions: {
						endpoint: ROLES.AGENT,
						enabled: true,
					},
				},
				[CRUD_ACTIONS.LOG]: {
					title: 'Lịch sử hợp đồng',
					tableColumns: newLogColumns,
					detailUrl: basePathStaff?.common?.logList,
					tableOptions: {
						endpoint: ROLES.STAFF,
						enabled: true,
					},
				},
				[CRUD_ACTIONS.COMMISON_LIST]: {
					title: 'Danh sách phân bổ thưởng',
					tableColumns: commissionColumns,
					detailUrl: basePath?.done?.commission,
					tableOptions: {
						endpoint: ROLES.STAFF,
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
					type: CRUD_ACTIONS.LOG,
					label: 'Xem lịch sử',
					isHidden(row: any) {
						return role === ROLES.AGENT;
					},
				},
				{
					type: CRUD_ACTIONS.COMMISON_LIST,
					label: 'Phân bổ thưởng',
					isHidden(row: any) {
						return role === ROLES.AGENT;
					},
				},
				{
					type: CRUD_ACTIONS.REVOCATION_CONTRACT,
					label: 'Thu hồi tính thưởng',
					icon: <Icons.rotateCcw size={16} strokeWidth={2} />,
					color: 'text-danger',
					bg: 'danger',
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
