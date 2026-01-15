import { forwardRef, useState } from 'react';
import { Input, type InputProps } from '@heroui/react';
import { Icons } from '~/components/icons';

interface Props extends Omit<InputProps, 'type' | 'ref'> {
	label?: string;
	description?: string;
	isRequired?: boolean;
}

const inputClss = {
	inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
	label: 'text-black/90 top-[20px] font-medium',
	input: 'text-[13px] !shadow-none text-default-700',
};

export const InputPassword = forwardRef<HTMLInputElement, Props>(
	({ label, description, isRequired, ...props }, ref) => {
		const [isVisible, setIsVisible] = useState(false);
		const toggleVisibility = () => setIsVisible(!isVisible);
		const displayLabel = (
			<div className="flex items-center">
				{label}
				{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
			</div>
		) as any;
		return (
			<Input
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
								className="text-default-600 pointer-events-none"
							/>
						) : (
							<Icons.eyeOff
								size={16}
								className="text-default-600 pointer-events-none"
							/>
						)}
					</button>
				}
				{...props}
			/>
		);
	},
);

InputPassword.displayName = 'InputPassword';
