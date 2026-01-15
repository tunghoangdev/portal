import { useCallback } from 'react';
import { useAuth, useDataQuery, useModal } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { listColumns } from './columns';
import { CrudActionType } from '~/types/data-table-type';
import { Icons } from '~/components/icons';
import { CommissionPdfView } from '~/features/shared/components';
const columns = getColumns<any>(listColumns, {
	actions: [CRUD_ACTIONS.EXPORT],
});

export default function PageClient() {
	const { openDetailModal } = useModal();
	// Global state
	const { role } = useAuth();
	const basePath = API_ENDPOINTS[role].company.commissionTable;
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		// rangeFilter: true,
		monthFilter: true,
		periodFilter: true,
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

	const handleCrudAction = useCallback(
		async (action: CrudActionType, detail: any) => {
			openDetailModal(detail, {
				title: '',
				size: 'full',
				renderContent: () => <CommissionPdfView id={detail.id_agent} />,
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
			onAction={handleCrudAction}
			columnPinningConfig={{
				right: ['actions'],
			}}
			customActions={[
				{
					label: 'Xuất bảng kê thu nhập',
					type: CRUD_ACTIONS.EXPORT,
					icon: <Icons.download size={14} strokeWidth={1} />,
				},
			]}
		/>
	);
}
