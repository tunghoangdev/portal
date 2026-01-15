import {
	Autocomplete,
	AutocompleteItem,
	type AutocompleteProps,
} from '@heroui/react';
import { useEffect } from 'react';
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from 'react-hook-form';

interface SelectFieldProps<TFormValues extends FieldValues>
	extends Omit<AutocompleteProps, 'name' | 'children' | 'ref'> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	defaultOption?: number;
	options: { label: string; value: string | number }[];
}
const inputClss = {
	inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
	label: 'text-black/90 top-[20px] font-medium',
	input: 'text-[13px] !shadow-none text-foreground-500',
	trigger: 'text-black/90',
};
export const AutocompleteField = <TFormValues extends FieldValues>({
	name,
	control,
	options,
	isRequired,
	label,
	defaultOption,
	...props
}: SelectFieldProps<TFormValues>) => {
	const displayLabel = (
		<div className="flex items-center">
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</div>
	) as any;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				useEffect(() => {
					if (
						defaultOption !== undefined &&
						!field.value &&
						options?.[defaultOption]?.value
					)
						field.onChange(options[defaultOption]?.value?.toString());
				}, [defaultOption, field, options]);

				return (
					<Autocomplete
						{...field}
						selectedKey={field.value?.toString()}
						onSelectionChange={field.onChange}
						label={displayLabel}
						// allowsCustomValue
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
						aria-labelledby={`${name}-label`}
						aria-describedby={`${name}-error`}
						variant="bordered"
						labelPlacement="outside"
						isClearable={false}
						radius="sm"
						classNames={{
							clearButton:
								'text-default-800 [&>svg]:text-default-800 [&>svg]:opacity-100 sm:data-[visible=true]:opacity-60 min-w-6 w-6 h-6',
						}}
						inputProps={{
							classNames: {
								...inputClss,
							},
						}}
						{...props}
					>
						{options.map((option) => (
							<AutocompleteItem key={option.value}>
								{option.label}
							</AutocompleteItem>
						))}
					</Autocomplete>
				);
			}}
		/>
	);
};
