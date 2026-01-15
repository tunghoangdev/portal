import { Control, FieldValues, Path, useWatch } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { useCommonStore } from '~/stores';
import { SelectField } from './select-field';
interface ContactTypeFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
}

export function ContactTypeField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
}: ContactTypeFieldProps<TFormValues>) {
	const { lifeTypes } = useCommon();
	const { isFetching } = useCommonData(
		'lifeTypes',
		API_ENDPOINTS.dic.lifeType,
		{
			enabled: true,
		},
	);

	// useEffect(() => {
	//   if (providerId) {
	//     setData("lifeTypeId", providerId);
	//   }
	// }, [providerId]);
	const listData = transformToOptions(lifeTypes, 'life_type_name', 'id');
	return (
		<SelectField
			control={control}
			name={name}
			options={listData}
			defaultSelectedKeys={
				defaultOption !== undefined &&
				listData &&
				listData[defaultOption]?.value
					? listData[defaultOption]?.value
					: undefined
			}
			label={label}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải...' : placeholder}
		/>
	);
}
