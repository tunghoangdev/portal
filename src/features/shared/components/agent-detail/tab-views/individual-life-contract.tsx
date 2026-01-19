import { useEffect, useState } from 'react'; // Thêm useRef, useCallback
import { DataTable } from '~/features/shared/components/data-table';
import { DEFAULT_PARAMS, ROLES } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { useFilter } from '~/hooks';
import { processingColumns } from '~/features/shared/common';

const columns = getColumns<any>(processingColumns);
export const IndividualLifeList = () => {
	const { agentId, contractTypeSelected, providerSelected, setFilter: setFilterGlobal } = useFilter();
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	// CRUD HOOK
	const basePath = API_ENDPOINTS[ROLES.AGENT].individual.lifeInsurance;
	const { getInfinite } = useCrud(
		[basePath.list, filter, agentId, contractTypeSelected, providerSelected],
		{
			endpoint: ROLES.AGENT,
			...filter,
			contract_type: contractTypeSelected,
			provider_code: providerSelected,
			id: agentId,
		},
		{
			enabled: !!agentId,
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
	
	useEffect(() => {
		if(basePath?.list){
		setFilterGlobal('logUrl', `${ROLES.AGENT}/${basePath.list}`);
		setFilterGlobal('provider_code',providerSelected);
		setFilterGlobal('contract_type',contractTypeSelected);
		}
	}, [basePath]);

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
				hiddenFilters: true,
				onSearch: (value) => {
					setFilter({ ...filter, info: value });
				},
			}}
			filterFields={['provider', 'contractType']}
		/>
	);
};
