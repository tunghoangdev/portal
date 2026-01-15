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

interface FieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	formMethods?: UseFormReturn<TFormValues>;
	defaultOption?: number;
	label?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	placeholder?: string;
}

export function DocTypeField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	isDisabled,
	placeholder,
}: FieldProps<TFormValues>) {
	const { documentTypes } = useCommon();
	const { isFetching } = useCommonData(
		'documentTypes',
		API_ENDPOINTS.dic.documentType,
		{
			enabled: true,
		},
	);

	const listData = transformToOptions(documentTypes, 'document_type_name');
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
		//   defaultSelectedKeys={
		//     defaultOption !== undefined &&
		//     listData &&
		//     listData[defaultOption]?.value
		//       ? listData[defaultOption]?.value
		//       : undefined
		//   }
		//   label={label}
		//   isRequired={isRequired}
		//   placeholder={isFetching ? "Đang tải..." : placeholder}
		// />
	);
}
