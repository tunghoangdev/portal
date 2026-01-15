import { useCallback, useEffect, useState } from 'react';
import { useAuth, useDataQuery, useModal } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { getColumns } from '~/features/shared/common/get-columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import type { TItemFormFields } from '~/types/form-field';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { useCrud } from '~/hooks/use-crud-v2';
import { listColumns } from './columns';
import { formSchema, initialFormValues } from './form.schema';
import { FormView } from './form-view';
import { Icons } from '~/components/icons';
import { downloadFileObject } from '~/utils/util';
import { toast } from 'sonner';
import { COMPLETED } from '~/features/shared/components/cells';
const SUFIX_LABEL = ' hợp đồng';
const columns = getColumns<any>(listColumns, {
	actions: [CRUD_ACTIONS.DOWLOAD_E_CONTRACT, CRUD_ACTIONS.RESIGN_CONTRACT],
});
export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { openFormModal } = useModal();
	const [itemData, setItemData] = useState<any>();
	// Local state
	const basePath = API_ENDPOINTS[role].agents.econtract;
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		rangeFilter: true,
	});
	const { getInfinite, create, update, deleteConfirm, updateConfirm } = useCrud(
		queryKey,
		queryParams,
		{
			enabled: isQueryEnabled,
		},
	);
	const { getOne } = useCrud(
		[basePath.download, itemData],
		{ endpoint: role, id: itemData?.id?.toString() },
		{
			enabled: !!itemData,
		},
	);
	const { data } = getOne();
	const {
		listData,
		isFetching,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		total,
	}: any = getInfinite();

	useEffect(() => {
		if (data && itemData) {
			downloadFileObject(data as string, itemData?.file_name);
		}
	}, [data]);

	// HANDLERS
	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateProductMutation } = update();

	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(formData);
				return;
			}
			if (action === CRUD_ACTIONS.RESIGN_CONTRACT) {
				await updateConfirm(
					{
						id: formData?.id,
					},
					{
						title: 'Ký lại hợp đồng',
						message: 'Bạn có chắc chắn muốn ký lại hợp đồng?',
						_customUrl: basePath.reSingEContract,
					},
				);
				return;
			}

			if (action === CRUD_ACTIONS.DOWLOAD_E_CONTRACT) {
				if (formData?.status !== COMPLETED) {
					toast.error('Chưa có hợp đồng để tải về');
					return;
				}
				setItemData(formData);
				return;
			}
			openFormModal(action as ToolbarAction, {
				title: `Khởi tạo ${SUFIX_LABEL}`,
				itemSchema: formSchema,
				size: 'md',
				renderFormContent: FormView,
				formData: initialFormValues,
				onItemSubmit: async (values: TItemFormFields) => {
					try {
						const { customer_phone, ...payload } = values;
						await createProductMutation({
							// ...payload,
							id: +payload.id_agent,
						});
					} catch (error) {
						console.error('Failed to submit item:', error);
						throw error;
					}
				},
			});
		},
		[openFormModal, updateProductMutation, createProductMutation],
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
				left: ['agent_name'],
				right: ['actions'],
			}}
			toolbar={{
				canAdd: true,
				addLabel: `Khởi tạo ${SUFIX_LABEL}`,
				actionType: CRUD_ACTIONS.ADD_CONTRACT,
			}}
			customActions={[
				{
					type: CRUD_ACTIONS.DOWLOAD_E_CONTRACT,
					label: 'Tải hợp đồng',
					icon: <Icons.download size={14} strokeWidth={1.5} />,
					isHidden: (row: any) => row?.status !== COMPLETED,
				},
				{
					type: CRUD_ACTIONS.RESIGN_CONTRACT,
					label: 'Ký lại',
					icon: <Icons.refresh size={14} strokeWidth={1.5} />,
					isHidden: (row: any) => row?.status === COMPLETED,
				},
			]}
		/>
	);
}
