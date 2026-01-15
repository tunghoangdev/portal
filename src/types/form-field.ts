import type { FieldValues } from 'react-hook-form';
export type TItemFormFields = FieldValues;
export type TExportFormFields = FieldValues;
export type AllFormFields = TItemFormFields & TExportFormFields;
export type CombinedFormFields<
	TItemFormFields extends FieldValues,
	TExportFormFields extends FieldValues,
> = TItemFormFields & TExportFormFields;
export type FormFieldType = {
	type?:
		| 'text'
		| 'number'
		| 'hidden'
		| 'email'
		| 'checkbox'
		| 'select'
		| 'password'
		| 'textarea'
		| 'date'
		| 'date-range'
		| 'phone'
		| 'radio'
		| 'checkbox-group'
		| 'radio-group'
		| 'file'
		| string;
};
export type AddressKeys = {
	provinceKey?: string;
	districtKey?: string;
	wardKey?: string;
	streetKey?: string;
};
export type FormFieldConfig = {
	name: string;
	label: string;
	placeholder?: string;
	extra?: React.ComponentType<any>;
	fieldProps?: any;
	type?:
		| 'text'
		| 'number'
		| 'checkbox'
		| 'email'
		| 'select'
		| 'password'
		| 'phone'
		| 'hidden'
		| 'textarea'
		| 'datetime'
		| 'array'
		| 'date';
	isRequired?: boolean;
	isAmount?: boolean;
	isDisabled?: boolean;
	isRequiredWhen?: (data: Record<string, any>) => boolean;
	requiredMessage?: string;
	col?: number;
	defaultValue?: string | number | boolean;
	defaultOption?: string | number | boolean;
	minLength?: number;
	maxLength?: number;
	minValue?: number;
	maxValue?: number;
	isEmail?: boolean;
	isPhone?: boolean;
	isNumber?: boolean;
	isNumberBank?: boolean;
	isCCCD?: boolean;
	isPercent?: boolean;
	isBirthday?: boolean;
	isUrl?: boolean;
	isFeatured?: boolean;
	isBefore?: boolean;
	allowZero?: boolean;
	isAfter?: boolean;
	basePath?: string;
	storeName?: string;
	compare?: string;
	isArray?: boolean;
	subFields?: FormFieldConfig[];
	options?: { value: string; label: string }[];
};
