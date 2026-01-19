import { useCallback, useEffect, useState } from 'react'; // Thêm useRef, useCallback
import { useAuth, useDataQuery, useFilter, useModal } from '@/hooks';
import { DataTable } from '@/features/shared/components/data-table';
import { CRUD_ACTIONS, ROLES } from '@/constant';
import {
	productDetailColumns,
} from '~/features/lifeInsurance/product-detail-columns';
import { getColumns } from '@/features/shared/common';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { Input } from '@/components/ui';
import { debounce } from 'lodash';
import { CrudActionType } from '@/types/data-table-type';
import { feeDueColumns } from './columns';
const columns = getColumns<any>(feeDueColumns, {
	omitKeys: ['product_name'],
	actions: [CRUD_ACTIONS.VIEW],
});
const detailColumns = getColumns<any>(productDetailColumns);
export default function FeeDuePageClient() {
	const [searchValue, setSearchValue] = useState('60');
	// GLOBAL STATE
	const { role } = useAuth();
	const { setFilter, num_date } = useFilter();
	const { openDetailModal } = useModal();

	// CRUD HOOKS
	const { queryParams, queryKey } = useDataQuery({
		basePath: API_ENDPOINTS[role].lifeInsurance.feeDue.list,
		filter: {
			provider_code: true,
			num_date: num_date || 60,
		},
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
	const debouncedSetQueryValue = useCallback(
		debounce((value: string) => {
			setFilter('num_date', +value);
		}, 500),
		[],
	);

	useEffect(() => {
		return () => {
			debouncedSetQueryValue.cancel();
		};
	}, [debouncedSetQueryValue]);
	const handleSearchMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchValue(value);
		debouncedSetQueryValue(value); // Gọi hàm debounced
	};
	const handleCrudAction = useCallback(
		async (action: CrudActionType, detail: any) => {
			openDetailModal(detail, {
				title: 'Chi tiết hợp đồng',
				tableColumns: detailColumns,
				detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
				tableOptions: {
					endpoint: ROLES.AGENT,
					enabled: true,
				},
			});
		},
		[openDetailModal],
	);
	return (
		<DataTable
			data={listData}
			columns={columns}
			loading={isFetching}
			onAction={handleCrudAction}
			columnPinningConfig={{
				left: ['agent_name'],
				right: ['actions'],
			}}
			isFetchingNextPage={isFetchingNextPage}
			total={total || 0}
			hasNextPage={hasNextPage}
			fetchNextPage={fetchNextPage}
			toolbar={{
				startContent: (
					<Input
						type="number"
						placeholder="ngày"
						value={searchValue}
						onChange={handleSearchMonth}
						className="w-50"
						endContent={<>ngày</>}
					/>
				),
			}}
			filterFields={['provider']}
		/>
	);
}
