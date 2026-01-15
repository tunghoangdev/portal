import { useCallback } from 'react';
import { useAuth, useDataQuery, useModal, useTableColumns } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { TItemFormFields } from '~/types/form-field';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { toast } from 'sonner';
import { useCrud } from '~/hooks/use-crud-v2';
import { formSchema, formStaffSchema, initialFormValues } from './form.schema';
import { FormView } from './form-view';
import { listColumns } from './columns';
import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '~/components/ui';
import { Icons } from '~/components/icons';
// const columns = getColumns<any>(listColumns);
const MODAL_TITLE = ' email doanh nghiệp';
export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { columns, logColumns } = useTableColumns(listColumns, {
		showLevel: true,
		actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
	});
	const { openFormModal, openDetailModal, closeModal } = useModal();
	const basePath = API_ENDPOINTS[role].documents.emailBusiness;
	// CRUD HOOKS
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
		filter: {
			mail_type: true,
			id_agent_level: true,
		},
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
					formData: {
						...formData,
						type: formData?.is_staff ? 'staff' : 'agent',
					},
					onSubmit: async (values: any) => {
						if (!formData?.id && !values?.id) {
							toast.error(`Không tìm thấy ${MODAL_TITLE}`);
							return;
						}
						await updateProductMutation({ ...values, id: formData?.id });
					},
				},
				[CRUD_ACTIONS.ADD]: {
					formData: {
						...initialFormValues,
						type: formData?.type,
					},
					title: `Tạo mới ${MODAL_TITLE}`,
					onSubmit: async (values: any) => {
						await createProductMutation({
							...values,
						});
					},
				},
			};

			openFormModal(action as ToolbarAction, {
				title: typeMap[action].title,
				itemSchema:
					typeMap[action].formData?.type === 'staff'
						? formStaffSchema
						: formSchema,
				renderFormContent: ({ formMethods, control }: any) => (
					<FormView
						control={control}
						formMethods={formMethods}
						isStaff={typeMap[action].formData?.type === 'staff'}
					/>
				),
				formData: typeMap[action].formData,
				onItemSubmit: async (values: TItemFormFields) => {
					try {
						await typeMap[action].onSubmit({
							...values,
							// permission_doc: values.permission_doc?.split(',').join(';'),
							is_staff: formData?.type === 'staff',
						});
						closeModal();
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
					left: ['agent_name'],
					right: ['actions'],
				}}
				toolbar={{
					customToolbarActions: (onAction) => (
						<Dropdown placement="bottom-end">
							<DropdownTrigger>
								<Button
									color="secondary"
									startContent={<Icons.add size={16} fill="currentColor" />}
									size="sm"
								>
									Tạo mới
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Static Actions"
								onAction={(val) =>
									onAction?.(CRUD_ACTIONS.ADD, {
										type: val,
									})
								}
							>
								<DropdownItem key="staff">Nhân viên</DropdownItem>
								<DropdownItem key="agent">Thành viên</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					),
				}}
				filterFields={['mailType', 'agentLevel']}
			/>
		</>
	);
}
