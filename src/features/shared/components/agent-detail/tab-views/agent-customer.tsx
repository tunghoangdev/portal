import { useState } from 'react'; // Thêm useRef, useCallback
import { useCrud } from '~/hooks/use-crud-v2';
import { DataTable } from '~/features/shared/components/data-table';
import { DEFAULT_PARAMS, ROLES } from '~/constant';
import { customerColumns } from '@/features/customers/columns';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { Endpoint } from '~/types/axios';
const columns = getColumns<any>(customerColumns, {
	omitKeys: ['agent_name'],
});
type IAgentCustomer = {
	id: number;
};
export const AgentCustomer = ({ id }: IAgentCustomer) => {
	// LOCAL STATE
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	const basePath = API_ENDPOINTS[ROLES.AGENT].customers;
	// CRUD API HOOK
	const { getInfinite } = useCrud(
		[basePath.list, filter, id],
		{
			endpoint: ROLES.AGENT as Endpoint,
			...filter,
			id,
		},
		{
			enabled: !!id,
		},
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
				left: ['agent_name'],
				right: [],
			}}
			toolbar={{
				hideExportExcel: true,
				onSearch: (value) => {
					setFilter({ ...filter, info: value });
				},
			}}
		/>
	);
};
