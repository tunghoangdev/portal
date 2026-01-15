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
import { ConfigLevel } from './config-level';
import { Icons } from '~/components/icons';

const columns = getColumns<any>(listColumns, {
	actions: [
		CRUD_ACTIONS.CONFIG_LEVEL,
		CRUD_ACTIONS.LOG,
		CRUD_ACTIONS.EDIT,
		CRUD_ACTIONS.LOCK_ACCESS,
		CRUD_ACTIONS.UNLOCK_ACCESS,
		// CRUD_ACTIONS.DELETE,
	
	],
});

const logColumns = getColumns<any>(listColumns, {
	isLog: true
});

export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const basePath = API_ENDPOINTS[role].customers;
	const { openFormModal, closeModal, openDetailModal } = useModal();
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		endpoint: 'root',
		rangeFilter: true,
	});

	const { getInfinite, create, update, deleteConfirm, updateConfirm } = useCrud(
		queryKey,
		queryParams,
		{
			enabled: isQueryEnabled,
		}
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
	const { mutateAsync: createProductMutation ,isPending: isCreating} = create();
	const { mutateAsync: updateProductMutation } = update();
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if(action === CRUD_ACTIONS.CONFIG_LEVEL){
				openDetailModal(formData, {
					title: `Cấu hình cấp bậc - ${formData?.company_name}`,
					renderContent: () => <ConfigLevel data={formData} />,
				});
				return
			}
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(formData, {
					title: 'Xóa khách hàng',
					message: `Bạn có muốn xóa khách hàng ${formData?.customer_name} không?`,
				});
				return;
			}
			if (action === CRUD_ACTIONS.LOCK_ACCESS || action === CRUD_ACTIONS.UNLOCK_ACCESS) {
				await updateConfirm(formData, {
					title: 'Khoá khách hàng',
					message: `Bạn có muốn khoá khách hàng ${formData?.customer_name} không?`,
					_customUrl: basePath.lock,
				});
				return;
			}
		
			if (action === CRUD_ACTIONS.LOG) {
				openDetailModal(formData, {
					title: 'Lịch sử khách hàng',
					detailUrl: basePath.logList,
					tableColumns: logColumns,
					tableOptions: {
						enabled: true,
						endpoint: 'root'
					},
				});
				return;
			}

			const typeMap: any = {
				[CRUD_ACTIONS.EDIT]: {
					title: 'Cập nhật khách hàng',
					formData,
					onSubmit: async (values: any) => {
						if (!formData?.id && !values?.id) {
							toast.error('Không tìm thấy khách hàng');
							return;
						}
						const payload = {
							...formData,
							...values,
							birthday: values.birthday || '',
							id_bank: values.id_bank || '',
							issued_date: values.issued_date || '',
							id: formData?.id,
							tax_number: values.id_number || '',
						};
						await updateProductMutation(payload);
					},
				},
				[CRUD_ACTIONS.ADD]: {
					formData: initialFormValues,
					title: 'Tạo mới khách hàng',
					onSubmit: async (values: any) => {
						const payload = {
							...initialFormValues,
							...values,
							tax_number: values.id_number || '',
						};
						await createProductMutation(payload, {
							onSuccess: (data) => {
								if (!data.error_code) {
									closeModal();
								}
							},
						});
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
						await typeMap[action].onSubmit(values);
					} catch (error) {
						console.error('Failed to submit item:', error);
						throw error;
					}
				},
				onFormSubmitSuccess: () => {
					// closeModal();
				},
				isLoading: isCreating,
			});
		},
		[
			openFormModal,
			updateProductMutation,
			createProductMutation,
			deleteConfirm,
			isCreating,
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
			columnPinningConfig={{
				left: ['key_code'],
				right: ['actions'],
			}}
			toolbar={{
				canAdd: true,
			}}
			customActions={[
					{
					type: CRUD_ACTIONS.CONFIG_LEVEL,
					label: 'Cấu hình cấp bậc',
					icon: <Icons.settings size={16} />,
				},
			
				{
					type: CRUD_ACTIONS.EDIT,
					label: 'Cập nhật',
					isHidden: (row: any) => row?.is_lock,
				},
				{
					type: CRUD_ACTIONS.LOCK_ACCESS,
					label: 'Khoá',
					icon: <Icons.lock size={16} />,
					isHidden: (row: any) => row?.is_lock,
				},
					{
					type: CRUD_ACTIONS.UNLOCK_ACCESS,
					label: 'Mở khoá',
					icon: <Icons.lockOpen size={16} />,
					isHidden: (row: any) => !row?.is_lock,
				},
				// 	{
				// 	type: CRUD_ACTIONS.DELETE,
				// 	label: 'Xóa',
				// 	isHidden: (row: any) => row?.is_lock,
				// },

			]}
		/>
	);
}
