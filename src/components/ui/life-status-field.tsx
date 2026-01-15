import type { Control, FieldValues, Path } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { SelectField } from './select-field';
interface LifeStatusFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
}

export function LifeStatusField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
}: LifeStatusFieldProps<TFormValues>) {
	const { lifeStatus } = useCommon();
	const { isFetching } = useCommonData(
		'lifeStatus',
		API_ENDPOINTS.dic.contractLifeStatus,
		{
			enabled: !lifeStatus?.length,
		},
	);
	const listData = transformToOptions(lifeStatus, 'contract_status_name');
	const defaultSelected =
		defaultOption !== undefined && listData && listData[defaultOption]?.value
			? listData[defaultOption]?.value
			: undefined;

	return (
		<SelectField
			control={control}
			name={name}
			options={listData.slice(0, listData.length - 1)}
			defaultSelectedKeys={defaultSelected}
			label={label}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải...' : placeholder}
		/>
	);
}
