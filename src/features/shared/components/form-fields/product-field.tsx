import {
	type Control,
	type FieldValues,
	type Path,
	useFieldArray,
} from 'react-hook-form';
import { Grid } from '~/components/ui';
interface FieldProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<any>;
	subFields: any[];
	placeholder?: string;
	isDisabled?: boolean;
	isRequired?: boolean;
	label?: string;
	customPath?: string;
	showRemove?: boolean;
}

export function ProductField<TFormValues extends FieldValues>({
	name,
	control,
	subFields,
}: FieldProps<TFormValues>) {
	const { fields } = useFieldArray({
		control,
		name,
	});
	return (
		<>
			{fields.map((field, index) => (
				<Grid container spacing={4} key={field.id}>
					{subFields.map((subField: any, i: number) => (
						<Grid item xs={subField.col} key={i}>
							<subField.extra
								{...subField}
								control={control}
								name={`${name}.${index}.${subFields?.[i]?.name}`}
							/>
						</Grid>
					))}
				</Grid>
			))}
		</>
	);
}
