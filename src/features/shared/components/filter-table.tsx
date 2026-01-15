import { Icons } from '~/components/icons';
import {
	Button,
	Grid,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from '~/components/ui';
import SelectReport from './select-report';
import SelectPeriodDic from './select-period-dic';
import { Tooltip } from '@heroui/react';
import {
	AgentStatusField,
	AgentLevelField,
	ProviderField,
	ContractTypeField,
	EmailTypeField,
} from './filter-fields';
// Định nghĩa các loại trường lọc có sẵn (built-in types)
type BuiltInFilterType =
	| 'report'
	| 'mailType'
	| 'periodic'
	| 'agentStatus'
	| 'agentLevel'
	| 'provider'
	| 'nonLifeProvider'
	| 'aboardProvider'
	| 'contractType';

// Interface cho cấu hình của một trường lọc BUILT-IN
interface BuiltInFilterConfig {
	type: BuiltInFilterType;
	label?: string;
	placeholder?: string;
	isNoneLife?: boolean;
	isAboard?: boolean;
	id?: string;
	componentProps?: Record<string, any>;
}

// Interface cho cấu hình của một trường lọc CUSTOM
interface CustomFilterConfig {
	type: 'custom';
	id: string;
	label: string;
	placeholder?: string;
	isNoneLife?: boolean;
	isAboard?: boolean;
	renderField: (props: {
		id: string;
		label: string;
		placeholder?: string;
		[key: string]: any;
	}) => React.ReactNode;
	componentProps?: Record<string, any>;
}
type FilterFieldFullConfig =
	| (BuiltInFilterConfig & { id: string })
	| CustomFilterConfig;

type FilterFieldProp = BuiltInFilterType | CustomFilterConfig;

interface FilterProps {
	fields: FilterFieldProp[];
	onApplyFilters?: () => void;
	onResetFilters?: () => void;
}

// Ánh xạ từ BuiltInFilterType sang thông tin mặc định của trường (label, component)
const builtInFilterMap: Record<
	BuiltInFilterType,
	{
		component: React.ComponentType<any>;
		defaultLabel: string;
		defaultPlaceholder: string;
	}
> = {
	report: {
		component: SelectReport,
		defaultLabel: 'Thời gian',
		defaultPlaceholder: 'Chọn thời gian--',
	},
	mailType: {
		component: EmailTypeField,
		defaultLabel: 'Loại mail',
		defaultPlaceholder: 'Chọn loại mail--',
	},
	periodic: {
		component: SelectPeriodDic,
		defaultLabel: 'Kỳ tính thưởng',
		defaultPlaceholder: 'Chọn kỳ tính thưởng --',
	},
	agentStatus: {
		component: AgentStatusField,
		defaultLabel: 'Trạng thái',
		defaultPlaceholder: 'Chọn trạng thái--',
	},
	agentLevel: {
		component: AgentLevelField,
		defaultLabel: 'Cấp bậc thành viên',
		defaultPlaceholder: 'Chọn cấp bậc--',
	},
	provider: {
		component: ProviderField,
		defaultLabel: 'Nhà cung cấp',
		defaultPlaceholder: 'Chọn nhà cung cấp--',
	},
	nonLifeProvider: {
		component: ProviderField,
		defaultLabel: 'Nhà cung cấp',
		defaultPlaceholder: 'Chọn nhà cung cấp--',
	},
	aboardProvider: {
		component: ProviderField,
		defaultLabel: 'Nhà cung cấp',
		defaultPlaceholder: 'Chọn nhà cung cấp--',
	},
	contractType: {
		component: ContractTypeField,
		defaultLabel: 'Loại hợp đồng',
		defaultPlaceholder: 'Chọn loại hợp đồng--',
	},
};

export const FilterTable = ({
	fields,
	onApplyFilters,
	onResetFilters,
}: FilterProps) => {
	const normalizeFieldConfig = (
		fieldProp: FilterFieldProp,
	): FilterFieldFullConfig => {
		if (typeof fieldProp === 'string') {
			const { defaultLabel, defaultPlaceholder } = builtInFilterMap[fieldProp];
			return {
				id: fieldProp,
				type: fieldProp,
				label: defaultLabel,
				placeholder: defaultPlaceholder,
				isNoneLife: fieldProp === 'nonLifeProvider',
				isAboard: fieldProp === 'aboardProvider',
				componentProps: {},
			};
		}
		if (!fieldProp.id) {
			console.error("Filter field config is missing 'id':", fieldProp);
			return {
				...fieldProp,
				id: (fieldProp as unknown as BuiltInFilterConfig).type || 'unknown_id',
			};
		}
		return fieldProp;
	};

	const renderFilterField = (field: FilterFieldFullConfig) => {
		// Chỉ còn các props cần thiết cho việc render field
		const commonProps = {
			id: field.id,
			label: field.label,
			placeholder: field.placeholder,
			isNoneLife: field.isNoneLife,
			isAboard: field.isAboard,
			...field.componentProps,
		};

		if (field.type === 'custom') {
			return field.renderField({
				...{
					...commonProps,
					label: commonProps.label || '',
				},
			});
		}
		const BuiltInComponent = builtInFilterMap[field.type].component;
		return <BuiltInComponent {...commonProps} />;
	};

	// useEffect(() => {
	// 	if (fetchedDataStatus?.length) {
	// 		setAgentStatusSelected(
	// 			fetchedDataStatus.map((item: any) => item.id).join(';'),
	// 		);
	// 	}
	// 	if (fetchedDataLevel?.length) {
	// 		setAgentLevelSelected(
	// 			fetchedDataLevel.map((item: any) => item.id).join(';'),
	// 		);
	// 	}
	// }, [fetchedDataStatus, fetchedDataLevel]);

	const normalizedFields = fields.map(normalizeFieldConfig);

	return (
		<div className="flex flex-wrap gap-4 items-center h-full">
			<Popover showArrow offset={10} placement="bottom-start">
				<PopoverTrigger>
					<Button className="capitalize" isIconOnly variant="light" size="sm">
						<Tooltip content="Bộ lọc nâng cao">
							<Icons.listFilter className="focus:outline-none text-default-800" />
						</Tooltip>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="md:min-w-[250px] p-5 rounded-md pb-10">
					<div className="h-full w-full">
						<Typography variant="h5" className="text-base font-semibold">
							Bộ lọc nâng cao
						</Typography>
						<Grid
							container
							spacing={4}
							className="mt-2.5 border-t border-t-default-300 pt-5"
						>
							{normalizedFields.map((field) => (
								<Grid item xs={12} sm={6} key={field.id}>
									{renderFilterField(field)}
								</Grid>
							))}
						</Grid>
						{(onApplyFilters || onResetFilters) && (
							<div className="flex justify-end gap-2.5 mt-5 border-t border-t-default-300 pt-5">
								{onResetFilters && (
									<Button variant="light" size="sm" onClick={onResetFilters}>
										Reset
									</Button>
								)}
								{onApplyFilters && (
									<Button size="sm" onClick={onApplyFilters}>
										Áp dụng
									</Button>
								)}
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};
