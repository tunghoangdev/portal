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
import { AbroadBaseColumns } from '../base-columns';
import { columnsDetail } from '../detail-columns';
import { baseCommissionColumns } from '../commission-columns';

const commissionColumns = getColumns<any>(baseCommissionColumns);
const detailColumns = getColumns<any>(columnsDetail);
export default function ListProcessingPageClient() {
	// Store
	const { role, user } = useAuth();
	const { columns } = useTableColumns(AbroadBaseColumns, {
		showMonthYear: true,
		actions: [
			CRUD_ACTIONS.EDIT,
			CRUD_ACTIONS.VIEW,
			CRUD_ACTIONS.DELETE,
			CRUD_ACTIONS.COMMISON_LIST,
		],
	});

	const { openFormModal, openDetailModal, closeModal } = useModal();
	// State

	const basePath = API_ENDPOINTS[role].individual.abroad;
	const basePath2 = API_ENDPOINTS[ROLES.STAFF].abroad.processing;

	const [editItemId, setEditItemId] = useState('');
	// API CRUD
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
		filter: {
			provider_code: true,
		},
	});
	const { getInfinite, deleteConfirm } = useCrud(queryKey, queryParams);

	const { getOne } = useCrud(
		[basePath2.get, editItemId],
		{
			endpoint: '',
			id: +editItemId,
		},
		{
			enabled: !!editItemId,
			staleTime: 1,
		},
	);

	const { data: itemDetail }: any = getOne();
	const { updateConfirm, create, update } = useCrud([basePath.list], {
		endpoint: '',
	});

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
							formData?.id_abroad_status > 1
								? 'Hủy duyệt hợp đồng'
								: 'Duyệt hợp đồng',
						message:
							formData?.id_abroad_status > 1
								? `Bạn có chắc chắn muốn hủy duyệt hợp đồng số ${formData?.number_contract}?`
								: `Duyệt hợp đồng hợp đồng số ${formData?.number_contract}?`,
						_customUrl: basePath2.approve,
						_queryKey: queryKey,
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
						_customUrl: basePath2.delete,
						_customEndpoint: '',
						_queryKey: queryKey,
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
				openFormModal(action as ToolbarAction, {
					itemSchema: formSchema,
					renderFormContent: FormView,
					formData: {
						...initialFormValues,
						agent_id: user?.id?.toString(),
						agent_phone: user?.agent_phone,
					},
					title: 'Tạo mới hợp đồng',
					onItemSubmit: async (values: TItemFormFields) => {
						try {
							await createProductMutation(
								{
									...values,
									_customUrl: basePath2.create,
									_queryKey: queryKey,
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
						} catch (error) {
							console.error('Failed to submit item:', error);
							throw error;
						}
					},
				});
			} else {
				const typeMap: any = {
					[CRUD_ACTIONS.VIEW]: {
						title: 'Chi tiết hợp đồng',
						tableColumns: detailColumns,
						detailUrl: API_ENDPOINTS[role].abroad.detail.list,
						tableOptions: {
							endpoint: role,
							enabled: true,
						},
					},
					[CRUD_ACTIONS.COMMISON_LIST]: {
						title: 'Danh sách phân bổ thưởng',
						tableColumns: commissionColumns,
						detailUrl: basePath.commission,
						tableOptions: {
							endpoint: role,
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
		if (!editItemId || !itemDetail) return;
		openFormModal(CRUD_ACTIONS.EDIT, {
			itemSchema: formSchema,
			renderFormContent: FormView,
			formData: {
				...itemDetail,
				id_abroad_provider: itemDetail?.id_abroad_provider?.toString(),
				id_agent: itemDetail?.id_agent?.toString(),
				id_customer: itemDetail?.id_customer?.toString(),
				// id_none_life_product: currentProduct.id_none_life_product?.toString(),
				// fee: currentProduct.fee?.toString(),
				list_product: itemDetail?.list_product,
			},
			title: 'Cập nhật hợp đồng',
			onItemSubmit: async (values: any) => {
				const payload = {
					...values,
					id: itemDetail?.id,
					// id_none_life_product: undefined,
					// fee: undefined,
					// list_product: [
					// 	{
					// 		fee: values.fee,
					// 		id_none_life_product: values.id_none_life_product,
					// 	},
					// ],
					_customUrl: basePath2.update,
					_closeModal: false,
				};
				await updateProductMutation(payload, {
					onSuccess(data) {
						if (data?.status === 1) {
							closeModal();
							setEditItemId(''); // Reset ID để modal không mở lại
						}
					},
				});
			},
			modalProps: {
				onClose: () => {
					setEditItemId('');
					closeModal();
				},
			},
		});
	}, [itemDetail]);

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
				canAdd: user?.id_agent_status === 2,
				addLabel: 'Tạo hợp đồng',
			}}
			customActions={[
				{
					type: CRUD_ACTIONS.COMMISON_LIST,
					label: 'Phân bổ thưởng',
					icon: <Icons.dollarSign size={14} />,
					isHidden: (row: any) => {
						return row?.id_abroad_status !== 3;
					},
				},
				{
					type: CRUD_ACTIONS.EDIT,
					label: 'Cập nhật',
					isHidden(row: any) {
						return row?.id_abroad_status > 1;
					},
				},
				{
					type: CRUD_ACTIONS.DELETE,
					label: 'Xóa',

					isHidden(row: any) {
						return row?.id_abroad_status > 1;
					},
				},
			]}
			filterFields={['provider']}
		/>
	);
}
