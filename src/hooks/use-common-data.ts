import { useCommonStore } from '~/stores';
import { useEffect } from 'react';
import { useCrud } from './use-crud-v2';
import type { UseQueryOptionsType } from '~/types/css-type';
type Options = {
	data?: any;
	fetchOnInit?: boolean;
};
export const useCommonData = <T = any>(
	key: string,
	endpoint: string,
	queryOptions?: UseQueryOptionsType & {
		enabled?: boolean;
		data?: any;
		fetchOnInit?: boolean;
	},
) => {
	const { data: dataStore, setData } = useCommonStore();
	const cached = dataStore[key] as T | undefined;

	const { data, fetchOnInit, enabled, ...options } = queryOptions || {};
	const { getAll }: any = useCrud<T>(
		[endpoint, data],
		{ ...data },
		{
			enabled: (fetchOnInit && !cached) || !!enabled,
			...options,
		},
	);
	const { data: listQuery, refetch, isFetching }: any = getAll(data);

	useEffect(() => {
		if (listQuery || listQuery?.list || listQuery?.content) {
			const list = listQuery || listQuery?.list || listQuery?.content || [];
			setData(key, list);
		}
	}, [listQuery]);

	return {
		data: cached || listQuery?.list || listQuery?.content || [],
		isFetching,
		refetch,
	};
};

export const transformToOptions = (
	data: any[],
	labelKey?: string,
	valueKey?: string,
) => {
	if (!Array.isArray(data)) {
		return [];
	}
	return data?.map((item) => ({
			value: valueKey ? item[valueKey] : item.id,
			label: labelKey ? item[labelKey] : item.name,
		})) || [];
}
