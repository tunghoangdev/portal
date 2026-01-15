import { api } from '~/lib/api';
import { toast } from 'sonner';
import type { Endpoint } from '~/types/axios';
import { useAuthStore } from '~/stores';
import { DEFAULLT_PAGE_SIZE, DEFAULT_PARAMS, ROLES } from '~/constant';
import type {
	UseInfiniteQueryOptionsType,
	UseQueryOptionsType,
} from '~/types/css-type';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useSwal } from './use-swal';
import { useAuth } from './use-auth';
// Định nghĩa kiểu dữ liệu cho payload gửi đến API
interface CrudApiPayload {
	secret_key?: string;
	token?: string;
	id_staff_action: number;
	// Các thuộc tính có thể có khác được truyền qua `options`
	[key: string]: any;
}

// Định nghĩa kiểu dữ liệu cho `options` của useCrud hook
interface UseCrudOptions {
	endpoint?: Endpoint | string;
	id?: number | string; // Có thể là id của user/agent
	id_staff?: number | string; // Có thể là id của staff
	listUrl?: string;
	detailUrl?: string;
	createUrl?: string;
	updateUrl?: string;
	deleteUrl?: string;
	[key: string]: any; // Cho phép các thuộc tính tùy chỉnh khác
}

export const useCrud = <T>(
	resource: any[],
	options?: UseCrudOptions,
	queryOptions?: UseQueryOptionsType,
	// endpoint?: Enpoint,
) => {
	const queryClient = useQueryClient();
	const { user } = useAuth();

	const endpoint = options?.endpoint ?? undefined;
	const { confirm } = useSwal();
	let data: CrudApiPayload = {
		...options,
		endpoint: undefined,
		secret_key: user?.secret_key,
		token: user?.token,
		id_staff_action: 0,
	};
	if (user?.role === ROLES.AGENT && user?.id && !options?.id) {
		data = { ...data, id_agent: user?.id, id: user?.id };
	}
	if (user?.role === ROLES.STAFF && !options?.id_staff) {
		data = { ...data, id_staff: user?.id, id_staff_action: user?.id };
	}
	const resourcePath = `/${resource?.[0]?.replace(/^\//, '')}`;
	const getAll = () => {
		return useQuery({
			queryKey: resource,
			queryFn: () =>
				api.post<T[]>(
					replaceLastPathSegment(resourcePath, options?.listUrl || ''),
					data,
					endpoint,
				),
			...queryOptions,
		});
	};

	const getInfinite = () => {
		const queryResult = useInfiniteQuery({
			queryKey: resource,
			queryFn: ({ pageParam }) =>
				api.post<T[]>(
					replaceLastPathSegment(resourcePath, options?.listUrl || ''),
					{ ...data, page_num: pageParam },
					endpoint,
				),
			initialPageParam: 1,
			getNextPageParam: (lastPage: any, allPages) => {
				const lastItems = lastPage?.list?.length || lastPage?.length || 0;
				if (lastItems < DEFAULLT_PAGE_SIZE || lastPage?.total === 0) {
					return undefined;
				}
				return allPages.length + 1;
			},
			...(queryOptions as UseInfiniteQueryOptionsType),
		});

		// Create allData variable from data.pages
		const listData = // @ts-ignore
			queryResult.data?.pages.flatMap((page: any) => page?.list || page) ?? [];
		// @ts-ignore
		const total = queryResult.data?.pages[0]?.total;
		return {
			...queryResult,
			listData,
			total,
		};
	};

	const getById = (id: string) =>
		useQuery({
			queryKey: [resource, id],
			queryFn: () => api.get<T>(`${resourcePath}/${id}`, endpoint),
			enabled: !!id,
			...queryOptions,
		});

	const create = () =>
		useMutation({
			mutationFn: (payload: any) =>
				api.post<T>(
					replaceLastPathSegment(resourcePath, options?.createUrl || 'create'),
					{
						...data,
						...payload, // remove param not need
						info: undefined,
						limit: undefined,
						page: undefined,
						page_num: undefined,
						page_size: undefined,
					},
					endpoint,
				),
			onSuccess: (data: any) => {
				if (!data.error_code) {
					toast.success('Tạo thành công');
					queryClient.invalidateQueries({ queryKey: resource });
				}
			},
		});

	const update = () =>
		useMutation({
			mutationFn: (payload: any) =>
				api.post<T>(
					replaceLastPathSegment(resourcePath, options?.updateUrl || 'update'),
					{
						...data,
						...payload, // remove param not need
						info: undefined,
						limit: undefined,
						page: undefined,
						page_num: undefined,
						page_size: undefined,
					},
					endpoint,
				),
			onSuccess: () => {
				toast.success('Cập nhật thành công');
				queryClient.invalidateQueries({ queryKey: resource });
			},
		});
	const updateMutation = useMutation({
		mutationFn: (payload: any) =>
			api.post<T>(
				replaceLastPathSegment(resourcePath, options?.updateUrl || 'update'),
				{
					...data,
					...payload, // remove param not need
					info: undefined,
					limit: undefined,
					page: undefined,
					page_num: undefined,
					page_size: undefined,
				},
				endpoint,
			),
		onSuccess: (data: any) => {
			if (!data.error_code) {
				toast.success('Cập nhật thành công');
				queryClient.invalidateQueries({ queryKey: resource });
			}
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (payload: any) =>
			api.post<T>(
				replaceLastPathSegment(resourcePath, options?.removeUrl || 'delete'),
				{ ...data, ...payload },
				endpoint,
			),
		onSuccess: () => {
			toast.success('Xóa thành công');
			queryClient.invalidateQueries({ queryKey: resource });
		},
		onError: (error) => {
			console.error('Lỗi khi xóa:', error);
			toast.error('Xóa thất bại');
		},
	});
	const updateConfirm = async (
		updateData: any,
		options?: { title?: string; message?: string },
	) => {
		const { title, message } = options || {};
		const defaultMessage = 'Bạn chắc chắn muốn cập nhật item này';
		const res = await confirm({
			title: title || 'Xác nhận cập nhật',
			html: message || defaultMessage,
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Đồng ý',
			icon: 'warning',
		});
		if (res?.isConfirmed) {
			updateMutation.mutate(updateData);
		} else {
			toast.info('Thao tác cập nhật đã được hủy.');
		}
	};
	const remove = async (deleteData: any) => {
		if (!deleteData?.id) {
			toast.error('Không tìm thấy item');
			return Promise.resolve();
		}

		const defaultMessage = `Bạn chắc chắn muốn xóa ${
			deleteData?.name ? `"${deleteData?.name}"` : 'item này'
		}? n\ Hành động này không thể hoàn tác.`;
		const res = await confirm({
			title: 'Xác nhận xóa',
			html: defaultMessage,
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Đồng ý',
			icon: 'warning',
		});
		if (res?.isConfirmed) {
			deleteMutation.mutate(deleteData);
		} else {
			toast.info('Thao tác xóa đã được hủy.');
		}
	};

	return {
		getAll,
		getById,
		create,
		update,
		remove,
		updateConfirm,
		getInfinite,
	};
};

const addSuffix = (str: string, suffix?: string) => {
	if (!suffix) {
		return str;
	}
	const cleanedSuffix = suffix.replace(/^\/|\/$/g, '');
	const cleanedStr = str.replace(/\/+$/, '');
	return `${cleanedStr}/${cleanedSuffix}`;
};

const replaceLastPathSegment = (str: string, newSuffix?: string): string => {
	if (!newSuffix) {
		return str;
	}
	// Loại bỏ dấu '/' ở đầu/cuối của newSuffix nếu có
	const cleanedNewSuffix = newSuffix.replace(/^\/|\/$/g, '');

	const lastSlashIndex = str.lastIndexOf('/');
	if (
		!str.endsWith('/list') ||
		!str.endsWith('/log_list') ||
		!str.endsWith('/list_all')
	) {
		return str;
	}

	if (lastSlashIndex === -1) {
		// Không có dấu '/' nào trong chuỗi
		return cleanedNewSuffix; // Thay thế toàn bộ chuỗi bằng suffix mới
	}

	// Lấy phần đầu của chuỗi trước segment cuối cùng
	const basePath = str.substring(0, lastSlashIndex);
	return `${basePath}/${cleanedNewSuffix}`;
};
