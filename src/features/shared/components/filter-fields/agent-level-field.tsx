import { Chip, Select, SelectItem } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useFilter, useSelectAllLogic } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { useFilterStore } from '~/stores'; // Import useFilterStore

interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
	// Nếu muốn làm nó là controlled component, truyền value và onChange từ component cha
	value?: string[]; // Mảng các key đã chọn
	onChange?: (selectedKeys: string[]) => void;
}

export const AgentLevelField = ({ label, name, placeholder }: IProps) => {
	const { agentLevelSelected, setFilter } = useFilter();
	const { getAll } = useCrud([API_ENDPOINTS.dic.agentLevel]);
	const { data: fetchedData, isFetching } = getAll();
	const { displayOptions, selectedKeys, allOption, handleSelectionChange } =
		useSelectAllLogic({
			data: fetchedData as any[],
			valueKey: 'id',
			labelKey: 'level_code',
			initialValue: agentLevelSelected,
			onValueChange: (value) => {
				setFilter('agentLevelSelected', value);
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
				<div className="flex flex-wrap gap-1.5 p-1.5">
					{items.length === 0 ||
					(items.length - 1 === (fetchedData as any[])?.length &&
						items[0].key === allOption.value) ? (
						<span>Tất cả</span>
					) : (
						items.map((item: any) => (
							<Chip size="sm" color="secondary" radius="sm" key={item.key}>
								{item.data.label}
							</Chip>
						))
					)}
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
				trigger: 'w-auto min-w-[250px] text-xs font-medium px-1',
				clearButton: 'w-4 h-4 bg-transparent text-default-700',
			}}
		>
			{(item: any) => (
				<SelectItem key={item.value.toString()}>{item.label}</SelectItem>
			)}
		</Select>
	);
};
