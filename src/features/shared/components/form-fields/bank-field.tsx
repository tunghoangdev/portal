import { Control, FieldValues, Path } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useAuth, useCommon, useCommonData } from '~/hooks';
import { AutocompleteField } from './auto-complete-field';
import { ROLES } from '~/constant';
interface ContactTypeFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
}

export function BankField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	placeholder,
	isDisabled,
}: ContactTypeFieldProps<TFormValues>) {
	const { listBank } = useCommon();
	const {role} = useAuth();
		 const basePath = role === ROLES.SAMTEK ? `/root/${API_ENDPOINTS.dic.bank}` : API_ENDPOINTS.dic.bank;
	const { isFetching } = useCommonData('listBank', basePath, {
		enabled: true,
	});
	const listData = transformToOptions(listBank, 'bank_name', 'id');
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
		// 	isDisabled={isDisabled}
		// 	label={label}
		// 	isRequired={isRequired}
		// 	placeholder={isFetching ? 'Đang tải...' : placeholder}
		// />
	);
}
