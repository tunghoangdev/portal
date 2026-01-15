import 'chart.js/auto';
import { useMemo } from 'react';
import { Card, CardBody, CardHeader, Typography } from '~/components/ui';

import { useCrud } from '~/hooks/use-crud-v2';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import Loading from '~/components/ui/loading';
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';
import { formatNumber } from '~/utils/formater';
import { useLocation } from '@tanstack/react-router';
import { ROLES } from '~/constant';
type RawData = {
	month: number;
	total: number;
};

type FinalData = {
	month: string;
	total: number;
};

// Ánh xạ số tháng sang tên hiển thị (T1, T2,...)
const MONTH_NAMES: Record<number, string> = {
	1: 'T1',
	2: 'T2',
	3: 'T3',
	4: 'T4',
	5: 'T5',
	6: 'T6',
	7: 'T7',
	8: 'T8',
	9: 'T9',
	10: 'T10',
	11: 'T11',
	12: 'T12',
};
const formatLegendName = (value: string) => {
	if (value === 'no_agent') return 'Thành viên';
	return value;
};

const chartConfig: Record<string, { label: string; color?: string }> = {
	visitors: {
		label: 'Tổng thành viên',
	},
	province_name: {
		label: 'Tỉnh ',
		color: 'var(--chart-1)',
	},
	no_agent: {
		label: 'Tổng thành viên',
		color: 'var(--chart-1)',
	},
};
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			// Áp dụng Tailwind CSS cho Tooltip container
			<div className="p-3 bg-white border border-gray-400 shadow-md rounded-lg text-xs">
				<p className="font-semibold text-gray-700">{label}</p>
				{payload.map((item: any, index: number) => (
					<p key={index} style={{ color: item.color }} className="text-xs">
						{`${chartConfig[item.name]?.label}: ${formatNumber(item.value)}`}
					</p>
				))}
			</div>
		);
	}
	return null;
};
const transformAndFillData = (rawData: RawData[]): FinalData[] => {
	const aggregatedMap = new Map<number, Omit<FinalData, 'month'>>();
	for (let i = 1; i <= 12; i++) {
		aggregatedMap.set(i, { total: 0 });
	}

	rawData.forEach((item: any) => {
		const month = item.month;
		// const type = item.type_name;
		const total = item.no_agent;
		const currentMonthData: any = aggregatedMap.get(month);
		if (currentMonthData) {
			currentMonthData.total = total;
		}
	});

	const finalResult: FinalData[] = [];

	for (let i = 1; i <= 12; i++) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const data = aggregatedMap.get(i)!;
		finalResult.push({
			month: MONTH_NAMES[i],
			total: Math.max(0, data.total),
			// none_life: Math.max(0, data.none_life),
		});
	}

	return finalResult;
};
const xAxisTextStyle: any = {
	fontSize: 12,
	fill: '#333',
	angle: -60,
	textAnchor: 'end',
};
const formatProvinceName = (name: string): string => {
	// 1. Thay thế "Thành phố " trước, vì chuỗi này dài hơn
	let result = name.replace('Thành phố ', 'Tp. ');

	// 2. Tiếp tục thay thế "Tỉnh "
	result = result.replace('Tỉnh ', 'T. ');

	return result;
};
interface Props {
	colors?: any;
	classNames?: {
		title: string;
	};
}

export const AgentProvinceChart = ({ colors, classNames }: Props) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS?.dashboard;
	const { getAll } = useCrud(
		[basePath?.listAgentProvince],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.listAgentProvince) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: dataQuery, isFetching }: any = getAll();
	const chartData = useMemo(() => {
		if (!dataQuery) return [];
		return dataQuery.map((item: any) => ({
			province_name: formatProvinceName(item.province_name),
			no_agent: item.no_agent,
		}));
		// return transformAndFillData(dataQuery as RawData[]);
	}, [dataQuery]);

	return (
		<Card
			radius="sm"
			shadow="none"
			classNames={{
				body: 'gap-y-5 py-0 px-5',
			}}
		>
			<CardHeader>
				<Typography variant="h5" className={classNames?.title}>
					Biểu đồ thành viên theo tỉnh thành
				</Typography>
			</CardHeader>
			<CardBody>
				{isFetching ? (
					<Loading />
				) : (
					<ResponsiveContainer width="100%" height={410}>
						<BarChart
							accessibilityLayer
							data={chartData}
							margin={{ top: 10, right: 10, left: 20, bottom: 90 }}
						>
							<CartesianGrid vertical={false} strokeWidth={0.2} />
							<XAxis
								dataKey="province_name"
								tickLine={false}
								tickMargin={5}
								interval={0}
								axisLine={false}
								tick={xAxisTextStyle}
							/>
							<Tooltip content={<CustomTooltip />} cursor={false} />

							<Bar
								dataKey="no_agent"
								fill={colors.lifeColor.color}
								radius={1}
								barSize={25}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardBody>
		</Card>
	);
};
