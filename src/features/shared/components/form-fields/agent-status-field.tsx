import { Control, FieldValues, Path } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { SelectField } from './select-field';
import { AutocompleteField } from './auto-complete-field';
interface FieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	defaultValue?: string;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
}

export function AgentStatusField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
	defaultValue,
	isDisabled,
}: FieldProps<TFormValues>) {
	const { agentStatusList } = useCommon();
	const { isFetching } = useCommonData(
		'agentStatusList',
		API_ENDPOINTS.dic.agentStatus,
		{
			enabled: true,
		},
	);
	const listData = transformToOptions(agentStatusList, 'status_name', 'id');
	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={listData}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			defaultOption={defaultOption}
			// defaultSelectedKey={
			// 	defaultOption !== undefined &&
			// 	listData &&
			// 	listData[defaultOption]?.value
			// 		? listData[defaultOption]?.value
			// 		: undefined
			// }
			isDisabled={isDisabled}
		/>
		// <SelectField
		//   control={control}
		//   name={name}
		//   options={listData}
		//   defaultSelectedKeys={
		//     defaultOption !== undefined &&
		//     listData &&
		//     listData?.[defaultOption]?.value
		//       ? listData?.[defaultOption]?.value
		//       : undefined
		//   }
		//   label={label}
		//   isRequired={isRequired}
		//   placeholder={isFetching ? "Đang tải..." : placeholder}
		// />
	);
}
