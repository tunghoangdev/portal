import type {
	UseInfiniteQueryOptions,
	UseQueryOptions,
} from '@tanstack/react-query';
export type UseQueryOptionsType = Omit<
	UseQueryOptions,
	'queryKey' | 'queryFn'
> & {};
export type UseInfiniteQueryOptionsType = Omit<
	UseInfiniteQueryOptions,
	'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
> & {};
