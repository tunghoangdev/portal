import { useState } from 'react';
import {
	Controller,
	type Control,
	type FieldValues,
	type Path,
	type RegisterOptions,
} from 'react-hook-form';

import {
	RadioGroup,
	Radio,
	type RadioGroupProps,
	type RadioProps,
	Checkbox,
	type CheckboxProps,
	DateInput,
	type DateInputProps,
	DatePicker,
	type DatePickerProps,
	DateRangePicker,
	type DateRangePickerProps,
	type InputProps,
	Input,
	Select,
	SelectItem,
	type SelectProps,
	Textarea,
	AutocompleteProps,
	Autocomplete,
	AutocompleteItem,
} from '@heroui/react';
import { convertToDateTimeToValue, convertToDateValue } from '~/utils/util';
import { cn } from '~/lib/utils';

// --- 1. Base Props chung cho tất cả các loại input ---
export interface BaseFormControlProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	control: Control<TFormValues>;
	label?: React.ReactNode;
	rules?: RegisterOptions<TFormValues>;
	placeholder?: string;
	className?: string;
	isDisabled?: boolean;
	labelPlacement?: 'outside' | 'inside' | 'outside-left';
}

// --- 2. Props riêng cho từng loại input ---
export interface TextInputFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type?:
		| 'text'
		| 'number'
		| 'hidden'
		| 'email'
		| 'phone'
		| 'checkbox'
		| 'select'
		| 'password'
		| 'textarea'
		| 'datetime'
		| 'editor'
		| 'date';
	isRequired?: boolean;
	fieldProps?: Omit<
		InputProps,
		| 'name'
		| 'value'
		| 'onChange'
		| 'onBlur'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
		| 'type'
		| 'endContent'
	>; // Omit 'type' và 'endContent' vì chúng ta sẽ kiểm soát
}
export interface TextareaFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type?:
		| 'text'
		| 'number'
		| 'hidden'
		| 'email'
		| 'phone'
		| 'checkbox'
		| 'select'
		| 'password'
		| 'textarea'
		| 'datetime'
		| 'date';
	isRequired?: boolean;
	fieldProps?: Omit<
		InputProps,
		| 'name'
		| 'value'
		| 'onChange'
		| 'onBlur'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
		| 'type'
		| 'ref'
		| 'endContent'
	>; // Omit 'type' và 'endContent' vì chúng ta sẽ kiểm soát
}
// Cho Select
interface SelectOption {
	label: string;
	value: string | number;
}

export interface SelectFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'select';
	isRequired?: boolean;
	options: SelectOption[];
	fieldProps?: Omit<
		SelectProps,
		| 'name'
		| 'selectedKeys'
		| 'onSelectionChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
		| 'children'
	>;
}
// Cho Autocomplete
interface AutocompleteOption {
	label: string;
	value: string | number;
}
export interface AutocompleteFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'autocomplete';
	isRequired?: boolean;
	options: AutocompleteOption[];
	fieldProps?: Omit<
		AutocompleteProps,
		| 'name'
		| 'selectedKey' // 'selectedKey' thay vì 'selectedKeys'
		| 'onSelectionChange'
		| 'onInputChange' // Cần xử lý cả input change
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
		| 'children'
	>;
}

// Cho RadioGroup
export interface RadioFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'radio-group';
	isRequired?: boolean;
	options: SelectOption[];
	fieldProps?: Omit<
		RadioGroupProps,
		| 'name'
		| 'value'
		| 'onValueChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'labelPlacement'
		| 'children'
	>;
	radioItemProps?: Omit<RadioProps, 'value' | 'children'>;
}

// Cho Checkbox
interface CheckboxFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'checkbox';
	isRequired?: boolean;
	checkboxProps?: Omit<
		CheckboxProps,
		| 'name'
		| 'isSelected'
		| 'onValueChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'children'
	>;
	className?: string;
	children?: React.ReactNode;
}
// --- MỚI: Cho DateInput (type="day") ---
interface DayInputFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'day';
	isRequired?: boolean;
	format?: string; // Định dạng ngày (e.g., "YYYY-MM-DD")
	fieldProps?: Omit<
		DateInputProps,
		| 'value'
		| 'onChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
	>;
}

// --- Cho DatePicker (type="date") ---
interface DateOnlyPickerFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'date';
	isRequired?: boolean;
	format?: string; // Định dạng ngày (e.g., "MM/DD/YYYY")
	fieldProps?: Omit<
		DatePickerProps,
		| 'value'
		| 'onChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'placeholder'
		| 'labelPlacement'
		| 'showTimeSelect'
	>;
}

