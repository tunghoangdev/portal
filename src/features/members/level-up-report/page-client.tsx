import { DataTable } from '@/features/shared/components/data-table';
import { getColumns } from '@/features/shared/common';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { useAuth, useDataQuery } from '@/hooks';
import { levelUpReportBaseColumns } from './columns';
const columns = getColumns<any>(levelUpReportBaseColumns, {
	omitKeys: [
		'email',
		'birthday',
		'gender',
		'address',
		'full_address',
		'tax',
		'id_number',
		'issued_date',
		'issued_place',
		'bank_name',
		'bank_number',
		'is_duplicate',
		'link_front_id',
		'link_back_id',
	],
});

export default function PageClient() {
	const { role } = useAuth();
	const { queryParams, queryKey } = useDataQuery({
		basePath: API_ENDPOINTS[role].levelUp.report,
		endpoint: '',
	});
	const { getInfinite } = useCrud(queryKey, queryParams);

	const {
		listData,
		isFetching,
		fetchNextPage,
		total,
		isFetchingNextPage,
		hasNextPage,
	}: any = getInfinite();

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
				left: ['agent_name'],
			}}
		/>
	);
}
