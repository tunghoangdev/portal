import { Select, SelectItem } from '~/components/ui';
import { useCrud } from '~/hooks';
import { useCommonData } from '~/hooks/use-common-data';
import { useCommonStore } from '~/stores';
import { formatDate } from '~/utils/formater';
import React, { useEffect, useState } from 'react';

export default function MonthListField() {
	const [selectedDic, setSelectedDic] = useState<any>();
	const { setData } = useCommonStore();
	const { data: listMonth } = useCommonData(
		'listMonth',
		'system/reporting_period/list_month',
		{
			fetchOnInit: true,
		},
	);
	const { getAll } = useCrud(
		['reporting_period/get', selectedDic],
		{
			endpoint: 'system',
			id: +selectedDic,
		},
		{
			enabled: !!selectedDic,
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
		}
	}, [period]);

	useEffect(() => {
		if (listMonth.length > 0) setSelectedDic(listMonth[0].id.toString());
	}, [listMonth]);

	return (
		<Select
			items={listMonth}
			selectedKeys={[selectedDic?.toString()]}
			onSelectionChange={(value) => {
				setSelectedDic(value.currentKey);
			}}
			variant="bordered"
			color="secondary"
			name="report"
			aria-label="Chọn tháng"
			placeholder="Chọn tháng..."
			scrollShadowProps={{
				isEnabled: false,
			}}
			// popoverProps={{
			// 	classNames: {
			// 		base: 'before:bg-default-200 rounded-none',
			// 		// content: 'p-0 border-small border-divider bg-background',
			// 	},
			// }}
			listboxProps={{
				itemClasses: {
					base: [
						'rounded-none',
						'text-default-700',
						'data-[hover=true]:!text-white',
						'data-[hover=true]:bg-secondary/50',
						'data-[selectable=true]:focus:bg-secondary',
						'data-[pressed=true]:opacity-70',
						'data-[focus-visible=true]:ring-default-500',
					],
				},
			}}
			classNames={{
				trigger: 'w-auto min-w-[150px] text-xs font-medium',
			}}
		>
			{(period: any) => (
				<SelectItem key={period.id}>{period.period_name}</SelectItem>
			)}
		</Select>
	);
}
