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
interface WardSelectProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	name: Path<TFormValues>;
	isRequired: boolean;
	formMethods: UseFormReturn<TFormValues>;
}

export const WardSelect = <TFormValues extends FieldValues>({
	control,
	name,
	isRequired,
	formMethods,
}: WardSelectProps<TFormValues>) => {
	const { setValue, getValues } = formMethods;
	const { districtId: watchedDistrictId } = useCommon();
	// --- Sử dụng useCrud cho Phường/Xã ---
	const { getAll: getWards } = useCrud<any>(
		[API_ENDPOINTS.dic.commune, String(watchedDistrictId || '')],
		{ id: watchedDistrictId },
		{ enabled: !!watchedDistrictId },
	);
	const { data: wardData, isFetching: isLoadingWards }: any = getWards();
	const wardOptions = useMemo(() => wardData?.list || [], [wardData]);
	useEffect(() => {
		const currentWardId = getValues(name);
		const isCurrentWardValid = wardOptions.some(
			(option: any) => String(option.id) === String(currentWardId),
		);
		if ((watchedDistrictId && !isCurrentWardValid) || !watchedDistrictId) {
			setValue(name, '' as any, { shouldValidate: true });
		}
	}, [watchedDistrictId, wardOptions, setValue, getValues, name, control]);

	const listWardOptions = useMemo(
		() => transformToOptions(wardOptions, 'commune_name'),
		[wardOptions],
	);

	return (
		<SelectField
			name={name}
			control={control}
			label="Phường/Xã"
			options={listWardOptions}
			isRequired={isRequired}
			placeholder={isLoadingWards ? 'Đang tải' : 'Chọn Phường/Xã'}
			isDisabled={
				isLoadingWards || !watchedDistrictId || wardOptions.length === 0
			}
		/>
	);
};
