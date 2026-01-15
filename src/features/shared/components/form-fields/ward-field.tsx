import React, { useEffect, useMemo } from 'react';
import {
	useWatch,
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { SelectField } from './select-field';
import { transformToOptions, useCommon, useCommonData } from '~/hooks'; // Đảm bảo import transformToOptions
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { getFullAddress } from '~/utils/util';
import { AutocompleteField } from './auto-complete-field';

interface WardSelectProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	name: Path<TFormValues>;
	isRequired?: boolean;
	isDisabled?: boolean;
	label?: string;
	placeholder?: string;
	fieldWach?: Path<TFormValues>;
	fieldAddressWach?: Path<TFormValues>;
	formMethods: UseFormReturn<TFormValues>; // Cần để access setValue/getValues nếu cần
}

export const WardSelect = <TFormValues extends FieldValues>({
	control,
	name,
	isRequired,
	isDisabled,
	formMethods,
	fieldWach,
	fieldAddressWach,
	label,
	placeholder,
}: WardSelectProps<TFormValues>) => {
	const { setValue } = formMethods || {};
	const watchedProvinceId = useWatch({
		control,
		name: fieldWach || ('id_province' as Path<TFormValues>),
	});

	const watchedWardId = useWatch({
		control,
		name,
	});

	const watchedAddress = useWatch({
		control,
		name: fieldAddressWach || ('address' as Path<TFormValues>),
	});

	// console.log('watchedProvinceId', watchedProvinceId);
	// const { setData } = useCommonStore();
	const { wardList, provinceList } = useCommon();
	const { isFetching } = useCommonData('wardList', API_ENDPOINTS.dic.commune, {
		enabled: !!watchedProvinceId,
		data: {
			id: watchedProvinceId,
		},
	});

	useEffect(() => {
		if (provinceList?.length && wardList?.length) {
			const provinceName = provinceList?.find(
				(option: any) => String(option.id) === String(watchedProvinceId),
			)?.province_name;

			const wardName = wardList?.find(
				(option: any) => String(option.id) === String(watchedWardId),
			)?.commune_name;

			const fullAddress = getFullAddress({
				street_address: watchedAddress,
				province_name: provinceName,
				commune_name: wardName,
			});

			if (fullAddress) {
				setValue?.('full_address' as Path<TFormValues>, fullAddress as any, {
					shouldValidate: true,
					shouldDirty: true,
				});
			} else {
				setValue?.('full_address' as Path<TFormValues>, '' as any, {
					shouldValidate: true,
				});
			}
		}
	}, [
		provinceList,
		wardList,
		watchedAddress,
		watchedWardId,
		watchedProvinceId,
	]);

	const listWardOptions = useMemo(
		() => transformToOptions(wardList, 'commune_name'),
		[wardList],
	);

	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={listWardOptions}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			isDisabled={isDisabled || !watchedProvinceId || isFetching}
		/>
		// <SelectField
		//   name={name}
		//   control={control}
		//   label={label}
		//   options={listWardOptions}
		//   isRequired={isRequired}
		//   placeholder={isFetching ? "Đang tải" : placeholder}
		//   isDisabled={isDisabled}
		// />
	);
};
