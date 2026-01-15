import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions,
	type UseMutationOptions,
} from "@tanstack/react-query";
import { api as apiClient } from "~/lib/api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

export function useGetQuery<TData = unknown>(
	key: string | string[],
	path: string,
	options?: UseQueryOptions<TData>,
) {
	const queryKey = Array.isArray(key) ? key : [key];

	return useQuery<TData>({
		queryKey,
		queryFn: () => apiClient.get<TData>(path),
		...options,
	});
}

export function useCreateMutation<TData = unknown, TVariables = unknown>(
	key: string | string[],
	path: string,
	options?: UseMutationOptions<TData, Error, TVariables>,
) {
	const queryClient = useQueryClient();
	const queryKey = Array.isArray(key) ? key : [key];

	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables) => apiClient.post<TData>(path, variables),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		...options,
	});
}

export function useUpdateMutation<TData = unknown, TVariables = unknown>(
	key: string | string[],
	getPath: (variables: TVariables) => string,
	options?: UseMutationOptions<TData, Error, TVariables>,
) {
	const queryClient = useQueryClient();
	const queryKey = Array.isArray(key) ? key : [key];

	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables) =>
			apiClient.put<TData>(getPath(variables), variables),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		...options,
	});
}

export function useDeleteMutation<TData = unknown, TVariables = unknown>(
	key: string | string[],
	getPath: (variables: TVariables) => string,
	options?: UseMutationOptions<TData, Error, TVariables>,
) {
	const queryClient = useQueryClient();
	const queryKey = Array.isArray(key) ? key : [key];

	return useMutation<TData, Error, TVariables>({
		mutationFn: (variables) => apiClient.delete<TData>(getPath(variables)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
		...options,
	});
}

export function getAllItemsFromInfiniteData<
	T,
	TResponse extends { items: T[] },
>(data?: InfiniteData<TResponse>): T[] {
	return (
		// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
		data?.pages.reduce<T[]>((acc, page) => [...acc, ...page.items], []) || []
	);
}

export interface PaginatedResponse<T> {
	items: T[];
	nextCursor?: number | string | null;
	totalItems?: number;
	totalPages?: number;
}

export function useInfiniteGetQuery<T>(
	queryKey: string | string[],
	endpoint: string,
	options: {
		initialPageParam?: number | string;
		getNextPageParam: (
			lastPage: PaginatedResponse<T>,
			allPages: PaginatedResponse<T>[],
		) => number | string | undefined | null;
		params?: Record<string, any>;
		enabled?: boolean;
	} = {
		getNextPageParam: () => undefined,
	},
) {
	const queryResult = useInfiniteQuery<PaginatedResponse<T>, Error>({
		queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
		queryFn: async ({ pageParam = options.initialPageParam }) => {
			let url = endpoint;
			const params = { ...(options.params || {}) };
			if (pageParam !== undefined && pageParam !== null) {
				params.cursor = pageParam;
			}
			const queryString = new URLSearchParams(params as any).toString();
			if (queryString) url += `?${queryString}`;
			return apiClient.get<PaginatedResponse<T>>(url);
		},
		initialPageParam: options.initialPageParam,
		getNextPageParam: options.getNextPageParam,
		enabled: options.enabled,
	});

	const response =
		queryResult.data?.pages.reduce<T[]>(
			// biome-ignore lint/performance/noAccumulatingSpread: <explanation>
			(acc, page) => [...acc, ...page.items],
			[],
		) || [];

	return {
		...queryResult,
		response,
	};
}
