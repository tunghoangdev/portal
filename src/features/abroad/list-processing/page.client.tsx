import { useCallback, useEffect, useState } from 'react'; // Thêm useRef, useCallback
import { useAuth, useDataQuery, useModal, useTableColumns } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS, ROLES } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import type { TItemFormFields } from '~/types/form-field';
import { useCrud } from '~/hooks/use-crud-v2';
import { Icons } from '~/components/icons';
import { FormView } from './form-view';
import { formSchema, initialFormValues } from './form.schema';
import { getColumns } from '~/features/shared/common';
import { toast } from 'sonner';
import { BaseColumns } from './columns';
import { columnsDetail } from './detail-columns';

const detailColumns = getColumns<any>(columnsDetail);

export default function ListProcessingPageClient() {
	// Store
	const { role } = useAuth();
	const { openFormModal, openDetailModal, closeModal } = useModal();
	const { columns, logColumns } = useTableColumns(BaseColumns, {
		showMonthYear: true,
		// showLevel: true,
		actions: [
			CRUD_ACTIONS.LOG,
			CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
			CRUD_ACTIONS.EDIT,
			CRUD_ACTIONS.VIEW,
			CRUD_ACTIONS.DELETE,
		],
		omitKeys: ['period_name'],
	});
	const [editItemId, setEditItemId] = useState('');
	const basePath = API_ENDPOINTS[ROLES.STAFF].abroad;
	// API CRUD
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.processing.list,
		rangeFilter: true,
		filter: {
			provider_code: true,
		},
	});
	const { getInfinite, deleteConfirm } = useCrud(queryKey, queryParams, {
		enabled: isQueryEnabled,
	});
	const { getOne } = useCrud(
		[basePath.processing.get, editItemId],
		{
			endpoint: '',
			id: +editItemId,
		},
		{
			enabled: !!editItemId,
			staleTime: 1,
		},
	);
	const { updateConfirm, create, update } = useCrud(
		[basePath.processing.list],
		{
			endpoint: '',
		},
	);
	const { data: itemDetail }: any = getOne();
	const {
		isFetchingNextPage,
		isFetching,
		listData,
		total,
		hasNextPage,
		fetchNextPage,
	}: any = getInfinite();

	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateProductMutation } = update();
	const handleCrudAction = useCallback(
		async (action: CrudActionType | string, formData?: TItemFormFields) => {
			if (
				action === CRUD_ACTIONS.APPROVE_CONTRACT ||
				action === CRUD_ACTIONS.CANCEL_APPROVE_CONTRACT
			) {
				await updateConfirm(
					{ id: formData?.id },
					{
						title:
							formData?.id_none_life_status > 1
								? 'Hủy duyệt hợp đồng'
								: 'Duyệt hợp đồng',
						message:
							formData?.id_none_life_status > 1
								? `Bạn có chắc chắn muốn hủy duyệt hợp đồng số ${formData?.number_contract}?`
								: `Duyệt hợp đồng hợp đồng số ${formData?.number_contract}?`,
						_customUrl: basePath.processing.approve,
					},
				);
				return;
			}
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(
					{ id: formData?.id },
					{
						title: 'Xác nhận xóa hợp đồng',
						message: `Bạn có chắc chắn muốn xóa hợp đồng số ${formData?.number_contract}?`,
						_customUrl: basePath.processing.delete,
						_customEndpoint: '',
					},
				);
				return;
			}
			const isForm = (
				[CRUD_ACTIONS.ADD, CRUD_ACTIONS.EDIT] as string[]
			).includes(action as string);

			if (isForm) {
				if (action === CRUD_ACTIONS.EDIT) {
					setEditItemId(String(formData?.id));
					return;
				}
				const typeMap: any = {
					[CRUD_ACTIONS.ADD]: {
						formData: initialFormValues,
						title: 'Tạo mới hợp đồng',
						onSubmit: async (values: any) => {
							await createProductMutation(
								{
									...values,
									_customUrl: basePath.processing.create,
									_closeModal: false,
								},
								{
									onSuccess(data) {
										if (data?.status === 1) {
											closeModal();
										}
									},
								},
							);
						},
					},
				};
				openFormModal(action as ToolbarAction, {
					itemSchema: formSchema,
					renderFormContent: FormView,
					formData: typeMap[action].formData,
					title: typeMap[action].title,
					onItemSubmit: async (values: TItemFormFields) => {
						try {
							await typeMap[action].onSubmit(values);
						} catch (error) {
							console.error('Failed to submit item:', error);
							throw error;
						}
					},
				});
			} else {
				const newLogColumns = logColumns.filter(
					(item: any) => !item?.prop?.startsWith('level_'),
				);
				const typeMap: any = {
					[CRUD_ACTIONS.VIEW]: {
						title: 'Chi tiết hợp đồng',
						tableColumns: detailColumns,
						detailUrl: basePath.detail.list,
						tableOptions: {
							endpoint: ROLES.AGENT,
							enabled: true,
						},
					},
					[CRUD_ACTIONS.LOG]: {
						title: 'Lịch sử hợp đồng',
						tableColumns: newLogColumns,
						detailUrl: basePath.common.logList,
						tableOptions: {
							endpoint: ROLES.STAFF,
							enabled: true,
						},
					},
				};
				openDetailModal(formData, {
					...typeMap?.[action],
				});
			}
		},
		[
			openFormModal,
			openDetailModal,
			createProductMutation,
			updateProductMutation,
		],
	);

	useEffect(() => {
		if (!itemDetail || !editItemId) return;
		openFormModal(CRUD_ACTIONS.EDIT, {
			itemSchema: formSchema,
			renderFormContent: FormView,
			formData: {
				...itemDetail,
				id_none_life_provider: itemDetail?.id_none_life_provider?.toString(),
				id_agent: itemDetail?.id_agent?.toString(),
				list_product: itemDetail?.list_product?.map((item: any) => ({
					...item,
					fee: item?.fee?.toString(),
					id_none_life_product: item?.id_none_life_product?.toString(),
				})),
			},
			title: 'Cập nhật hợp đồng',
			onItemSubmit: async (values: any) => {
				if (!itemDetail?.id && !values?.id) {
					toast.error('Không tìm hợp đồng');
					return;
				}
				const payload = {
					...values,
					id: itemDetail?.id,

					_customUrl: basePath.processing.update,
					_closeModal: false,
				};
				await updateProductMutation(payload, {
					onSuccess(data) {
						if (data?.status === 1) {
							closeModal();
							setEditItemId('');
						}
					},
				});
			},
			onFormSubmitSuccess: () => {
				setEditItemId('');
			},
			modalProps: {
				onClose: () => {
					closeModal();
					setEditItemId('');
				},
			},
		});
	}, [itemDetail, openFormModal]);

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
			onAction={handleCrudAction}
			toolbar={{
				canAdd: role === ROLES.STAFF,
				addLabel: 'Tạo hợp đồng',
			}}
			filterFields={['provider']}
			customActions={[
				{
					type: CRUD_ACTIONS.LOG,
					label: 'Xem lịch sử',
					isHidden(row: any) {
						return role === ROLES.AGENT;
					},
				},
				{
					type: CRUD_ACTIONS.VIEW,
					label: 'Xem chi tiết',
				},
				{
					type: CRUD_ACTIONS.DELETE,
					label: 'Xóa hợp đồng',
					isHidden(row: any) {
						return role === ROLES.AGENT || row?.id_abroad_status > 1;
					},
				},
				{
					type: CRUD_ACTIONS.EDIT,
					label: 'Cập nhật',
					// icon: <Icons.edit size={14} />,
					isHidden(row: any) {
						return row?.id_abroad_status > 1 || role === ROLES.AGENT;
					},
				},
				{
					type: CRUD_ACTIONS.APPROVE_CONTRACT,
					label: 'Duyệt hợp đồng',
					icon: <Icons.circleCheck size={14} />,
					isHidden: (row: any) => {
						return row?.id_abroad_status !== 1 || role === ROLES.AGENT;
					},
				},
				{
					type: CRUD_ACTIONS.CANCEL_APPROVE_CONTRACT,
					label: 'Hủy duyệt hợp đồng',
					icon: <Icons.close size={14} />,
					isHidden(row: any) {
						return row?.id_abroad_status === 1 || role === ROLES.AGENT;
					},
				},
			]}
		/>
	);
}
