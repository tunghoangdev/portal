import { use, useCallback, useMemo } from 'react'; // Thêm useRef, useCallback
import { useAuth, useDataQuery, useModal } from '~/hooks';
import { DataTable } from '~/features/shared/components/data-table';
import { CRUD_ACTIONS } from '~/constant';
import { getColumns } from '~/features/shared/common';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import type { CrudActionType, ToolbarAction } from '~/types/data-table-type';
import type { TItemFormFields } from '~/types/form-field';
import { toast } from 'sonner';
import { createColumnDef } from '~/features/shared/common/create-column';
import { ProductForm } from './product.form';
import { ProductPolicyForm } from './product-policy.form';
import { initialFormValues, policySchema, productSchema } from './form-schema';
import { columns } from './columns';
import { generateZodSchema } from '~/schema-validations';

// const createColumnDef =
//   (prefix: string, titlePrefix: string) => (item: any) => ({
//     title: `${titlePrefix} ${item.level_code}%`,
//     key: `${prefix}${item.id}`,
//     type: "number",
//     // summary: 'sum',
//   });

export default function PageClient() {
	// Global state
	const { role } = useAuth();
	const { openFormModal, openDetailModal } = useModal();
	const { getAll } = useCrud([API_ENDPOINTS.dic.agentLevel], {
		endpoint: '',
		listUrl: 'dic',
	});

	const { data: agentLevelList }: any = getAll();
	const levelColumns = useMemo(() => {
		if (!agentLevelList?.length) return [];
		const rewardColumns = agentLevelList.map(
			createColumnDef('percentage_level_', 'Thưởng', { hiddenSummary: true }),
		);
		const sameLevelColumns = agentLevelList.map(
			createColumnDef('percentage_same_level_', 'Thưởng đồng cấp', { hiddenSummary: true }),
		);
		return [...rewardColumns, ...sameLevelColumns];
	}, [agentLevelList]);
	const newFields: any = levelColumns?.map((item: any) => {
		return {
			name: item.key,
			label: item.title,
			isRequired: true,
			placeholder: `Nhập tỷ lệ ${item.title.toLowerCase()}`,
			type: 'number',
			defaultValue: '0',
			allowZero: true,
			col: 3,
		};
	});
	const policySchemaWithLevel = useMemo(
		() => generateZodSchema(newFields),
		[newFields],
	);
	const tableCol = useMemo(() => {
		const baseColumns = [...columns, ...levelColumns];
		return {
			columns: getColumns<any>(baseColumns, {
				actions: [
					CRUD_ACTIONS.LOG,
					CRUD_ACTIONS.EDIT,
					CRUD_ACTIONS.CONFIG_POLICY,
					CRUD_ACTIONS.DELETE,
				],
			}),
			logColumns: getColumns<any>(baseColumns, {
				isLog: true,
			}),
		};
	}, [levelColumns]);

	const basePath = API_ENDPOINTS[role].abroad.products;
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
	});

	const { getInfinite, update, create, updateConfirm, deleteConfirm } = useCrud(
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

	const { mutateAsync: createProductMutation } = create();
	const { mutateAsync: updateProductMutation } = update();
	// HANDLE CRUD
	const handleCrudAction = useCallback(
		async (action: CrudActionType, formData?: TItemFormFields) => {
			if (action === CRUD_ACTIONS.DELETE) {
				await deleteConfirm(formData, {
					title: 'Xác nhận xóa',
					message: `Bạn có chắc chắn muốn xóa sản phẩm ${
						formData?.product_name || ''
					}?`,
				});
				return;
			}
			const payload =
				action === CRUD_ACTIONS.ADD ? initialFormValues : formData;
			const isForm = (
				[
					CRUD_ACTIONS.ADD,
					CRUD_ACTIONS.EDIT,
					CRUD_ACTIONS.CONFIG_POLICY,
				] as string[]
			).includes(action as string);
			if (isForm) {
				const titleMap: any = {
					[CRUD_ACTIONS.CONFIG_POLICY]: `Cấu hình chính sách sản phẩm ${
						payload?.product_name || ''
					}`,
					[CRUD_ACTIONS.EDIT]: `Chỉnh sửa sản phẩm ${
						payload?.product_name || ''
					}`,
					[CRUD_ACTIONS.ADD]: 'Thêm sản phẩm',
				};
				openFormModal(action as ToolbarAction, {
					itemSchema:
						action === CRUD_ACTIONS.CONFIG_POLICY
							? policySchemaWithLevel
							: // ? policySchema
								productSchema,
					size: '5xl',
					renderFormContent: ({ control, formMethods }: any) =>
						action === CRUD_ACTIONS.CONFIG_POLICY ? (
							<ProductPolicyForm
								control={control}
								formMethods={formMethods}
								fields={newFields}
							/>
						) : (
							<ProductForm control={control} formMethods={formMethods} />
						),
					// action === CRUD_ACTIONS.CONFIG_POLICY
					// 	? NoneLifeProductPolicyForm
					// 	: NoneLifeProductForm,
					formData: payload,
					title: titleMap[action],
					onItemSubmit: async (
						values: TItemFormFields,
						currentAction: string,
					) => {
						try {
							if (currentAction === CRUD_ACTIONS.ADD) {
								await createProductMutation(values);
							} else if (currentAction === CRUD_ACTIONS.EDIT) {
								if (!values.id && !payload?.id) {
									toast.error('Không tìm thấy sản phẩm');
									return;
								}
								const updateData = {
									...payload,
									...values,
								};
								await updateProductMutation(updateData);
							} else if (currentAction === CRUD_ACTIONS.CONFIG_POLICY) {
								if (!values.id && !payload?.id) {
									toast.error('Không tìm thấy sản phẩm');
									return;
								}
								const updateData = {
									...payload,
									...values,
								};
								await updateConfirm(
									{
										...updateData,
									},
									{
										title: 'Xác nhận cấu hình',
										message: `Bạn có chắc chắn muốn cấu hình chính sách cho sản phẩm ${
											updateData?.product_name || ''
										}?`,
										_customUrlSegment: 'config',
									},
								);
							}
						} catch (error) {
							console.error('Failed to submit item:', error);
							throw error;
						}
					},
					// onFormSubmitSuccess: () => {
					// 	useFormModalStore.getState().closeModal();
					// },
				});
			} else {
				openDetailModal(formData, {
					title: `Lịch sử sản phẩm ${formData?.product_name || ''}`,
					tableColumns: tableCol.logColumns,
					detailUrl: basePath.logList,
					tableOptions: {
						endpoint: role,
						enabled: true,
					},
				});
			}
		},
		[
			openFormModal,
			openDetailModal,
			createProductMutation,
			updateProductMutation,
			newFields,
		],
	);

	return (
		<DataTable
			data={listData}
			columns={tableCol.columns}
			loading={isFetching}
			isFetchingNextPage={isFetchingNextPage}
			total={total || 0}
			hasNextPage={hasNextPage}
			fetchNextPage={fetchNextPage}
			onAction={handleCrudAction}
			columnPinningConfig={{
				left: ['product_name'],
				right: [],
			}}
			toolbar={{
				canAdd: true,
			}}
		/>
	);
}
