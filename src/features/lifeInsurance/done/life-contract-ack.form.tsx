import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '@/components/ui';
import type { ToolbarAction } from '@/types/data-table-type';
import { lifeContractAckFields } from '@/schema-validations';
import { FormField } from '@/features/shared/components/form-fields';

interface LifeContractStatusFormProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
}

export function LifeContractAckForm<T extends FieldValues>({
	control,
}: LifeContractStatusFormProps<T>) {
	return (
		<Grid container spacing={4}>
			{lifeContractAckFields.map((block: any, k: number) => (
				<Grid item xs={6} lg={block.col} key={k} className="relative">
					<FormField key={block.name} control={control} {...block} />
				</Grid>
			))}
		</Grid>
	);
}
LifeContractAckForm.displayName = 'LifeContractAckForm';
