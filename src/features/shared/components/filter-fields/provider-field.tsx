import { Chip, Select, SelectItem } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useFilter, useSelectAllLogic } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { useLocation } from '@tanstack/react-router';

interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
	isNoneLife?: boolean;
	isAboard?: boolean;
	// Nếu muốn làm nó là controlled component, truyền value và onChange từ component cha
	value?: string[]; // Mảng các key đã chọn
	onChange?: (selectedKeys: string[]) => void;
}
const paths = [
	{
		key: 'non-life-insurance',
		value: API_ENDPOINTS.dic.nonLifeProvider,
	},
	{
		key: 'life-insurance',
		value: API_ENDPOINTS.dic.lifeProvider,
	},
	{
		key: 'abroad',
		value: API_ENDPOINTS.dic.abroadProvider,
	},
];
export const ProviderField = ({
	label,
	name,
	placeholder,
	isNoneLife,
	isAboard,
}: IProps) => {
	const { providerSelected, setFilter } = useFilter();
	const location = useLocation(); const pathname = location.pathname;

	const basePath = isNoneLife
		? API_ENDPOINTS.dic.nonLifeProvider
		: isAboard
			? API_ENDPOINTS.dic.abroadProvider
			: paths.find((path) => pathname.includes(path.key))?.value ||
				API_ENDPOINTS.dic.lifeProvider;
	const { getAll } = useCrud([basePath]);
	const { data: fetchedData, isFetching } = getAll();
	const { displayOptions, selectedKeys, handleSelectionChange } =
		useSelectAllLogic({
			data: fetchedData as any[],
			valueKey: 'provider_code',
			labelKey: 'provider_name',
			initialValue: providerSelected,
			onValueChange: (value) => {
				setFilter('providerSelected', value);
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
					{items.map((item: any) => {
						if (item.key === '') return <span key={item.key}>Tất cả</span>;
						return (
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
