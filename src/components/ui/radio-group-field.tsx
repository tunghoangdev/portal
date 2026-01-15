import {
	RadioGroup,
	Radio,
	type RadioGroupProps,
	type RadioProps,
} from '@heroui/react';
import { Controller, type Control } from 'react-hook-form';
import React from 'react';

// Omit 'name' from RadioGroupProps and 'children' as we'll pass options
// Also omit 'value' and 'onChange' as Controller handles them
interface RadioGroupFieldProps
	extends Omit<
		RadioGroupProps,
		'name' | 'children' | 'value' | 'onValueChange'
	> {
	name: string;
	control: Control<any>;
	options: { label: string; value: string | number }[]; // Define options for radio buttons
	radioProps?: Omit<RadioProps, 'value' | 'children'>; // Optional props for individual Radio components
}

export const RadioGroupField = ({
	name,
	control,
	options,
	radioProps,
	...props
}: RadioGroupFieldProps) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<RadioGroup
					value={String(field.value || '')} // Ensure value is a string
					onValueChange={field.onChange} // Connect to react-hook-form's onChange
					labelPlacement="outside"
					classNames={{
						label: 'font-semibold',
						// Add any custom classes for the RadioGroup wrapper here if needed
					}}
					{...props}
					isInvalid={!!fieldState.error}
					errorMessage={fieldState.error?.message}
				>
					{options.map((option) => (
						<Radio
							key={option.value}
							value={String(option.value)} // Ensure value is a string
							{...radioProps}
						>
							{option.label}
						</Radio>
					))}
				</RadioGroup>
			)}
		/>
	);
};
