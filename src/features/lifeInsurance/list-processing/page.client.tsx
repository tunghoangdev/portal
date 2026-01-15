import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useCommon, useFilter, useModal } from '~/hooks';
import { CRUD_ACTIONS, DEFAULT_PARAMS, ROLES } from '~/constant';
import {
	lifeProductDetailColumns,
	columnMonthYears,
	processingColumns,
	getColumns,
	actionInfoColumns,
} from '~/features/shared/common';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { toast } from 'sonner';
import type { TItemFormFields } from '~/types/form-field';
import { LifeContractStatusForm } from '~/components/common/forms';
import { lifeContractStateSchema } from '~/schema-validations';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { DataTable } from '~/features/shared/components/data-table';
import { useCrud } from '~/hooks/use-crud-v2';
import { FormViewNew } from './form-view-new';
import { formSchema, initialFormValues } from './form.schema';
import { Icons } from '~/components/icons';
import { FormView } from './form-view';
import { createColumnUserDef } from '~/features/shared/common/create-column';
const newColumns = [...processingColumns, ...columnMonthYears()];
const columns = getColumns<any>(newColumns, {
	omitKeys: ['period_name', 'commission_date'],
	// actions: [
	// 	CRUD_ACTIONS.LOG,
	// 	CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
	// 	CRUD_ACTIONS.EDIT,
	// 	CRUD_ACTIONS.VIEW,
	// 	CRUD_ACTIONS.DELETE,
	// ],
});
const detailColumns = getColumns<any>(lifeProductDetailColumns);
export default function LifeContractProcessing() {
	// GLOBALS STATE
	const { role } = useAuth();
	const { periodDate } = useCommon();
	const { providerSelected, contractTypeSelected } = useFilter();
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
			// placeholderData: keepPreviousData,
		},
	);
	// LOCAL STATE
	const [filter, setFilter] = useState(DEFAULT_PARAMS);

	const { getAll: getAllAgentLevel } = useCrud([API_ENDPOINTS.dic.agentLevel], {
		endpoint: '',
		listUrl: 'dic',
	});
	const { data: agentLevelList }: any = getAllAgentLevel();
	const levelColumns = useMemo(() => {
		if (!agentLevelList?.length) return [];
		return agentLevelList.map(createColumnUserDef('level_', ''));
	}, [agentLevelList]);

	const basePath = API_ENDPOINTS[ROLES.STAFF].lifeInsurance.processing;
	const listQueryKey = [
		basePath.list,
		filter,
		periodDate,
		contractTypeSelected,
		providerSelected,
	];
	// CRUD API HOOK
	const { getInfinite, updateConfirm } = useCrud(
		listQueryKey,
		{
			endpoint: role,
			...filter,
			...periodDate,
			provider_code: providerSelected,
			contract_type: contractTypeSelected,
		},
		{
			enabled: !!periodDate,
		},
	);
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
		if (!itemDetail && !editItemId) return;
		openFormModal(CRUD_ACTIONS.EDIT, {
			itemSchema: formSchema,
			renderFormContent: itemDetail?.id_life_type > 1 ? FormView : FormViewNew,
			formData: {
				...itemDetail,
				number_contract: itemDetail?.number_contract?.toString(),
				id_agent: itemDetail?.id_agent?.toString(),
				list_sub_product: itemDetail?.list_sub_product?.map((item: any) => ({
					...item,
					fee: item?.fee?.toString(),
					id_life_product: item?.id_life_product?.toString(),
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
					id: itemDetail?.id?.toString(),
					_customUrl: basePath.update,
					_closeModal: false,
				};
				await updateMutation(payload, {
					onSuccess(data) {
						if (data?.status === 1) {
							closeModal();
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

	const { create, update } = useCrud([basePath.updateStatus], {
		endpoint: '',
	});
	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateMutation } = update();

	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE) {
				deleteConfirm(formData, {
					title: 'Xóa hợp đồng',
					message: 'Bạn có chắc chắn muốn xóa hợp đồng?',
					_customUrl: basePathDetail.delete,
					// _queryKey: listQueryKey,
				});
				return;
			}
			const isForm = (
				[
					CRUD_ACTIONS.ADD,
					CRUD_ACTIONS.EDIT,
					CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
				] as string[]
			).includes(action as string);

			if (isForm) {
				// if (!selectType && action === CRUD_ACTIONS.ADD) {
				// 	const tempContainer = document.createElement('div');
				// 	const root = createRoot(tempContainer);
				// 	root.render(<ChoseOption onChange={setSelectType} />);
				// 	const res = await confirm({
				// 		title: 'Chọn loại hợp đồng',
				// 		html: tempContainer,
				// 		cancelButtonText: 'Hủy',
				// 		confirmButtonText: 'Đồng ý',
				// 		icon: 'warning',
				// 		didDestroy: () => {
				// 			root.unmount();
				// 		},
				// 	});
				// 	if (res.isConfirmed) {
				// 		setActionType(action);
				// 	}
				// 	if (res.isDismissed) {
				// 		setActionType('');
				// 		setSelectType('');
				// 	}
				// 	return;
				// }
				if (action === CRUD_ACTIONS.EDIT) {
					setEditItemId(String(formData?.id));
					return;
				}
				const typeMap: any = {
					[CRUD_ACTIONS.ADD]: {
						itemSchema: formSchema,
						renderFormContent:
							formData?.contractType === 'new' ? FormViewNew : FormView,
						formData: {
							...initialFormValues,
							id_life_type: formData?.contractType === 'new' ? '1' : '2',
						},
						title: 'Tạo mới hợp đồng',
						onSubmit: async (values: any) => {
							const payload = {
								...values,
								id: undefined,
								_customUrl: basePath.create,
								_closeModal: false,
								_queryKey: listQueryKey,
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
					[CRUD_ACTIONS.UPDATE_CONTRACT_STATUS]: {
						itemSchema: lifeContractStateSchema,
						renderFormContent: LifeContractStatusForm,
						formData,
						title: 'Cập nhật trạng thái hợp đồng',
						onSubmit: async (values: any) => {
							if (!formData?.id && !values?.id) {
								toast.error('Không tìm thấy hợp đồng');
								return;
							}
							const payload = {
								...values,
								id: formData?.id,
								_queryKey: listQueryKey,
							};
							await updateConfirm(payload, {
								title: 'Xác nhận cập nhật trạng thái',
								message: 'Bạn có chắc chắn muốn cập nhật trạng thái hợp đồng?',
								_customUrl: basePath.updateStatus,
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
					[CRUD_ACTIONS.LOG]: {
						title: 'Lịch sử hợp đồng',
						tableColumns: tableCol.logColumns,
						detailUrl: API_ENDPOINTS[role]?.lifeInsurance?.common?.logList,
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
	const tableCol = useMemo(() => {
		const baseColumns = [
			...columns,
			...getColumns<any>(levelColumns?.flat()),
			...getColumns<any>([
				{
					title: 'Thao tác',
					key: 'actions',
					align: 'center',
					actions: [
						CRUD_ACTIONS.LOG,
						CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
						CRUD_ACTIONS.EDIT,
						CRUD_ACTIONS.VIEW,
						CRUD_ACTIONS.DELETE,
					],
				},
			]),
		];
		return {
			columns: baseColumns,
			logColumns: [
				...getColumns<any>(actionInfoColumns),
				...baseColumns.map((item) => ({
					...item,
					meta: { ...item.meta, summary: undefined },
				})),
			],
		};
	}, [columns, levelColumns]);

	return (
		<DataTable
			data={listData}
			columns={tableCol.columns}
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
				showReport: true,
				// canAdd: true,
				customAdd: true,
				addLabel: 'Tạo hợp đồng mới',
				onSearch: (value) => {
					setFilter({ ...filter, info: value });
				},
				// endContent: <FormView refetch={refetch} />,
			}}
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
					type: CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
					label: 'Tiến trình hợp đồng',
					icon: <Icons.circleCheck size={16} strokeWidth={1.5} />,
				},
			]}
			filterFields={['provider', 'contractType']}
		/>
	);
}
