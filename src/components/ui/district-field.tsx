// DistrictSelect.tsx
import React, { useEffect, useMemo } from 'react';
import {
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { SelectField } from './select-field';
import { useCrud, transformToOptions, useCommon } from '~/hooks';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCommonStore } from '~/stores';
interface DistrictSelectProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	name: Path<TFormValues>;
	isRequired: boolean;
	formMethods: UseFormReturn<TFormValues>;
	wardFieldName: Path<TFormValues>;
}

export const DistrictSelect = <TFormValues extends FieldValues>({
	control,
	name,
	isRequired,
	formMethods,
	wardFieldName,
}: DistrictSelectProps<TFormValues>) => {
	const { setValue, getValues } = formMethods;
	const { provinceId: watchedProvinceId } = useCommon();
	const { setData } = useCommonStore();
	// --- Sử dụng useCrud cho Quận/Huyện ---
	const { getAll: getDistricts } = useCrud<any>(
		[API_ENDPOINTS.dic.district, String(watchedProvinceId || '')],
		{ id: watchedProvinceId },
		{ enabled: !!watchedProvinceId }, // Chỉ fetch khi có tỉnh
	);
	const { data: districtData, isFetching: isLoadingDistricts }: any =
		getDistricts();
	const districtOptions = useMemo(
		() => districtData?.list || [],
		[districtData],
	);

	// --- Effect để reset và validate Quận/Huyện khi Tỉnh/Thành phố thay đổi ---
	useEffect(() => {
		const currentDistrictId = getValues(name);
		const isCurrentDistrictValid = districtOptions.some(
			(option: any) => String(option.id) === String(currentDistrictId),
		);

		if (
			(watchedProvinceId && (!isCurrentDistrictValid || !currentDistrictId)) ||
			!watchedProvinceId
		) {
			setValue(name, '' as any, { shouldValidate: true });
			setValue(wardFieldName, '' as any, { shouldValidate: true }); // Reset trường xã
		}
	}, [
		watchedProvinceId,
		districtOptions,
		setValue,
		getValues,
		name,
		wardFieldName,
		control, // Thêm control vào deps vì getValues/setValue có thể phụ thuộc vào nó trong một số trường hợp
	]);

	const listDistrictOptions = useMemo(
		() => transformToOptions(districtOptions, 'district_name'),
		[districtOptions],
	);

	return (
		<SelectField
			name={name}
			control={control}
			label="Quận/Huyện"
			options={listDistrictOptions}
			isRequired={isRequired}
			placeholder={isLoadingDistricts ? 'Đang tải' : 'Chọn Quận/Huyện'}
			isDisabled={
				isLoadingDistricts || !watchedProvinceId || districtOptions.length === 0
			}
		/>
	);
};
