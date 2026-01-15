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
}
export const AgentStatusField = ({ label, name, placeholder }: IProps) => {
	const { agentStatusSelected, setFilter } = useFilter();
	const { getAll } = useCrud([API_ENDPOINTS.dic.agentStatus]);
	const { data: fetchedData, isFetching } = getAll();
	const { displayOptions, selectedKeys, allOption, handleSelectionChange } =
		useSelectAllLogic({
			data: fetchedData as any[],
			valueKey: 'id',
			labelKey: 'status_name',
			initialValue: agentStatusSelected,
			onValueChange: (value) => {
				setFilter('agentStatusSelected', value);
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
