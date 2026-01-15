import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud, useFilter } from '~/hooks';
import { useCommonData } from '~/hooks/use-common-data';
import { useCommonStore } from '~/stores';
import { formatDate } from '~/utils/formater';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useEffect, useState } from 'react';
interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
}
export const MonthField = ({ label, name, placeholder }: IProps) => {
	const [selectedReport, setSelectedReport] = useState<any>();
	const { setData } = useCommonStore();
	const { setFilter } = useFilter();
	const { data: reports } = useCommonData(
		'reportingPeriodMonth',
		API_ENDPOINTS.common.getListPeriodMonth,
		{
			fetchOnInit: true,
		},
	);

	const { getAll } = useCrud(
		['reporting_period/get', selectedReport],
		{
			endpoint: 'system',
			id: +selectedReport,
		},
		{
			enabled: !!selectedReport,
		},
	);
	const { data: period }: any = getAll();
	useEffect(() => {
		if (period) {
			const [period_start, period_end] = period.split('-');
			setData('periodDate', {
				from_date: formatDate(period_start),
				to_date: formatDate(period_end),
			});
			setFilter('dateRange', {
				from_date: formatDate(period_start),
				to_date: formatDate(period_end),
			});
		}
	}, [period]);

	useEffect(() => {
		if (reports?.length) {
			const periods = reports?.find((report: any) => report.id === 4);
			setSelectedReport(periods?.id?.toString());
		}
	}, [reports]);

	return (
		<Autocomplete
			selectedKey={selectedReport}
			onSelectionChange={setSelectedReport}
			label={label}
			// allowsCustomValue
			aria-labelledby={`${name}-label`}
			aria-describedby={`${name}-error`}
			variant="bordered"
			placeholder="Chọn thời gian..."
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
					// trigger: 'text-black/90',
				},
			}}
			// {...props}
		>
			{reports.map((option: any) => (
				<AutocompleteItem key={option.id}>
					{option.period_name}
				</AutocompleteItem>
			))}
		</Autocomplete>
		// <Select
		//   items={reports}
		//   selectedKeys={selectedReport}
		//   onSelectionChange={(value) => {
		//     setSelectedReport(value.currentKey);
		//   }}
		//   placeholder={placeholder}
		//   labelPlacement="outside"
		//   variant="bordered"
		//   color="secondary"
		//   name={name || "report"}
		//   label={label}
		//   aria-label="Select Report"
		//   scrollShadowProps={{
		//     isEnabled: false,
		//   }}
		//   listboxProps={{
		//     itemClasses: {
		//       base: [
		//         "rounded-md",
		//         "text-default-700",
		//         "data-[hover=true]:!text-white",
		//         "data-[hover=true]:bg-secondary/50",
		//         "data-[selectable=true]:focus:bg-secondary",
		//         "data-[pressed=true]:opacity-70",
		//         "data-[focus-visible=true]:ring-default-500",
		//       ],
		//     },
		//   }}
		//   classNames={{
		//     trigger: "w-auto min-w-[100px] text-xs font-medium",
		//     clearButton: "w-4 h-4 bg-transparent text-default-700",
		//   }}
		// >
		//   {(period: any) => (
		//     <SelectItem
		//       // classNames={{
		//       // 	wrapper:
		//       // 		'bg-white hover:bg-secondary data-[selected=true]:bg-secondary',
		//       // }}
		//       key={period.id}
		//     >
		//       {period.period_name}
		//     </SelectItem>
		//   )}
		// </Select>
	);
};
