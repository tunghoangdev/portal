'use client';
import {
	type ComponentType,
	forwardRef,
	memo,
	useEffect,
	useMemo,
	useState,
} from 'react';
import {
	Modal as HeroModal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalProps,
} from '@/components/ui';
import { DEFAULT_PARAMS, ROLES } from '@/constant';
import { useCommon, useCommonData, useFilter } from '@/hooks';
import { useAuth } from '@/hooks/use-auth';
import { DataTable } from '@/features/shared/components/data-table';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
interface DetailModalProps<T> {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	data: T;
	renderContent?: ComponentType<{ data: T }>;
	size?: ModalProps['size'];
	modalId: string;
	detailUrl?: string;
	tableColumns?: any[];
	tableOptions?: any;
	modalProps?: any;
}

export const DetailModal = memo(
	forwardRef<any, DetailModalProps<any>>(
		(
			{
				isOpen,
				onClose,
				title,
				data,
				renderContent: ContentComponent, // Đổi tên để tránh xung đột
				size,
				detailUrl,
				tableColumns,
				tableOptions,
				modalProps,
			}: DetailModalProps<any>,
			ref,
		) => {
			// STATE-----/
			const [filter, setFilter] = useState<any>(DEFAULT_PARAMS);
			const { setFilter: setGlobalFilter } = useFilter();
			const { role, user } = useAuth();
			const { agentLevels } = useCommon();
			const { endpoint, enabled, showPermission, ...payload } =
				tableOptions || {};
			const { getAll } = useCrud(
				[detailUrl || '', filter, payload],
				{
					endpoint: endpoint !== undefined ? endpoint : role,
					...filter,
					id_agent: role === ROLES.AGENT ? user?.id : undefined,
					...payload,
				},
				{ enabled: !!detailUrl && !!filter?.id, staleTime: 1 },
			);
			useCommonData('agentLevels', API_ENDPOINTS.dic.agentLevel, {
				enabled: !agentLevels?.length && !!showPermission,
			});
			const { data: content }: any = getAll();
			const listData = content?.list || content || [];
			// CHANGE STATE----/
			useEffect(() => {
				if (data) {
					if (data?.id) {
						setGlobalFilter('itemId', data?.id);
					}
					if (detailUrl) {
						setGlobalFilter(
							'logUrl',
							`${endpoint !== undefined ? endpoint : role}${detailUrl}`,
						);
					}
					setFilter((prev: any) => ({ ...prev, id: (data as any).id }));
				}
			}, [data]);

			// LOGIC HANDLE----/
			const onPageChange = (newPage: any) => {
				setFilter((prev: any) => ({ ...prev, page_num: newPage }));
			};

			const newListData = useMemo(() => {
				if (!Array.isArray(listData)) return [];
				return listData?.map((item: any) => {
					if (
						item?.permission_doc &&
						typeof item?.permission_doc === 'string' &&
						agentLevels?.length
					) {
						item.permission_doc = item.permission_doc?.split(';');
						item.permissions = agentLevels?.filter((level: any) =>
							item.permission_doc?.includes(level.id.toString()),
						);
					}
					return item;
				});
			}, [agentLevels, listData]);
			
			const handleClose = () => {
				onClose();
				setGlobalFilter('logUrl', undefined);
				setGlobalFilter('itemId', undefined);
			};
			// RENDER----/
			return (
				<HeroModal
					isOpen={isOpen}
					onClose={handleClose}
					size={size ?? '5xl'}
					classNames={{
						closeButton:
							'text-xl right-1.5 hover:cursor-pointer text-secondary p-1.5',
					}}
					{...modalProps}
					isKeyboardDismissDisabled={false}
					onKeyDown={(e) => {
						if (e.key === 'Escape') {
							handleClose();
						}
					}}
				>
					<ModalContent ref={ref} tabIndex={-1}>
						{title && (
							<ModalHeader className="text-secondary text-sm">
								{title || 'Chi tiết'}
							</ModalHeader>
						)}
						<ModalBody>
							<>
								{ContentComponent ? <ContentComponent data={data} /> : null}
								{listData && tableColumns && (
									<DataTable
										data={showPermission ? newListData : listData}
										columns={tableColumns.filter(
											(col) => col.accessorKey !== 'actions',
										)}
										isPagination={false}
										isToolbar={false}
										onPageChange={onPageChange}
										page={filter.page_num}
										toolbar={{
											onSearch: (value) => {
												setFilter((prev: any) => ({ ...prev, info: value }));
											},
											hiddenFilters: true,
										}}
										{...tableOptions}
										className="max-h-[80vh] overflow-auto"
									/>
								)}
							</>
						</ModalBody>
					</ModalContent>
				</HeroModal>
			);
		},
	),
);
DetailModal.displayName = 'DetailModal';
