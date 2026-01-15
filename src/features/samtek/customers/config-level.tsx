import { useCallback, useState } from 'react';
import { useAuth, useModal, useSwal } from '~/hooks';
import { CRUD_ACTIONS, DEFAULT_PARAMS } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { DataTable } from '~/features/shared/components/data-table';
import { getColumns } from '~/features/shared/common';
import { levelColumns } from './level-columns';
import { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import { TItemFormFields } from '~/types/form-field';
import { toast } from 'sonner';
import { formLevelSchema } from './form-level.schema';
import { FormLevelView } from './form-level-view';

const columns = getColumns<any>(levelColumns, {
	actions: [
		CRUD_ACTIONS.EDIT,
		CRUD_ACTIONS.LOG,
	],
});
const logColumns = getColumns<any>(levelColumns, {
	isLog: true
});
export const ConfigLevel = ({ data: row }: any) => {
	// *** STATE ***
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const basePath = API_ENDPOINTS[role].customers;

	// const { getAll: getAllAgentLevel } = useCrud([
	// 	API_ENDPOINTS.dic.agentLevel,
	// 	DEFAULT_PARAMS,
	// 	{
	// 		endpoint: '',
	// 	},
	// ]);
	// const { data: agentLevelOptions }: any = getAllAgentLevel();
	// const levelDetail = useMemo(() => {
	// 	if (!agentLevelOptions) return null;
	// 	return agentLevelOptions.find((item: any) => item.id === newLevelValue);
	// }, [agentLevelOptions, newLevelValue]);
	// *** QUERY ***
	const { getAll,  update } = useCrud(
		[basePath.levelList, row?.id],
		{
			endpoint: 'root',
			id: row?.id,
		},
		{
			enabled: Boolean(row?.id),
		},
	);

	const { data: listData, isFetching, refetch }: any = getAll();
	const { mutateAsync: updateLevelMutation } = update();
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.LOG) {
				openDetailModal(formData, {
					title: 'Lịch sử cấp bậc',
					detailUrl: basePath.levelLogList,
					tableColumns: logColumns,
					tableOptions: {
						enabled: true,
						endpoint: 'root',
						id: row?.id,
						id_level: formData?.id,
					},
				});
				return;
			}

			const typeMap: any = {
				[CRUD_ACTIONS.EDIT]: {
					title: 'Cập nhật cấp bậc',
					formData,
					onSubmit: async (values: any) => {
						if (!formData?.id && !values?.id) {
							toast.error('Không tìm thấy cấp bậc');
							return;
						}
						const payload = {
							...formData,
							...values,
							id: row?.id,
							id_level: formData?.id,
							_customUrl: basePath.levelUpdate,
						};
						await updateLevelMutation(payload);
						
					},
				},
			};
			openFormModal(action as ToolbarAction, {
				title: typeMap[action].title,
				itemSchema: formLevelSchema,
				renderFormContent: FormLevelView,
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
					refetch();
				},
			});
		},
		[updateLevelMutation],
	);
	return (
	<DataTable
				data={listData || []}
				columns={columns}
				loading={isFetching}
				columnPinningConfig={{
					left: ['level_code'],
					right: [],
				}}
				onAction={handleCrudAction}
				toolbar={{
					hideExportExcel: true,
					hiddenFilters: true,
					hideSearch: true,
				}}
			/>
	);
};
