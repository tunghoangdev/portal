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
import { docMemberInternalColumns } from '~/features/shared/common';
import { formSchema, initialFormValues } from './form.schema';
import { FormView } from './form-view';
const columns = getColumns<any>(docMemberInternalColumns, {
	actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
});
const logColumns = getColumns<any>(docMemberInternalColumns, { isLog: true });
const MODAL_TITLE = ' tài liệu nội bộ';
export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const basePath = API_ENDPOINTS[role].documents.memberInternal;
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
				await deleteConfirm(formData, {
					title: `Xóa ${MODAL_TITLE}`,
					message: `Bạn có muốn xóa ${MODAL_TITLE} không?`,
				});
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
						await updateProductMutation({ ...values, id: formData?.id });
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
				itemSchema: formSchema,
				renderFormContent: FormView,
				formData: typeMap[action].formData,
				onItemSubmit: async (values: TItemFormFields) => {
					try {
						await typeMap[action].onSubmit({
							...values,
							permission_doc: values.permission_doc?.split(',').join(';'),
						});
					} catch (error) {
						console.error('Failed to submit item:', error);
						throw error;
					}
				},
				// onFormSubmitSuccess: () => {
				//   closeModal();
				// },
			});
		},
		[
			openFormModal,
			updateProductMutation,
			createProductMutation,
			deleteConfirm,
			openDetailModal,
			listData,
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
				left: ['outcome_name'],
				right: ['actions'],
			}}
			toolbar={{
				canAdd: true,
			}}
		/>
	);
}
