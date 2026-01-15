import type React from 'react';
import { forwardRef } from 'react';
import { Checkbox, type CheckboxProps } from '@heroui/react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { cn } from '~/lib/utils';

interface CheckboxFieldProps
	extends Omit<CheckboxProps, 'name' | 'checked' | 'onChange' | 'ref'> {
	name: string;
	control: Control<FieldValues>;
	label?: React.ReactNode;
	description?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
	({ name, control, label, description, ...props }, ref) => {
		return (
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => (
					<div className="relative w-full">
						<Checkbox
							isSelected={field.value}
							onValueChange={field.onChange}
							ref={ref}
							{...props}
						>
							{label}
						</Checkbox>
						{description && (
							<p
								data-slot="description"
								className={cn('text-tiny text-default-400 mt-1')}
							>
								{description}
							</p>
						)}
						{fieldState.error && (
							<p data-slot="error" className={cn('text-tiny text-danger mt-1')}>
								{fieldState.error.message}
							</p>
						)}
					</div>
				)}
			/>
		);
	},
);

CheckboxField.displayName = 'CheckboxField';