// --- Cho DateRangePicker (type="date-range") ---
interface DateRangePickerFormControlProps<TFormValues extends FieldValues>
	extends BaseFormControlProps<TFormValues> {
	type: 'date-range';
	isRequired?: boolean;
	format?: string; // Định dạng ngày cho range
	placeholderStart?: string; // Placeholder cho ngày bắt đầu
	placeholderEnd?: string; // Placeholder cho ngày kết thúc
	dateRangePickerProps?: Omit<
		DateRangePickerProps,
		| 'value'
		| 'onChange'
		| 'isInvalid'
		| 'errorMessage'
		| 'label'
		| 'labelPlacement'
	>;
}

// --- 3. Tạo Union Type cho FormControlProps ---
export type FormControlProps<TFormValues extends FieldValues> =
	| TextInputFormControlProps<TFormValues>
	| SelectFormControlProps<TFormValues>
	| RadioFormControlProps<TFormValues>
	| CheckboxFormControlProps<TFormValues>
	| DayInputFormControlProps<TFormValues>
	| DateOnlyPickerFormControlProps<TFormValues>
	| DateRangePickerFormControlProps<TFormValues>
	| AutocompleteFormControlProps<TFormValues>;

const inputClss = {
	inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
	label: 'text-black/90 top-[20px] font-medium',
	input: 'text-[13px] !shadow-none text-default-700',
};
const textareaClss = {
	inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
	label: 'text-black/90 font-medium',
	input: 'text-[13px] !shadow-none text-default-700',
};
// --- 4. Component FormControl chung ---
export function FormField<TFormValues extends FieldValues>({
	name,
	control,
	label,
	rules,
	placeholder,
	className,
	isRequired = false,
	isDisabled = false,
	labelPlacement = 'outside',
	...rest
}: FormControlProps<TFormValues | any>) {
	// State để quản lý hiển thị/ẩn mật khẩu
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
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
			rules={rules}
			render={({ field, fieldState }) => {
				let actualType = (rest as any).type as typeof rest.type;
				if (!actualType) {
					const fieldCurrentValue = field.value;
					if (typeof fieldCurrentValue === 'string') {
						if (name.toString().includes('email')) {
							actualType = 'email';
						} else if (name.toString().includes('password')) {
							actualType = 'password';
						} else if (
							name.toString().includes('address') ||
							name.toString().includes('comment')
						) {
							actualType = 'textarea'; // Ví dụ, suy luận textarea nếu tên trường là address hoặc comment
						} else {
							actualType = 'text';
						}
					} else if (typeof fieldCurrentValue === 'number') {
						actualType = 'number';
					} else if (typeof fieldCurrentValue === 'boolean') {
						actualType = 'checkbox';
					} else if ((fieldCurrentValue as unknown) instanceof Date) {
						actualType = 'date';
					} else if (
						Array.isArray(fieldCurrentValue) &&
						fieldCurrentValue.length === 2 &&
						((fieldCurrentValue[0] as unknown) instanceof Date ||
							fieldCurrentValue[0] === null) &&
						((fieldCurrentValue[1] as unknown) instanceof Date ||
							fieldCurrentValue[1] === null)
					) {
						actualType = 'date-range';
					}
				}
				const commonProps = {
					label,
					placeholder,
					labelPlacement,
					isInvalid: !!fieldState.error,
					errorMessage: fieldState.error?.message,
					className,
					isDisabled,
					classNames: {
						label: 'font-semibold',
					},
				};
				switch (actualType) {
					case 'hidden': {
						return (
							<input
								type="hidden"
								{...field}
								value={(field.value ?? '') as typeof field.value | ''}
							/>
						);
					}
					case 'text':
					case 'number':
					case 'email': {
						const { fieldProps: inputProps } =
							rest as TextInputFormControlProps<TFormValues>;
						return (
							<Input
								{...field}
								value={(field.value ?? '') as typeof field.value | ''}
								type={rest.type === 'textarea' ? undefined : rest.type}
								isMultiline={rest.type === 'textarea'}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									...inputClss,
								}}
								{...inputProps}
								isInvalid={!!fieldState.error}
								errorMessage={fieldState.error?.message}
								label={displayLabel}
								autocomplete="off"
							/>
						);
					}
					case 'textarea': {
						const { fieldProps: inputProps } =
							rest as TextareaFormControlProps<TFormValues>;
						return (
							<Textarea
								{...field}
								value={(field.value ?? '') as typeof field.value | ''}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									...textareaClss,
								}}
								{...inputProps}
								isInvalid={!!fieldState.error}
								errorMessage={fieldState.error?.message}
								label={displayLabel}
							/>
						);
					}
					case 'password': {
						const { fieldProps: passwordInputProps } =
							rest as TextInputFormControlProps<TFormValues>;
						return (
							<Input
								{...field}
								type={showPassword ? 'text' : 'password'} // Thay đổi type dựa vào state showPassword
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									...inputClss,
								}}
								endContent={
									// Thêm nút/icon toggle vào cuối input
									<button
										className="focus:outline-none"
										type="button" // Quan trọng: type="button" để tránh submit form
										onClick={togglePasswordVisibility}
									>
										{/* Sử dụng icon hoặc text tùy chọn */}
										{/* {showPassword ? <EyeSlashIcon className="h-5 w-5 text-default-400" /> : <EyeIcon className="h-5 w-5 text-default-400" />} */}
										<span className="text-default-400 text-sm">
											{showPassword ? 'Ẩn' : 'Hiện'}
										</span>
									</button>
								}
								{...passwordInputProps}
								label={displayLabel}
							/>
						);
					}
					case 'select': {
						const { options, fieldProps: selectProps } =
							rest as SelectFormControlProps<TFormValues>;
						const selectionMode = selectProps?.selectionMode;
						const defaultValue = selectProps?.defaultSelectedKeys;
						const getSelectedKeys: () => Set<string> = () => {
							if (selectionMode === 'multiple') {
								// Nếu field.value là mảng, map từng phần tử sang string
								return field.value && Array.isArray(field.value)
									? new Set(field.value.map(String))
									: new Set();
							}
							if (defaultValue) {
								return new Set([String(defaultValue)]);
							}
							return field.value !== undefined && field.value !== null
								? new Set([String(field.value)])
								: new Set();
						};

						const handleSelectionChange = (keys: Set<string>) => {
							const selectedValues = Array.from(keys);
							if (selectionMode === 'multiple') {
								// Chế độ multi: map từng giá trị chuỗi sang số hoặc chuỗi
								const convertedValues = selectedValues
									.map((value) => {
										if (value !== undefined && value !== null && value !== '') {
											const numValue = Number.parseFloat(value);
											return !Number.isNaN(numValue) ? numValue : value;
										}
										return null;
									})
									.filter((value) => value !== null); // Lọc bỏ null/undefined nếu có
								field.onChange(convertedValues);
							} else {
								// Chế độ single
								const selectedValue = selectedValues[0];
								// let convertedValue: any = null;
								// if (
								// 	selectedValue !== undefined &&
								// 	selectedValue !== null &&
								// 	selectedValue !== ''
								// ) {
								// 	const numValue = Number.parseFloat(selectedValue);
								// 	convertedValue = !Number.isNaN(numValue)
								// 		? numValue
								// 		: selectedValue;
								// }
								// console.log('convertedValue', selectedValue);

								field.onChange(selectedValue);
							}
						};
						return (
							<Select
								selectedKeys={getSelectedKeys()}
								onSelectionChange={(keys) =>
									handleSelectionChange(keys as Set<string>)
								}
								onBlur={field.onBlur}
								variant="bordered"
								radius="sm"
								aria-label={label || 'Select option'}
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									trigger: 'border shadow-none min-h-9 h-9 bg-white',
									label: inputClss.label,
								}}
								{...selectProps}
								label={displayLabel}
							>
								{options?.map((option) => (
									// Đảm bảo key của SelectItem luôn là string, ngay cả khi option.value là số
									<SelectItem key={String(option.value)}>
										{option.label}
									</SelectItem>
								))}
							</Select>
						);
					}
					case 'autocomplete': {
						const { options, fieldProps: autocompleteProps } =
							rest as AutocompleteFormControlProps<TFormValues>;

						const handleSelectionChange = (key: React.Key | null) => {
							// Convert key to value (string to number, or keep as string)
							const selectedValue = key
								? Number.isNaN(Number(key))
									? String(key)
									: Number(key)
								: null;
							field.onChange(selectedValue);
						};

						const selectedKey = field.value ? String(field.value) : null;
						const { classNames, ...newCommonProps } = commonProps;
						return (
							<Autocomplete
								selectedKey={selectedKey}
								onSelectionChange={handleSelectionChange}
								onBlur={field.onBlur}
								variant="bordered"
								radius="sm"
								aria-label={label || 'Select option'}
								{...newCommonProps}
								{...autocompleteProps}
								classNames={{
									clearButton:
										'text-default-800 [&>svg]:text-default-800 [&>svg]:opacity-100 sm:data-[visible=true]:opacity-60 min-w-6 w-6 h-6',
								}}
								inputProps={{
									classNames: {
										...inputClss,
									},
								}}
								label={displayLabel}
							>
								{options?.map((option) => (
									<AutocompleteItem key={String(option.value)}>
										{option.label}
									</AutocompleteItem>
								))}
							</Autocomplete>
						);
					}
					case 'radio-group': {
						const {
							options: radioOptions,
							fieldProps: radioGroupProps,
							radioItemProps,
						} = rest as RadioFormControlProps<TFormValues>;
						return (
							<RadioGroup
								value={String(field.value || '')}
								onValueChange={field.onChange}
								onBlur={field.onBlur}
								{...commonProps}
								{...radioGroupProps}
								label={displayLabel}
							>
								{radioOptions.map((option) => (
									<Radio
										key={String(option.value)}
										value={String(option.value)}
										{...radioItemProps}
									>
										{option.label}
									</Radio>
								))}
							</RadioGroup>
						);
					}
					case 'checkbox': {
						const { children, checkboxProps } =
							rest as CheckboxFormControlProps<TFormValues>;
						return (
							<div
								className={cn(
									'flex flex-col h-full items-start',
									commonProps?.className,
								)}
							>
								<Checkbox
									isSelected={!!field.value}
									isInvalid={!!fieldState.error}
									color="secondary"
									{...field}
									{...checkboxProps}
								>
									{children || displayLabel}
								</Checkbox>
								{fieldState.error && (
									<div className="text-red-500 text-sm mt-1">
										{fieldState.error?.message}
									</div>
								)}
							</div>
						);
					}
					case 'day': {
						const { fieldProps: dateInputProps } =
							rest as DayInputFormControlProps<TFormValues>;
						return (
							<DateInput
								value={
									(field.value as unknown) instanceof Date &&
									!Number.isNaN(field.value.getTime())
										? field.value
										: undefined
								}
								onChange={(date) => {
									field.onChange(date);
								}}
								onBlur={field.onBlur}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									...inputClss,
								}}
								{...dateInputProps}
								label={displayLabel}
							/>
						);
					}

					// --- MỚI: CASE CHO DATEPICKER (type="date") ---
					case 'date': {
						const newDate = field.value
							? convertToDateValue(field.value)
							: null;
						const { fieldProps: datePickerProps } =
							rest as DateOnlyPickerFormControlProps<TFormValues>;
						return (
							<DatePicker
								value={newDate}
								// defaultValue={newDate}
								onChange={(date) => field.onChange(date)}
								onBlur={field.onBlur}
								// format={dateFormat || 'DD/MM/YYYY'} // Default format for DatePicker (date only)
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									inputWrapper: 'border border-default-600 min-h-9 h-9',
									input: 'text-sm !shadow-none',

									...commonProps.classNames,
									label: 'text-black/90 top-[20px] font-medium',
								}}
								{...datePickerProps}
								label={displayLabel}
							/>
						);
					}
					// --- MỚI: CASE CHO DATEPICKER (type="date") ---
					case 'datetime': {
						const newDate = field.value
							? convertToDateTimeToValue(field.value)
							: undefined;
						const { fieldProps: datePickerProps } =
							rest as DateOnlyPickerFormControlProps<TFormValues>;
						return (
							<DatePicker
								value={newDate}
								onChange={field.onChange}
								onBlur={field.onBlur}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									inputWrapper: 'border border-default-600 min-h-9 h-9',
									input: 'text-sm !shadow-none',
									...commonProps.classNames,
								}}
								{...datePickerProps}
								hideTimeZone
								showMonthAndYearPickers
								label={displayLabel}
							/>
						);
					}
					// --- MỚI: CASE CHO DATERANGEPICKER (type="date-range") ---
					case 'date-range': {
						const { dateRangePickerProps } =
							rest as DateRangePickerFormControlProps<TFormValues>;
						// Value của field.value phải là một mảng [Date | null, Date | null]
						const rangeValue: any =
							Array.isArray(field.value) &&
							field.value.length === 2 &&
							(field.value[0] instanceof Date || field.value[0] === null) &&
							(field.value[1] instanceof Date || field.value[1] === null)
								? (field.value as [Date | null, Date | null])
								: [undefined, undefined];

						return (
							<DateRangePicker
								value={rangeValue}
								onChange={(dates) => {
									field.onChange(dates);
								}}
								onBlur={field.onBlur}
								// format={rangeFormat || 'DD/MM/YYYY'} // Default format for DateRangePicker
								// placeholderStart={placeholderStart || 'Start Date'}
								// placeholderEnd={placeholderEnd || 'End Date'}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									inputWrapper: 'border shadow-xs', // Hoặc có thể là 'rangeInputWrapper' tùy theo API của bạn
								}}
								{...dateRangePickerProps}
								label={displayLabel}
							/>
						);
					}

					default: {
						const { fieldProps: inputProps } =
							rest as TextInputFormControlProps<TFormValues>;
						return (
							<Input
								{...field}
								value={(field.value ?? '') as typeof field.value | ''}
								variant="bordered"
								radius="sm"
								{...commonProps}
								classNames={{
									...commonProps.classNames,
									...inputClss,
								}}
								{...inputProps}
								label={displayLabel}
							/>
						);
					}
				}
			}}
		/>
	);
}
