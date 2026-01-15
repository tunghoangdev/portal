import { useCallback, useEffect, useState } from 'react';
import { useAuth, useDataQuery, useFilter, useModal, useTableColumns } from '~/hooks';
import { CRUD_ACTIONS, ROLES } from '~/constant';
import {
	lifeProductDetailColumns,
	getColumns,
	processingColumns,
} from '~/features/shared/common';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { TItemFormFields } from '~/types/form-field';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { DataTable } from '~/features/shared/components/data-table';
import { useCrud } from '~/hooks/use-crud-v2';
import { FormView } from './form-view';
import { formSchema, initialFormValues } from './form.schema';
import { Icons } from '~/components/icons';
import { lifeContractCommissionColumns } from '~/components/table-columns';
import { FormViewNew } from './form-view-new';
const commissionColumns = getColumns<any>(lifeContractCommissionColumns);

const detailColumns = getColumns<any>(lifeProductDetailColumns);

export default function LifeContractIndividual() {
	// GLOBALS STATE
	const { role, user } = useAuth();
	const { agentId } = useFilter();
	const { columns } = useTableColumns(processingColumns, {
			showMonthYear: true,
			actions: [	CRUD_ACTIONS.EDIT,
		CRUD_ACTIONS.VIEW,
		CRUD_ACTIONS.DELETE,
		CRUD_ACTIONS.COMMISON_LIST,],
		});	

	const { openFormModal, openDetailModal, closeModal } = useModal();
	const [editItemId, setEditItemId] = useState('');
	const basePathDetail = API_ENDPOINTS[ROLES.AGENT].lifeInsurance.processing;
	const { getAll, deleteConfirm } = useCrud(
		[basePathDetail.get, editItemId],
		{
			endpoint: ROLES.AGENT,
			id: +editItemId,
		},
		{
			enabled: !!editItemId,
			staleTime: 1,
		},
	);
	const basePath = API_ENDPOINTS[ROLES.AGENT].individual.lifeInsurance;
	const basePath2 = API_ENDPOINTS[ROLES.STAFF].lifeInsurance.processing;

	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
		filter: {
			provider_code: true,
			contract_type: true,
		},
	});
	// CRUD API HOOK
	const { getInfinite, updateConfirm } = useCrud(queryKey, {
		...queryParams,
		id_agent: agentId,
	});
	const {
		isFetchingNextPage,
		isFetching,
		listData,
		total,
		hasNextPage,
		fetchNextPage,
	} = getInfinite();
	const { data: itemDetail }: any = getAll();

	useEffect(() => {
		if (!itemDetail || !editItemId) return;
		openFormModal(CRUD_ACTIONS.EDIT, {
			itemSchema: formSchema,
			renderFormContent: itemDetail?.id_life_type > 1 ? FormView : FormViewNew,
			formData: {
				...itemDetail,
				number_contract: itemDetail?.number_contract?.toString(),
				id_agent: itemDetail?.id_agent?.toString(),
				id_customer: itemDetail?.id_customer?.toString(),
				list_sub_product: itemDetail?.list_sub_product,
				// list_sub_product: itemDetail?.list_sub_product?.map((item: any) => ({
				// 	...item,
				// 	fee: item?.fee?.toString(),
				// 	id_life_product: item?.id_life_product?.toString(),
				// })),
			},
			title: 'Cập nhật hợp đồng',
			onItemSubmit: async (values: any) => {
				const payload = {
					...values,
					id: itemDetail?.id,
					_customUrl: basePath2.update,
					_closeModal: false,
				};
				await updateMutation(payload, {
					onSuccess(data) {
						if (data?.status === 1) {
							closeModal();
							setEditItemId(''); // Reset ID để modal không mở lại
						}
					},
				});
			},
			// onFormSubmitSuccess: () => {
			// 	setEditItemId('');
			// },
			modalProps: {
				onClose: () => {
					setEditItemId('');
					closeModal();
				},
			},
		});
	}, [itemDetail, editItemId]);

	const { create, update } = useCrud([basePath.updateStatus], {
		endpoint: '',
	});
	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateMutation } = update();

	const handleCrudAction = useCallback(
		(action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.EDIT) {
				setEditItemId(String(formData?.id));
				return;
			}

			if (action === CRUD_ACTIONS.DELETE) {
				deleteConfirm(formData, {
					title: 'Xóa hợp đồng',
					message: 'Bạn có chắc chắn muốn xóa hợp đồng?',
					_customUrl: basePathDetail.delete,
					_queryKey: queryKey,
				});
				return;
			}

			const isForm = (
				[CRUD_ACTIONS.ADD, CRUD_ACTIONS.EDIT] as string[]
			).includes(action as string);

			if (isForm) {
				const typeMap: any = {
					[CRUD_ACTIONS.ADD]: {
						itemSchema: formSchema,
						renderFormContent:
							formData?.contractType === 'new' ? FormViewNew : FormView,
						formData: {
							...initialFormValues,
							id_agent: user?.id?.toString(),
							agent_phone: user?.agent_phone,
							id_life_type: formData?.contractType === 'new' ? '1' : '2',
							list_sub_product: [],
						},
						title: 'Tạo mới hợp đồng',
						onSubmit: async (values: any) => {
							const payload = {
								...values,
								_customUrl: basePath2.create,
								_queryKey: queryKey,
								_closeModal: false,
							};
							await createProductMutation(payload, {
								onSuccess(data) {
									if (data?.status === 1) {
										closeModal();
									}
								},
							});
						},
					},
				};
				openFormModal(action as ToolbarAction, {
					itemSchema: typeMap[action].itemSchema,
					renderFormContent: typeMap[action].renderFormContent,
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
					// onFormSubmitSuccess: () => {
					// 	refetch();
					// },
				});
			} else {
				const typeMap: any = {
					[CRUD_ACTIONS.VIEW]: {
						title: 'Chi tiết hợp đồng',
						tableColumns: detailColumns,
						detailUrl: API_ENDPOINTS[ROLES.AGENT].lifeInsurance.detail.list,
						tableOptions: {
							endpoint: ROLES.AGENT,
							enabled: true,
						},
					},
					[CRUD_ACTIONS.COMMISON_LIST]: {
						title: 'Danh sách phân bổ thưởng',
						tableColumns: commissionColumns,
						detailUrl: API_ENDPOINTS[role]?.lifeInsurance?.done?.commission,
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
			updateConfirm,
			updateMutation,
		],
	);
	return (
		<DataTable
			data={listData}
			columns={columns}
			onAction={handleCrudAction}
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
				// canAdd: user?.id_agent_status === 2,
				customAdd: user?.id_agent_status === 2,
				addLabel: 'Tạo hợp đồng mới',
			}}
			filterFields={['provider', 'contractType']}
			customActions={[
				{
					type: CRUD_ACTIONS.EDIT,
					label: 'Cập nhật',
					isHidden: (formData: any) => formData?.id_life_status > 1,
				},
				{
					type: CRUD_ACTIONS.DELETE,
					label: 'Xóa',
					isHidden: (formData: any) => formData?.id_life_status > 1,
				},
				{
					type: CRUD_ACTIONS.COMMISON_LIST,
					label: 'Phân bổ thưởng',
					icon: <Icons.dollarSign size={14} />,
					isHidden: (row: any) => {
						return row?.id_life_status !== 4;
					},
				},
			]}
		/>
	);
}
