import { useEffect } from 'react';
import {
	type Control,
	type FieldValues,
	type Path,
	useWatch,
	type UseFormReturn,
} from 'react-hook-form';
import { transformToOptions, useCrud } from '~/hooks';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { SelectField } from './select-field';
import { getFullAddress } from '~/utils/util';
import { Stack } from '~/components/ui';

interface AddressSelectsProps<TFormValues extends FieldValues> {
	control: Control<TFormValues>;
	namePrefix?: Path<TFormValues>;
	name?: Path<TFormValues>;
	isRequired?: boolean;
	col?: number;
	formMethods?: UseFormReturn<TFormValues>;
	fieldOptions?: {
		col?: number;
		districtName?: Path<TFormValues>;
		wardName?: Path<TFormValues>;
		formData?: any;
		streetName?: Path<TFormValues>;
	};
}

export const AddressSelects = <TFormValues extends FieldValues>({
	control,
	name,
	namePrefix = '' as Path<TFormValues>,
	isRequired = false,
	formMethods,
	fieldOptions,
	col,
}: AddressSelectsProps<TFormValues>) => {
	const { setValue, reset, getValues } = formMethods || {};
	const { formData, districtName, wardName, streetName } = fieldOptions || {};
	// console.log('formData', formData);

	const getFieldName = (field: string): Path<TFormValues> => {
		return (namePrefix ? `${namePrefix}.${field}` : field) as Path<TFormValues>;
	};

	const provinceFieldName = getFieldName(name || 'id_province');
	// const districtFieldName = getFieldName(districtName || 'id_district');
	const wardFieldName = getFieldName(wardName || 'id_commune');
	// --- Sử dụng useQuery cho Tỉnh/Thành phố ---
	const { getAll } = useCrud([API_ENDPOINTS.dic.province]);
	const { data: provinceOptions }: any = getAll();
	const watchedProvinceId = useWatch({
		control,
		name: provinceFieldName as Path<TFormValues>,
	});
	// const watchedDistrictId = useWatch({
	// 	control,
	// 	name: districtFieldName as Path<TFormValues>,
	// });
	const watchedWardId = useWatch({
		control,
		name: wardFieldName as Path<TFormValues>,
	});
	const watchedStreet = useWatch({
		control,
		name: streetName || ('customer_address' as Path<TFormValues>),
	});

	// --- Sử dụng useQuery cho Quận/Huyện ---
	// const { getAll: getAllDistrict } = useCrud(
	// 	[API_ENDPOINTS.dic.district, watchedProvinceId || ''],
	// 	{
	// 		endpoint: '',
	// 		id: watchedProvinceId,
	// 	},
	// 	{
	// 		enabled: !!watchedProvinceId,
	// 	},
	// );
	// const { data: districtOptions, isFetching: isLoadingDistricts }: any =
	// 	getAllDistrict();

	// --- Sử dụng useQuery cho Phường/Xã ---
	const { getAll: getAllWard, isFetching: isLoadingWards }: any = useCrud(
		[API_ENDPOINTS.dic.commune, watchedProvinceId || ''],
		{
			endpoint: '',
			id: watchedProvinceId,
		},
		{
			enabled: !!watchedProvinceId,
		},
	);
	const { data: wardOptions }: any = getAllWard();

	// useEffect(() => {
	// 	const currentDistrictId = control._formValues[districtFieldName];
	// 	const isCurrentDistrictValid = districtOptions?.some(
	// 		(option: any) => String(option.id) === String(currentDistrictId),
	// 	);

	// 	if (watchedProvinceId && (!isCurrentDistrictValid || !watchedDistrictId)) {
	// 		setValue?.(districtFieldName as Path<TFormValues>, '' as any, {
	// 			shouldValidate: true,
	// 		});
	// 		setValue?.(wardFieldName as Path<TFormValues>, '' as any, {
	// 			shouldValidate: true,
	// 		});
	// 	} else if (!watchedProvinceId) {
	// 		setValue?.(districtFieldName as Path<TFormValues>, '' as any, {
	// 			shouldValidate: true,
	// 		});
	// 		setValue?.(wardFieldName as Path<TFormValues>, '' as any, {
	// 			shouldValidate: true,
	// 		});
	// 	}
	// }, [
	// 	watchedProvinceId,
	// 	districtOptions,
	// 	setValue,
	// 	// districtFieldName,
	// 	wardFieldName,
	// 	control,
	// ]);

	useEffect(() => {
		const currentWardId = control._formValues[wardFieldName];
		const isCurrentWardValid = wardOptions?.some(
			(option: { id: any }) => String(option.id) === String(currentWardId),
		);

		if (watchedProvinceId && !isCurrentWardValid) {
			setValue?.(wardFieldName as Path<TFormValues>, '' as any, {
				shouldValidate: true,
			});
		} else if (!watchedProvinceId) {
			setValue?.(wardFieldName as Path<TFormValues>, '' as any, {
				shouldValidate: true,
			});
		}
	}, [watchedProvinceId, provinceOptions, wardOptions, setValue, control]);

	useEffect(() => {
		if (
			provinceOptions?.length &&
			// districtOptions?.length &&
			wardOptions?.length
		) {
			const provinceName = provinceOptions?.find(
				(option: any) => String(option.id) === String(watchedProvinceId),
			)?.province_name;

			// const districtName = districtOptions?.find(
			// 	(option: any) => String(option.id) === String(watchedDistrictId),
			// )?.district_name;

			const wardName = wardOptions?.find(
				(option: any) => String(option.id) === String(watchedWardId),
			)?.commune_name;

			const fullAddress = getFullAddress({
				street_address: watchedStreet,
				province_name: provinceName,
				// district_name: districtName,
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
		watchedProvinceId,
		// watchedDistrictId,
		watchedWardId,
		setValue,
		watchedStreet,
	]);
	// useEffect(() => {
	// 	if (formData) {
	// 		const { id_agent, ...newFormData } = formData;
	// 		reset?.(newFormData);
	// 		trigger?.([wardFieldName, provinceFieldName]);
	// 	}
	// }, [formData, wardOptions, provinceOptions]);

	const listProvince = transformToOptions(provinceOptions, 'province_name');
	// const listDistrict = transformToOptions(districtOptions, 'district_name');
	const listWard = transformToOptions(wardOptions, 'commune_name');

	return (
		<Stack alignItems="center" className="gap-x-4">
			<SelectField
				name={provinceFieldName}
				control={control}
				label="Tỉnh/Thành phố"
				options={listProvince}
				isRequired={isRequired}
				placeholder={'Chọn Tỉnh/Thành phố'}
			/>

			{/* <SelectField
				name={districtFieldName}
				control={control}
				label="Quận/Huyện"
				options={listDistrict}
				isRequired={isRequired}
				placeholder={isLoadingDistricts ? 'Đang tải' : 'Chọn Quận/Huyện'}
				isDisabled={!watchedProvinceId || districtOptions?.length === 0}
			/> */}

			<SelectField
				name={wardFieldName}
				control={control}
				label="Phường/Xã"
				options={listWard}
				isRequired={isRequired}
				placeholder={isLoadingWards ? 'Đang tải xã...' : 'Chọn Phường/Xã'}
				isDisabled={
					isLoadingWards || !watchedProvinceId || wardOptions?.length === 0
				}
			/>
		</Stack>
	);
};
