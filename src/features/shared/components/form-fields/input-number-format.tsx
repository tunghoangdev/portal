import React, { useEffect } from 'react';
import {
	Controller,
	type Control,
	type FieldValues,
	type UseFormReturn,
} from 'react-hook-form';
import { FC, useCallback, useState } from 'react';
import { Input, InputProps } from '~/components/ui';
type FormattedNumberInputProps = Omit<
	InputProps,
	'value' | 'onChange' | 'ref'
> & {
	value: number | ''; // Giá trị thực từ RHF
	onChange: (value: number | '') => void; // Hàm để báo RHF giá trị mới
	name: string; // Tên trường để RHF biết
	placeholder?: string;
	fieldState: any;
	label?: string;
	isRequired?: boolean;
	isDisabled?: boolean;
	// Bạn có thể thêm các props HTML input khác nếu cần
};
const FormattedNumberInput: FC<FormattedNumberInputProps> = ({
	value,
	onChange,
	name,
	placeholder,
	fieldState,
	label,
	isRequired,
	isDisabled,
	...props
}) => {
	// `displayValue` là giá trị chuỗi được định dạng trong input
	// `value` là giá trị số thực từ RHF
	const [displayValue, setDisplayValue] = useState<string>(
		value === '' || value === undefined
			? ''
			: new Intl.NumberFormat('en-US').format(value),
	);

	// Hàm định dạng số để hiển thị (chỉ dùng cho mục đích ban đầu hoặc khi blur)
	const formatNumberForDisplay = useCallback((num: number | ''): string => {
		if (num === '' || num === undefined) return '';
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(num);
	}, []);

	const handleInternalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const rawValue = event.target.value;
		// setDisplayValue(rawValue);
		// let cleanedValue = rawValue.replace(/[^0-9.]/g, '');
		// const parts = cleanedValue.split('.');
		// if (parts.length > 2) {
		// 	cleanedValue = `${parts[0]}.${parts.slice(1).join('')}`;
		// }
		// let numValue: number | '' = Number.parseFloat(cleanedValue);
		// if (isNaN(numValue)) {
		// 	numValue = '';
		// } else {
		// 	numValue = Math.abs(numValue);
		// }
		const rawValue = event.target.value;
		// Lọc các ký tự không hợp lệ ngay lập tức
		const cleanedValue = rawValue.replace(/[^0-9.]/g, '');

		// Cập nhật state với giá trị đã được làm sạch
		setDisplayValue(cleanedValue);
		// Chuyển đổi sang số để gửi cho RHF
		let numValue: number | '' = Number.parseFloat(cleanedValue);
		if (isNaN(numValue)) {
			numValue = '';
		} else {
			numValue = Math.abs(numValue);
		}
		onChange(numValue);
	};

	useEffect(() => {
		setDisplayValue(formatNumberForDisplay(value));
	}, [value, formatNumberForDisplay]);

	const handleBlur = () => {
		if (typeof value === 'number') {
			setDisplayValue(formatNumberForDisplay(value));
		}
	};

	const displayLabel = (
		<div className="flex items-center">
			{label}
			{isRequired && label && <span className={'text-danger ml-1'}>*</span>}
		</div>
	) as any;
	return (
		<Input
			name={name}
			label={displayLabel}
			value={displayValue}
			onChange={handleInternalChange}
			onBlur={handleBlur}
			placeholder={placeholder}
			isInvalid={!!fieldState.error}
			errorMessage={fieldState.error?.message}
			endContent={fieldState.error && ' '}
			isDisabled={isDisabled}
			variant="bordered"
			radius="sm"
			labelPlacement="outside"
			classNames={{
				label: 'font-medium text-foreground',
				inputWrapper: 'border shadow-xs bg-white',
			}}
			{...props}
		/>
	);
};

type NumberFieldProps = Omit<InputProps, 'value' | 'onChange' | 'ref'> & {
	name: string;
	label?: string;
	placeholder?: string;
	control: Control<FieldValues>;
	formMethods?: UseFormReturn<FieldValues>;
	isRequired?: boolean;
	isDisabled?: boolean;
};

export const NumberField = (props: NumberFieldProps) => {
	const { name, control, label, placeholder, isRequired, isDisabled } = props;
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormattedNumberInput
					{...field}
					label={label}
					placeholder={placeholder}
					isRequired={isRequired}
					fieldState={fieldState}
					isDisabled={isDisabled}
					{...props}
				/>
			)}
		/>
	);
};
