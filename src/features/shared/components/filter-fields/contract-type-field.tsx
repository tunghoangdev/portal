import { Chip, Select, SelectItem } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useFilter, useSelectAllLogic } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';

interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
	value?: string[];
	onChange?: (selectedKeys: string[]) => void;
}

export const ContractTypeField = ({ label, name, placeholder }: IProps) => {
	const { setFilter } = useFilter();
	const { contractTypeList, contractTypeSelected } = useFilter();
	const { getAll } = useCrud([API_ENDPOINTS.dic.lifeType]);
	const { data: fetchedData, isFetching } = getAll();
	const { displayOptions, selectedKeys, handleSelectionChange } =
		useSelectAllLogic({
			data:
				contractTypeList?.length > 0
					? contractTypeList
					: (fetchedData as any[]),
			valueKey: 'id',
			labelKey: 'life_type_name',
			initialValue: contractTypeSelected,
			onValueChange: (value) => {
				setFilter(name || 'contractTypeSelected', value);
			},
		});

	return (
		<Select
			items={displayOptions}
			selectedKeys={selectedKeys}
			onSelectionChange={(keys: any) => handleSelectionChange(new Set(keys))}
			label={label}
			placeholder={isFetching ? 'Đang tải...' : placeholder}
			selectionMode="multiple"
			variant="bordered"
			color="secondary"
			aria-label={name}
			labelPlacement="outside"
			isMultiline
			scrollShadowProps={{
				isEnabled: false,
			}}
			renderValue={(items) => (
				<div className="flex flex-wrap gap-1.5 p-1.5 max-w-[200px]">
					{items.map((item: any) => {
						return item.key === '' ? (
							<span key={item.key}>Tất cả</span>
						) : (
							<Chip size="sm" color="secondary" radius="sm" key={item.key}>
								{item.data.label}
							</Chip>
						);
					})}
				</div>
			)}
			listboxProps={{
				itemClasses: {
					base: [
						'rounded-md',
						'text-default-700',
						'data-[hover=true]:!text-white',
						'data-[hover=true]:bg-secondary/50',
						'data-[selectable=true]:focus:bg-secondary',
						'data-[pressed=true]:opacity-70',
						'data-[focus-visible=true]:ring-default-500',
					],
				},
			}}
			classNames={{
				trigger: 'w-auto min-w-[100px] text-xs font-medium px-2',
				clearButton: 'w-4 h-4 bg-transparent text-default-700',
			}}
		>
			{(item: any) => (
				<SelectItem key={item.value.toString()}>{item.label}</SelectItem>
			)}
		</Select>
	);
};
