import { useFilter } from '~/hooks';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
}
export const EmailTypeField = ({ label, name, placeholder }: IProps) => {
	const { emailTypeSelected, setFilter } = useFilter();
	return (
		<Autocomplete
			selectedKey={emailTypeSelected}
			onSelectionChange={(key) => setFilter('emailTypeSelected', key)}
			label={label}
			// allowsCustomValue
			aria-labelledby={`${name}-label`}
			aria-describedby={`${name}-error`}
			variant="bordered"
			placeholder={placeholder}
			// defaultSelectedKey={emailTypeSelected}
			labelPlacement="outside"
			radius="sm"
			classNames={{
				clearButton:
					'text-default-800 [&>svg]:text-default-800 [&>svg]:opacity-100 sm:data-[visible=true]:opacity-60 min-w-6 w-6 h-6',
				base: 'min-w-[220px]',
			}}
			popoverProps={{
				radius: 'sm',
				classNames: {
					base: 'min-w-[220px]',
				},
			}}
			inputProps={{
				classNames: {
					inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
					label: 'text-black/90 top-[20px] font-medium',
					input: 'text-[13px] !shadow-none text-foreground-500',
				},
			}}
		>
			{[
				{
					id: 0,
					label: 'Tất cả',
				},
				{
					id: 1,
					label: 'Thành viên',
				},
				{
					id: 2,
					label: 'Nhân viên',
				},
			].map((option: any) => (
				<AutocompleteItem key={option.id}>{option.label}</AutocompleteItem>
			))}
		</Autocomplete>
	);
};
