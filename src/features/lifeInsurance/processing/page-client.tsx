import { useCallback, useEffect, useState } from 'react';
import { useAuth, useDataQuery, useModal, useTableColumns } from '~/hooks';
import { CRUD_ACTIONS, ROLES } from '~/constant';
import {
	lifeProductDetailColumns,
	processingColumns,
	getColumns,
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

const detailColumns = getColumns<any>(lifeProductDetailColumns);
export default function ProcessingClient() {
	// GLOBALS STATE
	const { role } = useAuth();
	const { openFormModal, openDetailModal, closeModal } = useModal();
	const { columns, logColumns } = useTableColumns(processingColumns, {
		showMonthYear: true,
		showLevel: true,
		omitKeys: ['period_name', 'commission_date'],
		actions: [
			CRUD_ACTIONS.LOG,
			CRUD_ACTIONS.UPDATE_CONTRACT_STATUS,
			CRUD_ACTIONS.EDIT,
			CRUD_ACTIONS.VIEW,
			CRUD_ACTIONS.DELETE,
			CRUD_ACTIONS.CANCEL_CONTRACT,
		],
	});

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
	const basePath = API_ENDPOINTS[ROLES.STAFF].lifeInsurance.processing;

	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		rangeFilter: true,
		filter: {
			provider_code: true,
			contract_type: true,
		},
	});

	// CRUD API HOOK
	const { getInfinite, updateConfirm } = useCrud(queryKey, queryParams, {
		enabled: isQueryEnabled,
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
	}, [itemDetail, editItemId]);

	const { create, update } = useCrud([basePath.updateStatus], {
		endpoint: '',
	});
	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateMutation } = update();

	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.EDIT) {
				setEditItemId(String(formData?.id));
				return;
			}

			if (action === CRUD_ACTIONS.DELETE) {
				deleteConfirm(formData, {
					title: 'Xóa hợp đồng',
					message: 'Bạn có chắc chắn muốn xóa hợp đồng?',
					_customUrl: basePathDetail.delete,
					// _queryKey: listQueryKey,
				});
				return;
			}
			if (action === CRUD_ACTIONS.CANCEL_CONTRACT) {
				await updateConfirm(
					{ id: formData?.id },
					{
						title: 'Xác nhận hủy hợp đồng',
						message: 'Bạn có chắc chắn muốn hủy hợp đồng này?',
						_customUrl: basePath.cancel,
					},
				);
				return;
			}
			const isForm = (
				[CRUD_ACTIONS.ADD, CRUD_ACTIONS.UPDATE_CONTRACT_STATUS] as string[]
			).includes(action as string);

			if (isForm) {
				const typeMap: any = {
					[CRUD_ACTIONS.ADD]: {
						itemSchema: formSchema,
						renderFormContent:
							formData?.contractType === 'new' ? FormViewNew : FormView,
						formData: {
							...initialFormValues,
							id_life_type: formData?.contractType === 'new' ? '1' : '2',
							list_sub_product: [],
						},
						title: 'Tạo mới hợp đồng',
						onSubmit: async (values: any) => {
							const payload = {
								...values,
								id: undefined,
								_customUrl: basePath.create,
								_closeModal: false,
								_queryKey: queryKey,
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
						title: 'Cập nhật tiến trình hợp đồng',
						onSubmit: async (values: any) => {
							if (!formData?.id && !values?.id) {
								toast.error('Không tìm thấy hợp đồng');
								return;
							}
							const payload = {
								...values,
								id: formData?.id,
								_queryKey: queryKey,
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
				});
				return;
			}

			const newLogColumns = logColumns.filter(
				(item: any) => !item?.prop?.startsWith('level_'),
			);
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
					tableColumns: newLogColumns,
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
		<>
			{/* <InfiniteRevoGrid
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
					// showReport: true,
					customAdd: true,
					addLabel: 'Tạo hợp đồng mới',
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
					{
						type: CRUD_ACTIONS.CANCEL_CONTRACT,
						label: 'Hủy hợp đồng',
						icon: <Icons.close size={16} strokeWidth={1.5} />,
						isHidden: (formData: any) =>
							formData?.id_life_status !== 2 && formData?.id_life_status !== 3,
					},
				]}
				filterFields={['provider', 'contractType']}
			/> */}
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
					// showReport: true,
					customAdd: true,
					addLabel: 'Tạo hợp đồng mới',
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
					{
						type: CRUD_ACTIONS.CANCEL_CONTRACT,
						label: 'Hủy hợp đồng',
						icon: <Icons.close size={16} strokeWidth={1.5} />,
						isHidden: (formData: any) =>
							formData?.id_life_status !== 2 && formData?.id_life_status !== 3,
					},
				]}
				filterFields={['provider', 'contractType']}
			/>
		</>
	);
}
