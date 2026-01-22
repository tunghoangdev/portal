
import { useAuth, useDataQuery } from '@/hooks';
import { DataTable } from '@/features/shared/components/data-table';
import { getColumns } from '@/features/shared/common/get-columns';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { listColumns } from './columns';
const columns = getColumns<any>(listColumns);
export default function OrderList() {
	// Global state
	const { role } = useAuth();
	const basePath = API_ENDPOINTS[role].orders;
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		endpoint: role,
		rangeFilter: true,
	});

	const { getInfinite } = useCrud(
		queryKey,
		queryParams,
		{
			enabled: isQueryEnabled,
		}
	);
	
	const {
		listData,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		total,
	}: any = getInfinite();

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
				left: ['key_code'],
				right: ['actions'],
			}}
		
		/>
	);
}
