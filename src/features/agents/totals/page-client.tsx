import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { DataTable } from '~/features/shared/components/data-table';
import { useCrud } from '~/hooks/use-crud-v2';
import { listColumns } from './columns';
import { useAuth, useDataQuery, useTableColumns } from '~/hooks';

export default function PageClient() {
	const { role } = useAuth();
	const { columns } = useTableColumns(listColumns, {
		showLevel: true,
	});
	const basePath = API_ENDPOINTS[role].agents;
	const { queryParams, queryKey } = useDataQuery({
		endpoint: '',
		basePath: basePath.total,
	});
	const { getInfinite } = useCrud(queryKey, queryParams);

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
			columnPinningConfig={{
				left: ['agent_name'],
			}}
			isFetchingNextPage={isFetchingNextPage}
			total={total || 0}
			hasNextPage={hasNextPage}
			fetchNextPage={fetchNextPage}
		/>
	);
}
