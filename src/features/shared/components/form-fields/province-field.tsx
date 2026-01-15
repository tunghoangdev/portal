import React, { useMemo } from 'react';
import {
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { transformToOptions, useCommonData } from '~/hooks'; // Đảm bảo import transformToOptions
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { AutocompleteField } from './auto-complete-field';

interface ProvinceSelectProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	name: Path<TFormValues>;
	isRequired?: boolean;
	isDisabled?: boolean;
	label?: string;
	placeholder?: string;
	formMethods: UseFormReturn<TFormValues>; // Cần để access setValue/getValues nếu cần
}

export const ProvinceSelect = <TFormValues extends FieldValues>({
	control,
	name,
	isRequired,
	isDisabled,
	placeholder,
	label,
}: ProvinceSelectProps<TFormValues>) => {
	// --- Sử dụng useCrud cho Tỉnh/Thành phố ---
	// const { getAll: getProvinces } = useCrud<any>([API_ENDPOINTS.dic.province]);
	// const { data: provinceData, isFetching }: any = getProvinces();
	//   const { setData } = useCommonStore();
	const { data: provinceData, isFetching } = useCommonData(
		'provinceList',
		API_ENDPOINTS.dic.province,
		{
			enabled: true,
		},
	);

	const listProvinceOptions = useMemo(
		() => transformToOptions(provinceData, 'province_name'),
		[provinceData],
	);
	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={listProvinceOptions}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			isDisabled={isDisabled}
		/>
	);
	// return (
	//   <SelectField
	//     name={name}
	//     control={control}
	//     label={label}
	//     options={listProvinceOptions}
	//     isRequired={isRequired}
	//     placeholder={isFetching ? "Đang tải" : placeholder}
	//     isDisabled={isDisabled}
	//   />
	// );
};
