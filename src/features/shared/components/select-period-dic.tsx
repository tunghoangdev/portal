import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCommon } from '~/hooks';
import { transformToOptions, useCommonData } from '~/hooks/use-common-data';
import { useCommonStore } from '~/stores';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { useEffect } from 'react';
interface IProps {
	label?: string;
	name?: string;
	placeholder?: string;
	classNames?: {
		trigger?: string;
	};
}
export default function SelectPeriodDic({
	label,
	name,
	placeholder,
	classNames,
}: IProps) {
	const { setData } = useCommonStore();
	const { periodDicList, period_name } = useCommon();
	const { isFetching } = useCommonData(
		'periodDicList',
		API_ENDPOINTS.dic.commissionPeriod,
		{
			fetchOnInit: !periodDicList?.length,
		},
	);
	const listDic = transformToOptions(
		periodDicList,
		'period_name',
		'period_name',
	);

	useEffect(() => {
		if (!period_name && periodDicList?.length) {
			setData('period_name', periodDicList[0].period_name);
		}
	}, [periodDicList]);

	return (
		<Autocomplete
			// selectedKey={period_name}
			onSelectionChange={(key) => setData('period_name', key)}
			selectedKey={period_name}
			label={label}
			// allowsCustomValue
			aria-labelledby={`${name}-label`}
			aria-describedby={`${name}-error`}
			variant="bordered"
			placeholder={isFetching ? 'Đang tải...' : 'Chọn thời gian...'}
			labelPlacement="outside"
			radius="sm"
			classNames={{
				clearButton:
					'text-default-800 [&>svg]:text-default-800 [&>svg]:opacity-100 sm:data-[visible=true]:opacity-60 min-w-6 w-6 h-6',
				base: 'max-w-[185px]',
			}}
			popoverProps={{
				radius: 'sm',
				// classNames: {
				// 	base: 'min-w-[80px]',
				// },
			}}
			inputProps={{
				classNames: {
					inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
					label: 'text-black/90 top-[20px] font-medium',
					input: 'text-[13px] !shadow-none text-foreground-500',
				},
			}}
			// {...props}
		>
			{listDic.map((option: any) => (
				<AutocompleteItem key={option.value}>{option.label}</AutocompleteItem>
			))}
		</Autocomplete>
		// <Select
		// 	items={listDic}
		// 	// selectedKeys={period_name}
		// 	onChange={(e) => {
		// 		setData('period_name', e.target.value);
		// 	}}
		// 	variant="bordered"
		// 	color="secondary"
		// 	name={name || 'period_name'}
		// 	aria-label="Select Dic"
		// 	placeholder={isFetching ? 'Đang tải...' : placeholder}
		// 	labelPlacement="outside"
		// 	label={label}
		// 	scrollShadowProps={{
		// 		isEnabled: false,
		// 	}}
		// 	listboxProps={{
		// 		itemClasses: {
		// 			base: [
		// 				'rounded-none min-w-[150px] flex-1',
		// 				'text-default-700',
		// 				'data-[hover=true]:!text-white',
		// 				'data-[hover=true]:bg-secondary/50',
		// 				'data-[selectable=true]:focus:bg-secondary',
		// 				'data-[pressed=true]:opacity-70',
		// 				'data-[focus-visible=true]:ring-default-500',
		// 			],
		// 		},
		// 	}}
		// 	classNames={{
		// 		trigger: 'w-auto min-w-[130px] text-xs font-medium',
		// 	}}
		// >
		// 	{(period: any) => (
		// 		<SelectItem key={period.value}>{period.label}</SelectItem>
		// 	)}
		// </Select>
	);
}
