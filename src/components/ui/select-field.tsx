import { Select, SelectItem, type SelectProps } from '@heroui/react';
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
} from 'react-hook-form';

interface SelectFieldProps<TFormValues extends FieldValues>
	extends Omit<SelectProps, 'name' | 'children'> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	options: { label: string; value: string | number }[];
}

export const SelectField = <TFormValues extends FieldValues>({
	name,
	control,
	options,
	selectionMode,
	defaultSelectedKeys,
	isRequired,
	label,
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
				const getSelectedKeys: () => Set<string> = () => {
					if (selectionMode === 'multiple') {
						return field.value && Array.isArray(field.value)
							? new Set(field.value.map(String))
							: new Set();
					} else {
						if (defaultSelectedKeys) {
							if (defaultSelectedKeys && !field.value)
								return new Set([String(defaultSelectedKeys)]);
						}
						return field.value !== undefined && field.value !== null
							? new Set([String(field.value)])
							: new Set();
					}
				};
				const handleSelectionChange = (keys: Set<string>) => {
					const selectedValues = Array.from(keys);
					if (selectionMode === 'multiple') {
						const convertedValues = selectedValues
							.map((value) => {
								if (value !== undefined && value !== null && value !== '') {
									const numValue = Number.parseFloat(value);
									return !isNaN(numValue) ? numValue : value;
								}
								return null;
							})
							.filter((value) => value !== null);
						field.onChange(convertedValues);
					} else {
						// Chế độ single
						const selectedValue = selectedValues[0];
						let convertedValue: any = null;
						if (
							selectedValue !== undefined &&
							selectedValue !== null &&
							selectedValue !== ''
						) {
							const numValue = Number.parseFloat(selectedValue);
							convertedValue = !isNaN(numValue) ? numValue : selectedValue;
						}
						field.onChange(convertedValue);
					}
				};
				return (
					<Select
						{...field}
						selectedKeys={getSelectedKeys()}
						onSelectionChange={(keys) =>
							handleSelectionChange(keys as Set<string>)
						}
						variant="bordered"
						radius="sm"
						label={displayLabel}
						labelPlacement="outside"
						classNames={{
							label: 'font-semibold',
							trigger: 'border shadow-none min-h-9 h-9 bg-white',
						}}
						{...props}
						isInvalid={!!fieldState.error}
						errorMessage={fieldState.error?.message}
					>
						{options.map((option) => (
							<SelectItem key={option.value}>{option.label}</SelectItem>
						))}
					</Select>
				);
			}}
		/>
	);
};
