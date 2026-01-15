import {
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { type InputProps } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { AutocompleteField } from './auto-complete-field';

interface PeriodFieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	formMethods?: UseFormReturn<TFormValues>;
	defaultOption?: number;
	label?: string;
	isRequired?: boolean;
	placeholder?: string;
	isDisabled?: boolean;
}

export function PeriodField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
	isDisabled,
}: PeriodFieldProps<TFormValues>) {
	const { periodList } = useCommon();
	const { isFetching } = useCommonData(
		'periodList',
		API_ENDPOINTS.dic.commissionPeriod,
		{
			enabled: true,
		},
	);
	const listData = transformToOptions(periodList, 'period_name', 'period_name');
	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={listData}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			defaultSelectedKey={
				defaultOption !== undefined &&
				listData &&
				listData[defaultOption]?.value
					? listData[defaultOption]?.value
					: undefined
			}
			isDisabled={isDisabled}
		/>
		// <SelectField
		// 	control={control}
		// 	name={name}
		// 	options={listData}
		// 	defaultSelectedKeys={
		// 		defaultOption !== undefined &&
		// 		listData &&
		// 		listData[defaultOption]?.value
		// 			? listData[defaultOption]?.value
		// 			: undefined
		// 	}
		// 	label={label}
		// 	isRequired={isRequired}
		// 	placeholder={isFetching ? 'Đang tải...' : placeholder}
		// />
	);
}
