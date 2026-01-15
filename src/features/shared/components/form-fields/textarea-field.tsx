
import React, { forwardRef } from 'react';
import { Textarea, type TextAreaProps } from '@heroui/react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { cn } from '~/lib/utils';

interface TextareaFieldProps extends Omit<TextAreaProps, 'name' | 'ref'> {
	name: string;
	control: Control<FieldValues>;
	label?: string;
	description?: string;
}

export const TextareaField = forwardRef<
	HTMLTextAreaElement,
	TextareaFieldProps
>(({ name, control, label, description, ...props }, ref) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Textarea
					{...field}
					ref={ref}
					label={label}
					description={description}
					variant="bordered"
					radius="sm"
					labelPlacement="outside"
					classNames={{
						label: cn(
							'font-semibold text-foreground text-small pb-1',
							props.classNames?.label,
						),
						inputWrapper: cn(
							'border shadow-xs',
							props.classNames?.inputWrapper,
						),
						description: cn('pt-1', props.classNames?.description),
						errorMessage: cn('pt-1', props.classNames?.errorMessage),
						base: cn('w-full', props.classNames?.base),
						input: cn('text-small', props.classNames?.input),
					}}
					{...props}
					isInvalid={!!fieldState.error}
					errorMessage={fieldState.error?.message}
				/>
			)}
		/>
	);
});

TextareaField.displayName = 'TextareaField';
