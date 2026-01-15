import type React from 'react';
import { forwardRef } from 'react';
import {
	RadioGroup,
	Radio,
	type RadioGroupProps,
	type RadioProps,
} from '@heroui/react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { cn } from '~/lib/utils';

type RadioOption = {
	value: string;
	label: React.ReactNode;
	description?: string;
	isDisabled?: boolean;
};

interface RadioGroupFieldProps
	extends Omit<
		RadioGroupProps,
		'name' | 'children' | 'value' | 'onValueChange'
	> {
	name: string;
	control: Control<FieldValues>;
	label?: React.ReactNode;
	description?: string;
	options: RadioOption[]; // Các tùy chọn radio
	// Có thể truyền props cho từng Radio item
	radioProps?: Omit<RadioProps, 'value' | 'children'>;
}

export const RadioGroupField = forwardRef<HTMLDivElement, RadioGroupFieldProps>(
	// ref sẽ trỏ tới RadioGroup div
	(
		{ name, control, label, description, options, radioProps, ...props },
		ref,
	) => {
		return (
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => (
					<div className="relative w-full">
						{' '}
						{/* Container cho RadioGroup và error message */}
						<RadioGroup
							value={field.value}
							onValueChange={field.onChange}
							// ref={ref} // HeroUI RadioGroup không nhận ref trực tiếp vào div ngoài cùng, nên sẽ bỏ qua ref ở đây hoặc wrap nó bằng một div khác nếu cần
							label={label}
							classNames={{
								label: cn(
									'font-semibold text-foreground text-small pb-1',
									props.classNames?.label,
								),
								wrapper: cn('gap-2', props.classNames?.wrapper), // Default gap between radios
								base: cn('w-full', props.classNames?.base),
							}}
							{...props}
						>
							{options.map((option) => (
								<Radio
									key={option.value}
									value={option.value}
									description={option.description}
									isDisabled={option.isDisabled}
									classNames={{
										label: cn('text-small', radioProps?.classNames?.label),
										wrapper: cn('', radioProps?.classNames?.wrapper),
										base: cn('gap-2', radioProps?.classNames?.base),
									}}
									{...radioProps}
								>
									{option.label}
								</Radio>
							))}
						</RadioGroup>
						{description &&
							!fieldState.error && ( // Hiển thị description nếu không có lỗi
								<p
									className={cn(
										'text-tiny text-default-400 mt-1',
										props.classNames?.description,
									)}
								>
									{description}
								</p>
							)}
						{fieldState.error && (
							<p
								className={cn(
									'text-tiny text-danger mt-1',
									props.classNames?.errorMessage,
								)}
							>
								{fieldState.error.message}
							</p>
						)}
					</div>
				)}
			/>
		);
	},
);

RadioGroupField.displayName = 'RadioGroupField';
