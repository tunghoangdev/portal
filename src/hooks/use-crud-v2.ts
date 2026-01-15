import { api } from '~/lib/api';
import { toast } from 'sonner';
import type { Endpoint } from '~/types/axios';
import { DEFAULLT_PAGE_SIZE, ROLES } from '~/constant';
import type {
	UseInfiniteQueryOptionsType,
	UseQueryOptionsType,
} from '~/types/css-type';
import {
	keepPreviousData,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSwal } from './use-swal';
import { useAuth } from './use-auth';
import { useModal } from './use-modal';
import { useCommon } from './use-common';

interface CrudApiPayload {
	secret_key?: string;
	token?: string;
	id_staff_action?: number;
	[key: string]: any;
}

// Định nghĩa kiểu dữ liệu cho `options` của useCrud hook
interface UseCrudOptions {
	endpoint?: Endpoint | string;
	id?: number | string;
	id_staff?: number | string;
	listUrl?: string;
	detailUrl?: string;
	createUrl?: string;
	updateUrl?: string;
	deleteUrl?: string;
	[key: string]: any;
}

interface MutationPayload extends CrudApiPayload {
	_customUrl?: string;
	_customUrlSegment?: string;
	_customMessage?: string;
	_hideMessage?: boolean;
	_closeModal?: boolean;
	_queryKey?: any[];
}
let customMessage = '';
let customQueryKey: any[] = [];
let customCloseModal = true;
let customHideMessage = false;
export const useCrud = <T>(
	resource: any[],
	options?: UseCrudOptions,
	queryOptions?: UseQueryOptionsType,
) => {
	const { closeModal } = useModal();
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const { currentSecretkey } = useCommon();
	const endpoint = options?.endpoint ?? undefined;
	const { confirm, loading, close } = useSwal();

	const baseData: CrudApiPayload = useMemo(() => {
		let data: CrudApiPayload = {
			...options,
			endpoint: undefined,
			secret_key: user?.secret_key || currentSecretkey,
			token: user?.token,
			id_staff_action: 0,
		};

		if (user?.role === ROLES.AGENT && user?.id && !options?.id) {
			data = { ...data, id: user?.id, id_agent: user?.id };
		}

		if (user?.role !== ROLES.AGENT && !options?.id_staff) {
			data = { ...data, id_staff: user?.id, id_staff_action: user?.id };
		}

		return data;
	}, [user?.secret_key, user?.token, user?.role, user?.id, currentSecretkey, options]);
	const resourcePath = `/${resource?.[0]?.replace(/^\//, '')}`;

	const getAll = () => {
		return useQuery({
			queryKey: resource,
			queryFn: () =>
				api.post<T[]>(
					options?.listUrl
						? replaceLastPathSegment(resourcePath, options?.listUrl || '')
						: resourcePath,
					baseData,
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
					resourcePath,
					{ ...baseData, page_num: pageParam },
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
			placeholderData: keepPreviousData,
		});
		// @ts-ignore
		const allPages = queryResult.data?.pages ?? [];
		const errorPage = allPages?.filter((item: any) => item?.error_code)[0];
		let listData = [];
		if (!errorPage) {
			listData = allPages.flatMap((page: any) => page?.list || page) ?? [];
		}
		const total = allPages?.[0]?.total;
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

	const getOne = () =>
		useQuery({
			queryKey: resource,
			queryFn: () =>
				api.post<T[]>(
					options?.detailUrl
						? replaceLastPathSegment(resourcePath, options?.detailUrl || '')
						: resourcePath,
					baseData,
					endpoint,
				),
			...queryOptions,
		});

	const formData = (data: any) => ({
		...baseData,
		...data,
		info: undefined,
		limit: undefined,
		page: undefined,
		page_num: undefined,
		page_size: undefined,
		from_date: undefined,
		to_date: undefined,
		id_agent_level: undefined,
		id_agent_status: undefined,
		// period_name: undefined,
	});

	const create = () =>
		useMutation({
			mutationFn: (payload: MutationPayload) => {
				const url =
					payload._customUrl ||
					replaceLastPathSegment(
						resourcePath,
						payload._customUrlSegment || options?.createUrl || 'create',
					);
				if (payload._customMessage) {
					customMessage = payload._customMessage;
				}
				if (payload._closeModal !== undefined) {
					customCloseModal = payload._closeModal;
				}
				if (payload._hideMessage) {
					customHideMessage = payload._hideMessage;
				}
				if (payload._queryKey) {
					customQueryKey = payload._queryKey;
				}
				const {
					_customUrl,
					_customUrlSegment,
					_customMessage,
					_closeModal,
					_hideMessage,
					...restPayload
				} = payload;
				return api.post<T>(
					url,
					formData(restPayload),
					// {
					// 	...baseData,
					// 	...restPayload,
					// 	info: undefined,
					// 	limit: undefined,
					// 	page: undefined,
					// 	page_num: undefined,
					// 	page_size: undefined,
					// },
					endpoint,
				);
			},
			onSuccess: (data: any) => {
				if (!data.error_code) {
					if (!customHideMessage) {
						toast.success(customMessage || 'Tạo thành công');
					}
					if (customCloseModal) {
						closeModal();
					}
					queryClient.invalidateQueries({
						queryKey: customQueryKey || resource,
					});
				}
			},
		});

	const update = () =>
		useMutation({
			mutationFn: (payload: MutationPayload) => {
				const url =
					payload._customUrl ||
					replaceLastPathSegment(
						resourcePath,
						payload._customUrlSegment || options?.updateUrl || 'update',
					);
				if (payload._customMessage) {
					customMessage = payload._customMessage;
				}
				if (payload._closeModal !== undefined) {
					customCloseModal = payload._closeModal;
				}
				if (payload._hideMessage) {
					customHideMessage = payload._hideMessage;
				}
				if (payload._queryKey) {
					customQueryKey = payload._queryKey;
				}
				const {
					_customUrl,
					_customUrlSegment,
					_customMessage,
					_closeModal,
					_hideMessage,
					...restPayload
				} = payload;
				return api.post<T>(
					url,
					formData(restPayload),
					// {
					// 	...baseData,
					// 	...restPayload,
					// 	info: undefined,
					// 	limit: undefined,
					// 	page: undefined,
					// 	page_num: undefined,
					// 	page_size: undefined,
					// },
					endpoint,
				);
			},
			onSuccess: (data?: any) => {
				if (!data.error_code) {
					if (!customHideMessage) {
						toast.success(customMessage || 'Cập nhật thành công');
					}
					if (customCloseModal) {
						closeModal();
					}
					queryClient.invalidateQueries({
						queryKey: customQueryKey || resource,
					});
				}
			},
		});
	const remove = () => {
		useMutation({
			mutationFn: (payload: MutationPayload) => {
				const url =
					payload._customUrl ||
					replaceLastPathSegment(
						resourcePath,
						payload._customUrlSegment || options?.deleteUrl || 'delete',
					);
				if (payload._customMessage) {
					customMessage = payload._customMessage;
				}
				if (payload._closeModal !== undefined) {
					customCloseModal = payload._closeModal;
				}
				if (payload._hideMessage) {
					customHideMessage = payload._hideMessage;
				}
				if (payload._queryKey) {
					customQueryKey = payload._queryKey;
				}
				const {
					_customUrl,
					_customUrlSegment,
					_customMessage,
					_closeModal,
					_hideMessage,
					...restPayload
				} = payload;
				return api.post<T>(url, { ...baseData, ...restPayload }, endpoint);
			},
			onSuccess: (data?: any) => {
				if (!data.error_code) {
					if (!customHideMessage) {
						toast.success(customMessage || 'Xóa thành công');
					}
					if (customCloseModal) {
						closeModal();
					}
					queryClient.invalidateQueries({
						queryKey: customQueryKey || resource,
					});
				}
			},
			onError: (error) => {
				console.error('Lỗi khi xóa:', error);
				toast.error('Xóa thất bại');
			},
		});
	};
	const updateMutation = useMutation({
		// Giữ lại updateMutation cho updateConfirm nếu bạn muốn tách
		mutationFn: (payload: MutationPayload) => {
			const url =
				payload._customUrl ||
				replaceLastPathSegment(
					resourcePath,
					payload._customUrlSegment || options?.updateUrl || 'update',
				);
			if (payload._customMessage) {
				customMessage = payload._customMessage;
			}
			if (payload._closeModal !== undefined) {
				customCloseModal = payload._closeModal;
			}
			if (payload._hideMessage) {
				customHideMessage = payload._hideMessage;
			}
			if (payload._queryKey) {
				customQueryKey = payload._queryKey;
			}

			const {
				_customUrl,
				_customUrlSegment,
				_customMessage,
				_closeModal,
				_hideMessage,
				_queryKey,
				...restPayload
			} = payload;
			return api.post<T>(
				url,
				{
					...baseData,
					...restPayload,
					info: undefined,
					limit: undefined,
					page: undefined,
					page_num: undefined,
					page_size: undefined,
				},
				endpoint,
			);
		},
		onSuccess: (data: any) => {
			close();
			if (!data.error_code) {
				if (!customHideMessage) {
					toast.success(customMessage || 'Cập nhật thành công');
				}
				if (customCloseModal) {
					closeModal();
				}
				queryClient.invalidateQueries({ queryKey: customQueryKey || resource });
			}
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (payload: MutationPayload) => {
			const url =
				payload._customUrl ||
				replaceLastPathSegment(
					resourcePath,
					payload._customUrlSegment || options?.deleteUrl || 'delete',
				);
			if (payload._customMessage) {
				customMessage = payload._customMessage;
			}
			if (payload._closeModal !== undefined) {
				customCloseModal = payload._closeModal;
			}
			if (payload._hideMessage) {
				customHideMessage = payload._hideMessage;
			}
			if (payload._queryKey) {
				customQueryKey = payload._queryKey;
			}

			const {
				_customUrl,
				_customUrlSegment,
				_customEndpoint,
				_customMessage,
				_closeModal,
				_queryKey,
				_hideMessage,
				message,
				title,
				...restPayload
			} = payload;
			return api.post<T>(
				url,
				formData(restPayload),
				_customEndpoint !== undefined ? _customEndpoint : endpoint,
			);
		},
		onSuccess: (data: any) => {
			close();
			if (!data?.error_code) {
				if (!customHideMessage) {
					toast.success(customMessage || 'Xóa thành công');
				}
				if (customCloseModal) {
					closeModal();
				}
				queryClient.invalidateQueries({ queryKey: customQueryKey || resource });
			}
		},
	});

	const updateConfirm = async (
		updateData: any, // Nên là MutationPayload
		options?: {
			title?: string;
			message?: string;
			_customUrl?: string;
			_customUrlSegment?: string;
			_customMessage?: string;
			_queryKey?: any[];
			_closeModal?: boolean;
			_hideMessage?: boolean;
			onSuccess?: (data: any) => void;
			onError?: (error: any) => void;
		},
	) => {
		const {
			title,
			message,
			_customUrl,
			_customUrlSegment,
			_closeModal,
			_hideMessage,
			_queryKey,
			onSuccess,
			onError,
		} = options || {};
		const defaultMessage = 'Bạn chắc chắn muốn cập nhật item này';
		const res = await confirm({
			title: title || 'Xác nhận cập nhật',
			html: message || defaultMessage,
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Đồng ý',
			icon: 'warning',
		});
		if (res?.isConfirmed) {
			loading();
			updateMutation.mutate(
				{
					...updateData,
					_customUrl,
					_customUrlSegment,
					_closeModal,
					_hideMessage,
					_queryKey,
				},
				{
					onSuccess: (data) => {
						// Gọi callback onSuccess nếu được cung cấp
						onSuccess?.(data);
					},
					onError: (error) => {
						// Gọi callback onError nếu được cung cấp
						onError?.(error);
					},
				},
			);
		} else {
			toast.info('Thao tác cập nhật đã được hủy.');
		}
	};

	const deleteConfirm = async (
		deleteData: any,
		options?: {
			title?: string;
			message?: string;
			_customUrl?: string;
			_customUrlSegment?: string;
			_customEndpoint?: string;
			_customMessage?: string;
			_queryKey?: any;
			_closeModal?: boolean;
			_hideMessage?: boolean;
		},
	) => {
		// Thêm tùy chọn URL vào đây
		if (!deleteData?.id) {
			toast.error('Không tìm thấy item');
			return Promise.resolve();
		}

		const defaultMessage = `Bạn chắc chắn muốn xóa ${
			deleteData?.name ? `"${deleteData?.name}"` : 'item này'
		}? \n Hành động này không thể hoàn tác.`;
		const res = await confirm({
			title: options?.title || 'Xác nhận xóa',
			html: options?.message || defaultMessage,
			cancelButtonText: 'Hủy',
			confirmButtonText: 'Đồng ý',
			icon: 'warning',
		});
		if (res?.isConfirmed) {
			loading();
			deleteMutation.mutate({ id: deleteData?.id, ...options });
		} else {
			toast.info('Thao tác xóa đã được hủy.');
		}
	};
	const uploadFile = async (file: File, path?: string) => {
		const formDataPost = new FormData();
		formDataPost.append('file', file);
		formDataPost.append(user?.code_key, user?.code_key);
		const urlRequest = resourcePath + (path || '');
		return await api.postForm(urlRequest, formDataPost, endpoint);
	};

	return {
		getAll,
		getById,
		create,
		update,
		deleteConfirm,
		updateConfirm,
		getInfinite,
		getOne,
		remove,
		uploadFile,
	};
};

const addSuffix = (str: string, suffix?: string) => {
	if (!suffix) {
		return str;
	}
	const cleanedSuffix = suffix?.replace(/^\/|\/$/g, '');
	const cleanedStr = str?.replace(/\/+$/, '');
	return `${cleanedStr}/${cleanedSuffix}`;
};

// Hàm này cần được cải thiện để linh hoạt hơn
const replaceLastPathSegment = (str: string, newSuffix?: string): string => {
	if (!newSuffix) {
		// Nếu không có suffix mới, trả về nguyên bản (hoặc xóa segment cuối nếu cần)
		const lastSlashIndex = str?.lastIndexOf('/');
		if (lastSlashIndex !== -1) {
			// Loại bỏ segment cuối cùng nếu không có newSuffix
			return str?.substring(0, lastSlashIndex);
		}
		return str; // Không có suffix và không có slash, trả về nguyên bản
	}

	const cleanedNewSuffix = newSuffix?.replace(/^\/|\/$/g, '');

	// Kiểm tra xem `str` có kết thúc bằng một trong các segment 'list', 'log_list', 'list_all' không
	const knownListSegments = ['/list', '/log_list', '/list_all', 'dic'];
	let foundSegment = false;
	let lastSlashIndex = -1;

	for (const segment of knownListSegments) {
		if (str.endsWith(segment)) {
			lastSlashIndex = str.lastIndexOf(segment);
			foundSegment = true;
			break;
		}
	}

	if (foundSegment && lastSlashIndex !== -1) {
		const basePath = str.substring(0, lastSlashIndex);
		return `${basePath}/${cleanedNewSuffix}`;
	}
	// Nếu không kết thúc bằng các segment đã biết, hoặc không có segment nào,
	// thì mặc định sẽ thêm suffix vào cuối chuỗi
	// Hoặc bạn có thể thêm logic khác ở đây tùy thuộc vào quy tắc URL của bạn
	return addSuffix(str, cleanedNewSuffix);
};
