import { useCallback, useMemo, useState } from 'react';
import { useAuth, useSwal } from '@/hooks';
import { CRUD_ACTIONS, DEFAULT_PARAMS } from '@/constant';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { DataTable } from '@/features/shared/components/data-table';
import { getColumns } from '@/features/shared/common';
import { assignColumns } from './assign-columns';
import { CrudActionType } from '@/types/data-table-type';
import { TItemFormFields } from '@/types/form-field';
import { Icons } from '@/components/icons';
import { Button, Select, SelectItem } from '@/components/ui';
const columns = getColumns<any>(assignColumns, {
	actions: [
		CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL,
		CRUD_ACTIONS.DELETE_ASSIGN_LEVEL,
	],
});
const AgentAssignLevel = ({ data: row, refetch: refetchParent }: any) => {
	// *** STATE ***
	const { confirm } = useSwal();
	const { role } = useAuth();
	const [newLevelValue, setNewLevelValue] = useState(0);
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	const basePath = API_ENDPOINTS[role].agents.assignLevel;
	// *** OPTIONS ***
	// const agentLevelOptions = useAgentLevelOptions();
	// console.log("agentLevelOptions", agentLevelOptions);
	const { getAll: getAllAgentLevel } = useCrud([
		API_ENDPOINTS.dic.agentLevel,
		DEFAULT_PARAMS,
		{
			endpoint: '',
		},
	]);
	const { data: agentLevelOptions }: any = getAllAgentLevel();
	const levelDetail = useMemo(() => {
		if (!agentLevelOptions) return null;
		return agentLevelOptions.find((item: any) => item.id === newLevelValue);
	}, [agentLevelOptions, newLevelValue]);
	// *** QUERY ***
	const { getAll, create, updateConfirm, deleteConfirm } = useCrud(
		[basePath.level, filter, row?.id],
		{
			endpoint: role,
			...filter,
			id: row?.id,
		},
		{
			enabled: Boolean(row?.id),
		},
	);

	const { data: listData, isFetching }: any = getAll();
	const { mutateAsync: createProductMutation } = create();
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE_ASSIGN_LEVEL) {
				await deleteConfirm(formData, {
					title: 'Xóa',
					message: 'Bạn có chắc chắn muốn xóa bổ nhiệm này?',
					_customUrl: basePath.delete,
				});
				refetchParent();
				return;
			}
			if (
				action === CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL ||
				action === CRUD_ACTIONS.CANCEL_ASSIGN_LEVEL
			) {
				await updateConfirm(formData, {
					title:
						action === CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL
							? 'Duyệt'
							: 'Hủy duyệt',
					message: `Bạn có chắc chắn muốn ${
						action === CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL ? 'duyệt' : 'hủy duyệt'
					} bổ nhiệm này?`,
					_customUrl:
						action === CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL
							? basePath.approve
							: basePath.cancel,
					_closeModal: false,
					_customMessage: `${
						action === CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL ? 'Duyệt' : 'Hủy duyệt'
					} bổ nhiệm thành công!`,
				});
				refetchParent();
				return;
			}
		},
		[deleteConfirm, updateConfirm, refetchParent],
	);

	// *** HANDLERS ***
	const handleCreate = async () => {
		const res = await confirm({
			title: `${row?.agent_level_code} -> ${levelDetail?.level_code || ''}`,
			text: 'Bạn có chắc chắn muốn thay đổi cấp bậc?',
		});
		if (res.isConfirmed) {
			await createProductMutation({
				id: row?.id,
				id_new_level: newLevelValue,
				_customUrl: basePath.create,
				_customMessage: 'Thay đổi cấp bậc thành công',
				_closeModal: false,
			});
			setNewLevelValue(0);
			refetchParent();
		}
	};

	return (
		<>
			<div className="block sm:flex justify-between mb-4">
				<div>
					<h3 className="text-base font-md">
						Cấp bậc hiện tại: {row?.agent_level_code}
					</h3>
				</div>
			</div>
			<DataTable
				data={listData || []}
				columns={columns}
				loading={isFetching}
				searchValue={filter.info}
				columnPinningConfig={{
					left: ['agent_name'],
					right: [],
				}}
				onAction={handleCrudAction}
				customActions={[
					{
						type: CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL,
						label: 'Duyệt bổ nhiệm',
						icon: <Icons.circleCheck size={14} />,
						isHidden: (row: any) => {
							return row?.is_approved;
						},
					},
					{
						type: CRUD_ACTIONS.CANCEL_ASSIGN_LEVEL,
						label: 'Hủy duyệt bổ nhiệm',
						icon: <Icons.close size={14} />,
						isHidden: (row: any) => {
							return !row?.is_approved;
						},
					},
					{
						type: CRUD_ACTIONS.DELETE_ASSIGN_LEVEL,
						label: 'Xóa',
						icon: <Icons.trash size={14} />,
						color: 'text-danger',
						isHidden: (row: any) => {
							return row?.is_approved;
						},
					},
				]}
				toolbar={{
					hideExportExcel: true,
					hiddenFilters: true,
					onSearch: (value) => {
						setFilter((prev) => ({ ...prev, info: value }));
					},
					endContent: (
						<div className="pt-2 sm:pt-0 block sm:flex gap-4">
							<Select
								isRequired
								selectedKeys={[newLevelValue?.toString()]}
								onChange={(e) => {
									setNewLevelValue(+e.target.value);
								}}
								classNames={{
									trigger: 'min-w-[200px]',
								}}
								placeholder="Chọn cấp bậc bổ nhiệm..."
								className="pt-2 sm:pt-0"
								errorMessage="Vui lòng chọn cấp bậc bổ nhiệm"
							>
								{agentLevelOptions?.map((item: any) => (
									<SelectItem key={item.id}>{item.level_code}</SelectItem>
								))}
							</Select>
							<Button
								color="secondary"
								size="sm"
								onClick={handleCreate}
								disabled={!newLevelValue}
								startContent={<Icons.add size={14} />}
								className="h-9 min-w-[100px]"
							>
								Tạo mới
							</Button>
							<div className="pt-2 sm:pt-0">
								{/* <CreateButton
                  text="Tạo mới"
                  disabled={!newLevelValue}
                  onClick={handleCreate}
                  // isLoading={isCreating}
                /> */}
							</div>
						</div>
					),
				}}
			/>
			{/* <VirtualTable
        table={table}
        isFetching={isFetchingData}
        height="calc(100vh - 400px)"
        isCard={false}
      /> */}
		</>
	);
};

export default AgentAssignLevel;
