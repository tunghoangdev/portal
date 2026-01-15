import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '~/components/ui';
import type { ToolbarAction } from '~/types/data-table-type';
import { formFields } from './form.schema';
import { FormField } from '~/features/shared/components/form-fields';

interface FormViewProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
}

export function FormView<T extends FieldValues>({
	control,
	formMethods,
}: FormViewProps<T>) {
	return (
		<Grid container spacing={4}>
			{formFields.map((field: any, k: number) => {
				return field.type === 'hidden' ? (
					<FormField key={k} control={control} {...field} />
				) : (
					<Grid item xs={6} lg={field.col} key={k}>
						{field.extra ? (
							<field.extra
								control={control}
								{...field}
								formMethods={formMethods}
							/>
						) : (
							<FormField key={field.name} control={control} {...field} />
						)}
					</Grid>
				);
			})}
		</Grid>
	);
}
FormView.displayName = 'FormView';
