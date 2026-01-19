import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Grid } from '@/components/ui';
import type { ToolbarAction } from '@/types/data-table-type';
import { lifeContractStatusFields } from '@/schema-validations';
import { FormField } from '@/features/shared/components/form-fields';

interface LifeContractStatusFormProps<T extends FieldValues> {
	control: Control<T>;
	action: ToolbarAction;
	formMethods?: UseFormReturn<T>;
}

export function LifeContractStatusForm<T extends FieldValues>({
	control,
	formMethods,
}: LifeContractStatusFormProps<T>) {
	const canEdit = +control._formValues.id_life_type === 1;
	return (
		<Grid container spacing={4}>
			{lifeContractStatusFields.map((block: any, k: number) => (
				<Grid item xs={6} lg={block.col} key={k} className="relative">
					{block.extra ? (
						<block.extra
							control={control}
							name={block.name}
							label={block.label}
							placeholder={block.placeholder}
							defaultOption={block.defaultOption}
							formMethods={formMethods}
							options={block.options}
							isRequired={block.isRequired}
							type={block.type}
							isDisabled={block.isDisabled && !canEdit}
						/>
					) : (
						<FormField
							key={block.name}
							control={control}
							name={block.name}
							label={block.label}
							placeholder={block.placeholder}
							options={block.options}
							isRequired={block.isRequired}
							type={block.type}
							fieldProps={{
								isDisabled: block.isDisabled || !canEdit,
							}}
						/>
					)}
				</Grid>
			))}
		</Grid>
	);
}
LifeContractStatusForm.displayName = 'LifeContractForm';
