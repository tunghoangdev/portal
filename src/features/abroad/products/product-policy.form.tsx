import { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '~/components/ui';
import { FormField } from '~/features/shared/components/form-fields';

interface ProductPolicyFormProps<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
	fields?: any[];
}
export const ProductPolicyForm = <T extends FieldValues>({
	control,
	fields,
}: ProductPolicyFormProps<T>) => {
	if (!fields) return null;
	return (
		<Grid container spacing={6} className="gap-5">
			{fields.map((item: any, index: number) => (
				<Grid item xs={6} lg={item.col} key={index}>
					{item.extra ? (
						<item.extra control={control} {...item} />
					) : (
						<FormField key={item.name} control={control} {...item} />
					)}
				</Grid>
			))}
		</Grid>
	);
};
