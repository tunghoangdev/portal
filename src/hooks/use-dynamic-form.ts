import { useMemo, useCallback } from 'react';
import {
	useForm,
	UseFormReturn,
	FieldValues,
	DefaultValues,
	Control,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// --- Interface cho Props của Hook ---
interface UseDynamicFormProps<
	TItemFormFields,
	TExportFormFields extends FieldValues,
> {
	itemSchema?: z.ZodObject<any, any, any, TItemFormFields, any>; // Schema cho item (create/edit)
	exportSchema?: z.ZodObject<any, any, any, TExportFormFields, any>; // Schema cho export (có thể không có)
	defaultItemValues?: TItemFormFields; // Giá trị mặc định cho item
	defaultExportValues?: TExportFormFields; // Giá trị mặc định cho export
}

// --- Interface cho Return của Hook ---
interface DynamicFormManager<TAllFields extends FieldValues> {
	control: Control<TAllFields>;
	formState: UseFormReturn<TAllFields>['formState'];
	formMethods: UseFormReturn<TAllFields>;
	resetFormState: (values?: TAllFields, options?: any) => void;
}

// --- Hook useDynamicForm ---
export function useDynamicForm<
	TItemFormFields extends FieldValues | null,
	TExportFormFields extends FieldValues = FieldValues, // Generic type cho dữ liệu export (mặc định là FieldValues rỗng)
	// TAllFields là sự kết hợp của TItemFormFields và TExportFormFields
	TAllFields extends FieldValues = TItemFormFields & TExportFormFields,
>({
	itemSchema,
}: UseDynamicFormProps<
	TItemFormFields,
	TExportFormFields
>): DynamicFormManager<TAllFields> {
	const initialFormDefaults = useMemo(() => {
		if (itemSchema) {
			const emptyDefaults = {};
			return emptyDefaults as TAllFields;
		}
		return {} as TAllFields;
	}, [itemSchema]);

	const formMethods = useForm<TAllFields>({
		mode: 'onChange',
		resolver: itemSchema
			? zodResolver(itemSchema as unknown as z.ZodType<TAllFields>)
			: undefined,
		defaultValues: initialFormDefaults as DefaultValues<TAllFields>,
	});

	const { reset, control, handleSubmit, formState } = formMethods;

	// Hàm để reset trạng thái của hook (đặt formAction về null)
	// const resetFormState = useCallback(() => {
	//   setInternalFormAction("add");
	//   setDataToEdit(null);
	//   reset({
	//     ...defaultItemValues,
	//     ...(defaultExportValues || {}),
	//   } as TAllFields);
	// }, [defaultItemValues, defaultExportValues, reset]);
	const resetFormState = useCallback(
		(
			values?: TAllFields,
			options?: {
				keepDirty?: boolean;
				keepErrors?: boolean;
				keepIsValid?: boolean;
				keepTouched?: boolean;
			},
		) => {
			// Chỉ reset nếu giá trị mới khác với giá trị hiện tại của form
			// Đây là một cách để tránh vòng lặp vô hạn
			const currentFormValues = formMethods.getValues();

			if (JSON.stringify(currentFormValues) !== JSON.stringify(values)) {
				reset(values, options);
			}
		},
		[reset, formMethods],
	);
	return {
		formState,
		formMethods,
		control,
		resetFormState,
	};
}
