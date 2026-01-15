import { useCallback, useMemo } from 'react';
import {
	useAuth,
	useCommon,
	useCommonData,
	useDataQuery,
	useModal,
} from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { TItemFormFields } from '~/types/form-field';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { toast } from 'sonner';
import { useCrud } from '~/hooks/use-crud-v2';
import { formSchema, initialFormValues } from './form.schema';
import { FormView } from './form-view';
import { columns } from './columns';
import { parseString } from '~/utils/util';
const MODAL_TITLE = ' thông báo';
interface IProps {
	excludeColumns?: string[];
}
export default function PageClient({ excludeColumns }: IProps) {
	// Global state
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const { agentLevels } = useCommon();

	const basePath = API_ENDPOINTS[role].notifications.list;
	// CRUD HOOKS
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
	});
	const { getInfinite, create, update, deleteConfirm } = useCrud(
		queryKey,
		queryParams,
	);

	useCommonData('agentLevels', API_ENDPOINTS.dic.agentLevel, {
		enabled: !agentLevels?.length,
	});
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
	const tableColumn = useMemo(() => {
		let newColumns = [...columns];
		if (excludeColumns?.length) {
			newColumns = newColumns.filter(
				(item: any) => !excludeColumns?.includes(item.key),
			);
		}
		const tableColumns = getColumns<any>(
			newColumns.filter((item) => item.key !== 'is_hot'),
			{
				actions: [CRUD_ACTIONS.LOG, CRUD_ACTIONS.EDIT, CRUD_ACTIONS.DELETE],
			},
		);
		const logColumns = getColumns<any>(newColumns, { isLog: true });
		return {
			tableColumns,
			logColumns,
		};
	}, [excludeColumns]);

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
					tableColumns: tableColumn.logColumns,
					tableOptions: {
						enabled: true,
					},
				});
				return;
			}
			const newFormData = {
				...formData,
				permission_doc:
					typeof formData?.permission_doc === 'string'
						? parseString(formData?.permission_doc, ';', ',')
						: formData?.permission_doc?.join(','),
			};
			const typeMap: any = {
				[CRUD_ACTIONS.EDIT]: {
					title: `Cập nhật ${MODAL_TITLE}`,
					formData: newFormData,
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
	const newListData = useMemo(() => {
		return listData?.map((item: any) => {
			if (
				item.permission_doc &&
				typeof item.permission_doc === 'string' &&
				agentLevels?.length
			) {
				item.permission_doc = item.permission_doc?.split(';');
				item.permissions = agentLevels?.filter((level: any) =>
					item.permission_doc?.includes(level.id.toString()),
				);
			}
			return item;
		});
	}, [agentLevels, listData]);

	return (
		<DataTable
			data={newListData}
			columns={tableColumn.tableColumns}
			loading={isFetching}
			isFetchingNextPage={isFetchingNextPage}
			total={total || 0}
			hasNextPage={hasNextPage}
			fetchNextPage={fetchNextPage}
			onAction={handleCrudAction}
			columnPinningConfig={{
				left: ['announcement_name'],
				right: ['actions'],
			}}
			toolbar={{
				canAdd: true,
			}}
		/>
	);
}
