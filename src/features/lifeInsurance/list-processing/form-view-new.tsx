import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Divider, Grid } from '~/components/ui';
import { formFields } from './form.schema';
import { FormField } from '~/features/shared/components/form-fields';
import { Fragment, useMemo } from 'react';
interface FormViewProps<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
}

export function FormViewNew<T extends FieldValues>({
	control,
	formMethods,
}: FormViewProps<T>) {
	const { watch } = formMethods || {};
	const watchId = watch?.('id' as any);
	const newFormFields = useMemo(() => {
		return formFields.map((block: any) => {
			return block.filter(
				(f: any) => f.name !== 'number_contract' && f.name !== 'id_life_type',
			);
		});
	}, [watchId]);

	return (
		<Grid container spacing={6}>
			{newFormFields.map((block: any, k: number) => {
				return (
					<Fragment key={k}>
						{k > 1 && (
							<Grid item xs={12}>
								<Divider key={k} className="my-2" />
							</Grid>
						)}
						{block.map((field: any, idex: number) => {
							return field.type === 'hidden' ? (
								<FormField key={idex} control={control} {...field} />
							) : (
								<Grid item xs={6} lg={field.col} key={idex}>
									{field.extra ? (
										<field.extra
											control={control}
											formMethods={formMethods}
											{...field}
										/>
									) : (
										<FormField key={field.name} control={control} {...field} />
									)}
								</Grid>
							);
						})}
					</Fragment>
				);
			})}
		</Grid>
	);
}
FormViewNew.displayName = 'FormViewNew';
