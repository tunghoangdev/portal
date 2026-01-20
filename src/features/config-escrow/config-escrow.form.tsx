import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '@/components/ui';
import type { ToolbarAction } from '@/types/data-table-type';
import { configEscrowFormFields } from '@/schema-validations/config-escrow.schema';
import { FormField } from '@/features/shared/components/form-fields';

interface ProductFormProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
}

export function ConfigEscrowForm<T extends FieldValues>({
	control,
}: ProductFormProps<T>) {
	return (
		<Grid container spacing={4}>
			{configEscrowFormFields.map((block: any, k: number) => (
				<Grid item xs={6} lg={block.col} key={k}>
					{block.extra ? (
						<block.extra control={control} {...block} />
					) : (
						<FormField control={control} {...block} />
					)}
					{}
				</Grid>
			))}
		</Grid>
	);
}
ConfigEscrowForm.displayName = 'ConfigEscrowForm';
