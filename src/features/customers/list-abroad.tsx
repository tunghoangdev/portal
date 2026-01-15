import { useFilter } from '~/hooks';
import { getColumns } from '~/features/shared/common';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { DataTable } from '~/features/shared/components/data-table';
import { useCrud } from '~/hooks/use-crud-v2';
import { AbroadBaseColumns } from '~/features/abroad/base-columns';
import { DEFAULT_PARAMS } from '~/constant';
import { useEffect, useState } from 'react';

const columns = getColumns<any>(AbroadBaseColumns);

export default function AbroadCustomerList() {
	// GLOBALS STATE
	const { customerId, agentId, setFilter: setFilterGlobal } = useFilter();
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	const basePath = API_ENDPOINTS.agent.individual.abroad.customer;
	// CRUD API HOOK
	const { getInfinite } = useCrud(
		[basePath, customerId, agentId, filter],
		{
			...filter,
			endpoint: '',
			id: customerId,
			id_agent: agentId,
		},
		{
			enabled: !!customerId && !!agentId,
		},
	);
	const {
		isFetchingNextPage,
		isFetching,
		listData,
		total,
		hasNextPage,
		fetchNextPage,
	} = getInfinite();

	useEffect(() => {
		if(basePath	){
			setFilterGlobal('logUrl', basePath);
		}
	}, [basePath]);

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
				right: [],
			}}
			toolbar={{
					onSearch: (value) => {
						setFilter({ ...filter, info: value });
					},
				}}
		/>
	);
}
