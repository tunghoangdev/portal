import { Control, FieldValues, Path } from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { AutocompleteField } from './auto-complete-field';
import { useMemo } from 'react';
interface ContactTypeFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	removeIndex?: number;
	label?: string;
	placeholder?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
}

export function ContactTypeField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	isDisabled,
	removeIndex,
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

	const listData = transformToOptions(lifeTypes, 'life_type_name', 'id');
	const newList = useMemo(() => {
		if (!listData?.length) return [];
		if (removeIndex !== undefined) {
			// remove the selected option
			return listData.slice(1, listData.length);
		}
		// only return the first option
		return listData.slice(0, 1);
	}, [listData, removeIndex]);
	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={newList}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			defaultOption={defaultOption}
			// defaultSelectedKey={
			// 	defaultOption !== undefined &&
			// 	listData &&
			// 	listData[defaultOption]?.value
			// 		? listData[defaultOption]?.value?.toString()
			// 		: undefined
			// }
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
		// 	label={label}
		// 	isRequired={isRequired}
		// 	placeholder={isFetching ? 'Đang tải...' : placeholder}
		// />
	);
}
