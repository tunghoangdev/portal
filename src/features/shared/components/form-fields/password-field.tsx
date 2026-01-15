import { forwardRef, useState } from 'react';
import { Input, type InputProps } from '@heroui/react';
import { Controller, type Control, type FieldValues } from 'react-hook-form';
import { Icons } from '~/components/icons';

interface PasswordFieldProps extends Omit<InputProps, 'name' | 'type' | 'ref'> {
	name: string;
	control: Control<FieldValues>;
	label?: string;
	description?: string;
	isRequired?: boolean;
}
const inputClss = {
	inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
	label: 'text-black/90 top-[20px] font-medium',
	input: 'text-[13px] !shadow-none text-default-700',
};
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
	({ name, control, label, description, isRequired, ...props }, ref) => {
		const [isVisible, setIsVisible] = useState(false);

		const toggleVisibility = () => setIsVisible(!isVisible);
		const displayLabel = (
			<div className="flex items-center">
				{label}
				{isRequired && label && <span className={"text-danger ml-1"}>*</span>}
			</div>
		) as any;
		return (
			<Controller
				name={name}
				control={control}
				render={({ field, fieldState }) => (
					<Input
						{...field}
						ref={ref}
						label={displayLabel}
						description={description}
						variant="bordered"
						radius="sm"
						labelPlacement="outside"
						type={isVisible ? 'text' : 'password'}
						classNames={{
							...inputClss,
							...props.classNames,
							//   label: cn(
							//     "font-semibold text-foreground text-small pb-1",
							//     props.classNames?.label
							//   ),
							//   inputWrapper: cn(
							//     "border shadow-none",
							//     props.classNames?.inputWrapper
							//   ),
							//   description: cn("pt-1", props.classNames?.description),
							//   errorMessage: cn("pt-1", props.classNames?.errorMessage),
							//   base: cn("w-full", props.classNames?.base),
							//   input: cn("text-small", props.classNames?.input),
						}}
						endContent={
							<button
								className="focus:outline-none hover:cursor-pointer"
								type="button"
								onClick={toggleVisibility}
							>
								{isVisible ? (
									<Icons.eye
										size={16}
										className="text-default-400 pointer-events-none"
									/>
								) : (
									<Icons.eyeOff
										size={16}
										className="text-default-400 pointer-events-none"
									/>
								)}
							</button>
						}
						{...props}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					/>
				)}
			/>
		);
	},
);

PasswordField.displayName = 'PasswordField';
