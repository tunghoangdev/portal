// ProvinceSelect.tsx
import React, { useMemo } from 'react';
import {
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { SelectField } from './select-field';
import { useCrud, transformToOptions } from '~/hooks'; // Đảm bảo import transformToOptions
import { API_ENDPOINTS } from '~/constant/api-endpoints';

interface ProvinceSelectProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	name: Path<TFormValues>;
	isRequired: boolean;
	formMethods: UseFormReturn<TFormValues>; // Cần để access setValue/getValues nếu cần
}

export const ProvinceSelect = <TFormValues extends FieldValues>({
	control,
	name,
	isRequired,
	formMethods,
}: ProvinceSelectProps<TFormValues>) => {
	// --- Sử dụng useCrud cho Tỉnh/Thành phố ---
	const { getAll: getProvinces } = useCrud<any>([API_ENDPOINTS.dic.province]);
	const { data: provinceData, isFetching: isLoadingProvinces }: any =
		getProvinces();
	const provinceOptions = useMemo(
		() => provinceData?.list || [],
		[provinceData],
	);

	const listProvinceOptions = useMemo(
		() => transformToOptions(provinceOptions, 'province_name'),
		[provinceOptions],
	);

	return (
		<SelectField
			name={name}
			control={control}
			label="Tỉnh/Thành phố"
			options={listProvinceOptions}
			isRequired={isRequired}
			placeholder={isLoadingProvinces ? 'Đang tải' : 'Chọn Tỉnh/Thành phố'}
			isDisabled={isLoadingProvinces}
		/>
	);
};
