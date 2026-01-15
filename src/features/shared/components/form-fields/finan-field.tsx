import {
	useWatch,
	type Control,
	type FieldValues,
	type Path,
	type UseFormReturn,
} from 'react-hook-form';
import { type InputProps } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { transformToOptions, useCommon, useCommonData } from '~/hooks';
import { AutocompleteField } from './auto-complete-field';
import { useCrud } from '~/hooks/use-crud-v2';

interface FieldProps<TFormValues extends FieldValues>
	extends Omit<InputProps, 'name' | 'ref'> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	formMethods?: UseFormReturn<TFormValues>;
	defaultOption?: number;
	label?: string;
	storeName?: any;
	isRequired?: boolean;
	isDisabled?: boolean;
	placeholder?: string;
}

export function FinanField<TFormValues extends FieldValues>({
	name,
	control,
	defaultOption,
	label,
	isRequired,
	isDisabled,
	placeholder,
	storeName,
}: FieldProps<TFormValues>) {
	const providerId = useWatch({
		control,
		name: storeName || 'id_life_provider',
	});

	const { getAll } = useCrud(
		[API_ENDPOINTS.dic.lifeFinanByProvider, providerId],
		{ endpoint: '', id: +providerId },
		{ enabled: !!providerId },
	);
	const { data: lifeFinanFetch, isFetching }: any = getAll();
	const listData = transformToOptions(lifeFinanFetch, 'finan_name');
	return (
		<AutocompleteField
			name={name}
			control={control}
			label={label}
			options={listData}
			isRequired={isRequired}
			placeholder={isFetching ? 'Đang tải' : placeholder}
			isDisabled={isDisabled}
		/>
	);
}
