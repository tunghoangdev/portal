import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '~/components/ui';
import type { ToolbarAction } from '~/types/data-table-type';
import { formFields } from './form.schema';
import { FormField } from '~/features/shared/components/form-fields';
import { useMemo } from 'react';
const notAllowed = ['agent_phone'];
interface FormViewProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
}
export function FormView<T extends FieldValues>({
	control,
	formMethods,
}: FormViewProps<T>) {
	const newFormFields = useMemo(() => {
		return formFields.map((f: any) => {
			f.isDisabled = notAllowed.includes(f.name);
			return f;
		});
	}, []);
	return (
		<Grid container spacing={6}>
			{newFormFields.map((field: any, k: number) => {
				return field.type === 'hidden' ? (
					<FormField key={k} control={control} {...field} />
				) : (
					<Grid item xs={12} lg={field.col} key={k}>
						{field.extra ? (
							<field.extra
								{...field}
								control={control}
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
