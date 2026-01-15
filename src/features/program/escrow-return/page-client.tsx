import { useCallback } from 'react';
import { useAuth, useDataQuery, useModal } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { TItemFormFields } from '~/types/form-field';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { toast } from 'sonner';
import { useCrud } from '~/hooks/use-crud-v2';
import { listColumns } from './columns';
import { formSchema, initialFormValues } from './form.schema';
import { FormView } from './form-view';

const columns = getColumns<any>(listColumns, {
	actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});

const logColumns = getColumns<any>(listColumns, {
	isLog: true,
});
export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const basePath = API_ENDPOINTS?.[role]?.escrowReturn;
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		rangeFilter: true,
		periodFilter: true,
	});
	const { getInfinite, create, update, deleteConfirm } = useCrud(
		queryKey,
		queryParams,
		{
			enabled: isQueryEnabled,
		},
	);

	const {
		listData,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		total,
	}: any = getInfinite();

	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateProductMutation } = update();
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(formData);
				return;
			}
			if (action === CRUD_ACTIONS.LOG) {
				openDetailModal(formData, {
					title: 'Lịch sử hoàn trả ký quỹ',
					detailUrl: basePath.logList,
					tableColumns: logColumns,
					tableOptions: {
						enabled: true,
					},
				});
				return;
			}

			const typeMap: any = {
				[CRUD_ACTIONS.EDIT]: {
					title: 'Cập nhật ',
					formData: {
						...formData,
						amount: Math.abs(formData?.amount),
					},
					onSubmit: async (values: any) => {
						if (!formData?.id && !values?.id) {
							toast.error('Không tìm thấ thưởng kinh doanh');
							return;
						}
						const payload = {
							...values,
							id: formData?.id,
							_customUrlSegment: 'edit',
						};
						await updateProductMutation(payload);
					},
				},
				[CRUD_ACTIONS.ADD]: {
					formData: initialFormValues,
					title: 'Tạo mới',
					onSubmit: async (values: any) => {
						await createProductMutation(values);
					},
				},
			};
			openFormModal(action as ToolbarAction, {
				title: typeMap[action].title,
				itemSchema: formSchema,
				renderFormContent: FormView,
				formData: typeMap[action].formData,
				onItemSubmit: async (values: TItemFormFields) => {
					try {
						const { customer_phone, ...payload } = values;
						await typeMap[action].onSubmit({
							...payload,
							// id_agent: +payload.id_agent,
							amount: -payload.amount,
						});
					} catch (error) {
						console.error('Failed to submit item:', error);
						throw error;
					}
				},
			});
		},
		[
			openFormModal,
			updateProductMutation,
			createProductMutation,
			deleteConfirm,
			openDetailModal,
		],
	);
	return (
		<DataTable
			data={listData}
			columns={columns}
			loading={isFetching}
			isFetchingNextPage={isFetchingNextPage}
			total={total || 0}
			hasNextPage={hasNextPage}
			fetchNextPage={fetchNextPage}
			onAction={handleCrudAction}
			toolbar={{
				canAdd: true,
			}}
			customActions={[
				{
					type: CRUD_ACTIONS.DELETE,
					label: 'Xóa',
					isHidden: (formData: any) => formData?.is_system,
				},
				{
					type: CRUD_ACTIONS.EDIT,
					label: 'Cập nhật',
					isHidden: (formData: any) => formData?.is_system,
				},
			]}
		/>
	);
}
