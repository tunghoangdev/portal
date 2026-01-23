import { useCallback, useMemo, useState } from 'react';
import { useAuth, useSwal } from '@/hooks';
import { CRUD_ACTIONS, DEFAULT_PARAMS } from '@/constant';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { DataTable } from '@/features/shared/components/data-table';
import { getColumns } from '@/features/shared/common';
import { configBusinessColumns } from './config-business-columns';
import { CrudActionType } from '@/types/data-table-type';
import { TItemFormFields } from '@/types/form-field';
import { Icons } from '@/components/icons';
import { Button, Select, SelectItem } from '@/components/ui';
const columns = getColumns<any>(configBusinessColumns, {
	actions: [
		CRUD_ACTIONS.DELETE,
	],
});
export const ConfigBusiness = ({ data: row }: any) => {
	// *** STATE ***
	const { confirm } = useSwal();
	const { role } = useAuth();
	const [newLevelValue, setNewLevelValue] = useState(0);
	const [filter, setFilter] = useState(DEFAULT_PARAMS);
	const basePath = API_ENDPOINTS[role].products;

	// *** OPTIONS ***
	const { getAll: getAllAgentLevel } = useCrud([
		basePath.dic,
		DEFAULT_PARAMS,
	],	{
			endpoint: 'root',
		},);
	const { data: agentLevelOptions }: any = getAllAgentLevel();
	// *** QUERY ***
	const { getAll, create, updateConfirm, deleteConfirm } = useCrud(
		[API_ENDPOINTS[role].customers.configBusiness, filter, row?.id],
		{
			endpoint: 'root',
			...filter,
			id: row?.id,
		},
		{
			enabled: Boolean(row?.id),
		},
	);

	const { data: listData, isFetching, refetch }: any = getAll();
	const { mutateAsync: createProductMutation } = create();
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(formData, {
					title: 'Xóa',
					message: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
					_customUrl: basePath.delete,
					_closeModal: false,
					_customMessage: 'Xóa sản phẩm thành công',
				});
				// refetch();
				return;
			}
		},
		[deleteConfirm, updateConfirm, refetch],
	);

	// *** HANDLERS ***
	const handleCreate = async () => {
		const res = await confirm({
			title: `Thêm sản phẩm`,
			text: 'Bạn có chắc chắn muốn thêm sản phẩm này?',
		});
		if (res.isConfirmed) {
			await createProductMutation({
				id_customer: row?.id,
				id_product: newLevelValue,
				_customUrl: basePath.create,
				_customMessage: 'Thêm sản phẩm thành công',
				_closeModal: false,
			});
			setNewLevelValue(0);
			// refetch();
			// refetchParent();
		}
	};

	return (
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
				// customActions={[
				// 	// {
				// 	// 	type: CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL,
				// 	// 	label: 'Duyệt bổ nhiệm',
				// 	// 	icon: <Icons.circleCheck size={14} />,
				// 	// 	isHidden: (row: any) => {
				// 	// 		return row?.is_approved;
				// 	// 	},
				// 	// },
				// 	// {
				// 	// 	type: CRUD_ACTIONS.CANCEL_ASSIGN_LEVEL,
				// 	// 	label: 'Hủy duyệt bổ nhiệm',
				// 	// 	icon: <Icons.close size={14} />,
				// 	// 	isHidden: (row: any) => {
				// 	// 		return !row?.is_approved;
				// 	// 	},
				// 	// },
				// 	// {
				// 	// 	type: CRUD_ACTIONS.DELETE,
				// 	// 	label: 'Xóa',
				// 	// 	icon: <Icons.trash size={14} />,
				// 	// 	color: 'text-danger',
				// 	// 	isHidden: (row: any) => {
				// 	// 		return row?.is_approved;
				// 	// 	},
				// 	// },
				// ]}
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
								placeholder="Chọn sản phẩm..."
								className="pt-2 sm:pt-0"
								errorMessage="Vui lòng chọn sản phẩm"
							>
								{agentLevelOptions?.map((item: any) => (
									<SelectItem key={item.id}>{item.product_name}</SelectItem>
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
								Thêm
							</Button>
						</div>
					),
				}}
			/>
	);
};
