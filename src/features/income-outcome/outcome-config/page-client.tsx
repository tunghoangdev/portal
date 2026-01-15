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
const logColumns = getColumns<any>(listColumns, { isLog: true });
const MODAL_TITLE = ' mục chi';
export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const basePath = API_ENDPOINTS[role].incomeOutcome.outcome;
	// CRUD HOOKS
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
	});
	const { getInfinite, create, update, deleteConfirm } = useCrud(
		queryKey,
		queryParams,
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
					title: `Lịch sử ${MODAL_TITLE}`,
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
					title: `Cập nhật ${MODAL_TITLE}`,

					formData,
					onSubmit: async (values: any) => {
						if (!formData?.id && !values?.id) {
							toast.error(`Không tìm thấy ${MODAL_TITLE}`);
							return;
						}
						const payload = {
							...values,
							id: formData?.id,
						};
						await updateProductMutation(payload);
					},
				},
				[CRUD_ACTIONS.ADD]: {
					formData: initialFormValues,
					title: `Tạo mới ${MODAL_TITLE}`,
					onSubmit: async (values: any) => {
						await createProductMutation(values);
					},
				},
			};
			openFormModal(action as ToolbarAction, {
				title: typeMap[action].title,
				size: 'md',
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
		<>
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
					right: ['actions'],
				}}
				toolbar={{
					canAdd: true,
				}}
			/>
		</>
	);
}
