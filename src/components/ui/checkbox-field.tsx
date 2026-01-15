import { Checkbox, type CheckboxProps } from '@heroui/react';
import { Controller, type Control } from 'react-hook-form';
// Omit 'name' and 'checked', 'onChange' as Controller handles them
interface CheckboxFieldProps
	extends Omit<CheckboxProps, 'name' | 'checked' | 'onCheckedChange'> {
	name: string;
	control: Control<any>;
}

export const CheckboxField = ({
	name,
	control,
	...props
}: CheckboxFieldProps) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Checkbox
					isSelected={!!field.value} // `isSelected` is common for boolean state in UI libs
					onValueChange={field.onChange} // Connect to react-hook-form's onChange
					radius="sm"
					classNames={{
						// Add any custom classes for the Checkbox here if needed
						label: 'font-semibold',
					}}
					{...props}
					isInvalid={!!fieldState.error}
					errorMessage={fieldState.error?.message}
				/>
			)}
		/>
	);
};
