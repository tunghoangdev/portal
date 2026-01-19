import { useCallback } from 'react'; // Thêm useRef, useCallback
import { useCrud } from '@/hooks/use-crud-v2';
import { DataTable } from '@/features/shared/components/data-table';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useAuth, useDataQuery, useModal } from '@/hooks';
import { getColumns } from '@/features/shared/common';
import { CommissionPdfView } from '@/features/shared/components';
import { CrudActionType } from '@/types/data-table-type';
import { commissionColumns } from './columns';
const columns = getColumns<any>(commissionColumns, {
	omitKeys: [
		'is_hide',
		'agent_name',
		'agent_phone',
		'fee',
		'commission_type',
		'percentage',
		'customer_name',
		'life_type_name',
	],
});

export default function PageClient() {
	const { openDetailModal } = useModal();
	const { role, user } = useAuth();
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: API_ENDPOINTS[role].commissionTable.list,
		endpoint: role,
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
				renderContent: () => <CommissionPdfView id={user?.id} />,
			});
		},
		[openDetailModal, user],
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
			toolbar={{
				canExportPdf: true,
			}}
		/>
	);
}
