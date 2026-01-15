import { Control, FieldValues, Path } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useAuth, useCommon, useCommonData } from '~/hooks';
import { SelectField } from './select-field';
import { AutocompleteField } from './auto-complete-field';
import { ROLES } from '~/constant';
interface FieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
}

export function IssuedPlaceField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
	isDisabled,
}: FieldProps<TFormValues>) {
	const { provinceIssuedList } = useCommon();
	const {role} = useAuth();
	 const basePath = role === ROLES.SAMTEK ? `/root/${API_ENDPOINTS.dic.issuedPlace}` : API_ENDPOINTS.dic.issuedPlace;
	const { isFetching } = useCommonData(
		'provinceIssuedList',
		basePath,
		{
			enabled: true,
		},
	);
	const listData = transformToOptions(
		provinceIssuedList,
		'issued_place_name',
		'issued_place_name',
	);
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
		//   control={control}
		//   name={name}
		//   options={listData}
		//   defaultSelectedKeys={listData[defaultOption || 0]?.value}
		//   label={label}
		//   isDisabled={isDisabled}
		//   isRequired={isRequired}
		//   placeholder={isFetching ? "Đang tải..." : placeholder}
		// />
	);
}
