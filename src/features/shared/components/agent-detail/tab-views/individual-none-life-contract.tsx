import { useEffect, useState } from 'react'; // Thêm useRef, useCallback
import { DataTable } from '~/features/shared/components/data-table';
import { DEFAULT_PARAMS, ROLES } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { useFilter } from '~/hooks';
import { noneLifeBaseColumns } from '~/features/nonlife-insurance/none-life-base-columns';

const columns = getColumns<any>(noneLifeBaseColumns);
export const IndividualNonlifeContract = () => {
	const { agentId, providerSelected, setFilter: setFilterGlobal } = useFilter();
	// State
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	const basePath = API_ENDPOINTS[ROLES.AGENT].individual.nonLifeInsurance;
	// API CRUD
	const { getInfinite } = useCrud(
		[basePath.list, filter, agentId, providerSelected],
		{
			endpoint: ROLES.AGENT,
			...filter,
			provider_code: providerSelected,
			id: agentId,
		},
		{
			enabled: !!agentId,
		},
	);

	const {
		isFetchingNextPage,
		isFetching,
		listData,
		total,
		hasNextPage,
		fetchNextPage,
	}: any = getInfinite();

	useEffect(() => {
		if(basePath?.list){
		setFilterGlobal('logUrl', `${ROLES.AGENT}/${basePath.list}`);
		setFilterGlobal('provider_code',providerSelected);
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
				hiddenFilters: true,
			}}
			filterFields={['nonLifeProvider']}
		/>
	);
};
