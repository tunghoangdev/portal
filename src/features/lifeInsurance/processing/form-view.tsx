import type { FieldValues, Control, UseFormReturn } from 'react-hook-form';
import { Divider, Grid } from '~/components/ui';
import { formFields } from './form.schema';
import { FormField } from '~/features/shared/components/form-fields';
import { Fragment, useEffect, useMemo } from 'react';
import { useModalStackConfig } from '~/stores';
interface FormViewProps<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
	isEdit?: boolean;
}
const notAllowed = [
	'agent_phone',
	'customer_phone',
	'number_request',
	// 'number_contract',
	'id_life_provider',
	'id_finan',
	'id_product_main',
];
export function FormView<T extends FieldValues>({
	control,
	formMethods,
}: FormViewProps<T>) {
	const config: any = useModalStackConfig();
	const { watch, formState, getValues, reset } = formMethods || {};
	useEffect(() => {
		if (
			config?.type === 'form' &&
			config.defaultItemValues &&
			getValues?.()?.id
		) {
			// Lấy formData từ payload
			const formData = config.defaultItemValues;
			// Reset form với dữ liệu mới
			reset?.({ ...formData, id: formData?.id?.toString() });
		}
	}, [config, reset]);
	const watchNumberContract = watch?.('number_contract' as any);
	const watchId = watch?.('id' as any);
	const newFormFields = useMemo(() => {
		return formFields.map((block: any) => {
			let newBlock = [...block];
			newBlock.map((f: any) => {
				f.isRequired = f.name === 'number_contract';
				if (watchNumberContract) {
					f.isDisabled = !!watchId && notAllowed.includes(f.name);
				} else {
					f.isDisabled = notAllowed.includes(f.name);
				}
				return f;
			});
			return newBlock;
		});
	}, [watchId, watchNumberContract]);

	return (
		<Grid container spacing={6}>
			{newFormFields.map((block: any, k: number) => {
				return (
					<Fragment key={k}>
						{k > 0 && (
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
											removeIndex
											defaultValues={config.defaultItemValues}
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
FormView.displayName = 'FormView';
