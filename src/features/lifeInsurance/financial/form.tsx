import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '@/components/ui';
import type { ToolbarAction } from '@/types/data-table-type';
import { financialFormFields } from '@/schema-validations';
import { FormField } from '@/features/shared/components/form-fields';

interface ProductFormProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
	removeFields?: string[];
}

export function LifeFinancialForm<T extends FieldValues>({
	control,
	formMethods,
	removeFields,
}: ProductFormProps<T>) {
	const fields = financialFormFields.filter(
		(field) => !removeFields?.includes(field.name),
	);

	return (
		<Grid container spacing={4}>
			{fields.map((item, index) => {
				return item.type === 'hidden' ? (
					<FormField
						key={item.name}
						control={control}
						name={item.name}
						type="hidden"
					/>
				) : (
					<Grid item xs={6} lg={item.col} key={index}>
						{item.extra ? (
							<item.extra
								control={control}
								{...item}
								formMethods={formMethods}
							/>
						) : (
							<FormField
								key={item.name}
								control={control}
								{...item}
								formMethods={formMethods}
							/>
						)}
					</Grid>
				);
			})}
		</Grid>
	);
}
LifeFinancialForm.displayName = 'LifeFinancialForm';
