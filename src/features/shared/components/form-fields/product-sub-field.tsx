import {
	type Control,
	type FieldValues,
	type Path,
	useWatch,
} from 'react-hook-form';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions } from '~/hooks';
import { useMemo } from 'react';
import { useCrud } from '~/hooks/use-crud-v2';
import { AutocompleteField } from './auto-complete-field';
interface ProductSubFieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	defaultOption?: number;
	placeholder?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	label?: string;
}

export function ProductSubField<TFormValues extends FieldValues>({
	name,
	control,
	placeholder,
	...props
}: ProductSubFieldProps<TFormValues>) {
	const providerId = useWatch({
		control,
		name: 'id_life_provider',
	});
	const { getAll } = useCrud(
		[API_ENDPOINTS.dic.lifeSubProductByMain, providerId],
		{
			endpoint: '',
			id: +providerId,
		},
		{
			enabled: !!providerId,
		},
	);
	const { data: lifeSubProductFetch, isFetching }: any = getAll();

	const listData = useMemo(() => {
		if (!lifeSubProductFetch) {
			return [];
		}
		return transformToOptions(lifeSubProductFetch, 'product_name', 'id');
	}, [lifeSubProductFetch]);
	return (
		<AutocompleteField
			name={name}
			control={control}
			options={listData}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			{...props}
		/>
	);
}
