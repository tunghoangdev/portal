import { Grid } from '@/components/ui';
import { ROLES } from '@/constant';
import { FormField } from '@/features/shared/components/form-fields';
import { useAuth } from '@/hooks';
import { customerFormFields } from '@/schema-validations';
import { useMemo } from 'react';
import { Control, FieldValues, UseFormReturn } from 'react-hook-form';
interface Props<T extends FieldValues> {
	control: Control<T>;
	formMethods?: UseFormReturn<T>;
	formData?: any;
}
export function StaffCustomerForm<T extends FieldValues>({
	control,
	formMethods,
	formData,
}: Props<T>) {
	const { role } = useAuth();
	const newFields = useMemo(() => {
		return customerFormFields.map((item) => {
			item.isDisabled =
				(item.name === 'customer_phone' && !!formData?.id) ||
				(item.name === 'agent_phone' && !!formData?.id) ||
				(item.name === 'agent_phone' && role === ROLES.AGENT);
			return item;
		});
	}, [role, formData]);

	return (
		<Grid container spacing={4}>
			{newFields.map((item, index) => (
				<Grid item xs={6} lg={item.col} key={index}>
					{item.extra ? (
						<item.extra
							control={control}
							formMethods={formMethods}
							{...item}
							fieldOptions={{
								...item.fieldOptions,
								formData,
							}}
						/>
					) : (
						<FormField key={item.name} control={control} {...item} />
					)}
				</Grid>
			))}
		</Grid>
	);
}
