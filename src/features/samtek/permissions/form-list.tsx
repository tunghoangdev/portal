
import { Icons } from '@/components/icons';
import { Button, Stack, TreeView } from '@/components/ui';
import { useCommon } from '@/hooks';
import { useCommonStore } from '@/stores';
import { useEffect } from 'react';
const FormList = ({
	data,
	idForm,
	setForm,
	isEdit,
	isLoading,
	handleCheckAllForm,
}: any) => {
	const { setData } = useCommonStore();
	const { selectedFormId } = useCommon();
	const transformedData = Object.keys(data).map((moduleName, index) => {
		return {
			id: `module-${index + 1}`, // Tạo ID duy nhất cho mỗi module
			name: moduleName,
			children: data[moduleName].map((form: any, formIndex: number) => ({
				id: `form-${form.id}`, // Sử dụng ID của form hoặc tạo mới
				name: form.form_name,
				access: form.access, // Thêm thuộc tính access nếu cần
				...form,
			})),
		};
	});
	useEffect(() => {
		if (
			transformedData.length > 0 &&
			transformedData[0].children &&
			transformedData[0].children.length > 0 &&
			!selectedFormId
		) {
			const firstFormId = transformedData[0].children[0].id;
			const firstForm = transformedData[0].children[0];
			setData('selectedFormId', firstFormId);
			setForm(firstForm);
		}
	}, [idForm, selectedFormId, transformedData]);

	return (
		<div className="bg-default/20 p-2.5 shadow-sm rounded-md mb-5">
			<Stack className="gap-x-2 mb-5 pl-5 pt-5" alignItems={'center'}>
				<Button
					size="sm"
					color="default"
					variant="bordered"
					isDisabled={
						!isEdit ||
						isLoading.isCheckingAllForm ||
						isLoading.isUnCheckingAllForm
					}
					onClick={() => handleCheckAllForm(true)}
					className="min-h-0 h-auto py-0.5 min-w-0 w-auto bg-white"
				>
					<Icons.listCheck size={16} />
					<span className="align-middle ms-1">Cho phép tất cả</span>
				</Button>
				<Button
					size="sm"
					color="danger"
					variant="bordered"
					isDisabled={!isEdit}
					className="min-h-0 h-auto py-0.5 min-w-0 w-auto"
					onPress={() => handleCheckAllForm(false)}
				>
					<Icons.closeCircle size={16} />
					<span className="align-middle ms-1">Bỏ tất cả quyền</span>
				</Button>
			</Stack>
			<TreeView
				data={transformedData}
				// expandAll
				onNodeClick={setForm}
				idForm={idForm}
			/>
		</div>
	);
};

export default FormList;
