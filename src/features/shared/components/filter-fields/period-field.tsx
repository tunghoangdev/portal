import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCommon, useFilter } from '~/hooks';
import { transformToOptions, useCommonData } from '~/hooks/use-common-data';
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

export const PeriodField = ({ label, name }: IProps) => {
	const { bonusPeriodName, setFilter } = useFilter();
	const { periodDicList } = useCommon();
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
		if (!bonusPeriodName && periodDicList?.length) {
			setFilter('bonusPeriodName', periodDicList[0].period_name);
		}
	}, [periodDicList]);

	return (
		<Autocomplete
			onSelectionChange={(key) => {
				setFilter('bonusPeriodName', key);
			}}
			selectedKey={bonusPeriodName}
			label={label}
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
			}}
			inputProps={{
				classNames: {
					inputWrapper: 'border border-default-400 min-h-9 h-9 bg-white',
					label: 'text-black/90 top-[20px] font-medium',
					input: 'text-[13px] !shadow-none text-foreground-500',
				},
			}}
		>
			{listDic.map((option: any) => (
				<AutocompleteItem key={option.value}>{option.label}</AutocompleteItem>
			))}
		</Autocomplete>
	);
};
