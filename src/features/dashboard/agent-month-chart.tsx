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
	Area,
	YAxis,
	AreaChart,
} from 'recharts';
import { formatNumber } from '~/utils/formater';
import { useIsMobile } from '~/hooks/use-mobile';
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
	if (value === 'total') return 'Thành viên';
	return value;
};

const chartConfig: Record<string, { label: string; color?: string }> = {
	visitors: {
		label: 'Tổng thành viện',
	},
	month: {
		label: 'Tháng',
		color: 'var(--chart-1)',
	},
	total: {
		label: 'Tổng thành viên',
		color: 'var(--chart-1)',
	},
};
const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			// Áp dụng Tailwind CSS cho Tooltip container
			<div className="p-3 bg-white border border-gray-400 shadow-md rounded-lg text-xs">
				<p className="font-semibold text-gray-700">{`Tháng ${label.replace(
					'T',
					'',
				)}`}</p>
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

const xAxisTextStyle = {
	fontFamily: 'Roboto, sans-serif',
	fontSize: 11,
	fontWeight: 500,
};

const yAxisFormatter = (value: number) => {
	// Nếu giá trị lớn hơn hoặc bằng 1 tỷ (1,000,000,000)
	if (Math.abs(value) >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(1)} Tỷ`;
	}
	// Nếu giá trị lớn hơn hoặc bằng 1 triệu (1,000,000)
	if (Math.abs(value) >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)} Tr`;
	}
	return value.toLocaleString();
};
interface Props {
	colors?: any;
	classNames?: {
		title: string;
	};
}

export const AgentMonthChart = ({ colors, classNames }: Props) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const isMobile = useIsMobile();
	const basePath = API_ENDPOINTS?.dashboard;
	const { getAll } = useCrud(
		[basePath?.agentMonthChart, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.agentMonthChart) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: dataQuery, isFetching } = getAll();
	const chartData = useMemo(() => {
		if (!dataQuery) return [];
		return transformAndFillData(dataQuery as RawData[]);
	}, [dataQuery]);

	return (
		<Card
			radius="sm"
			shadow="none"
			classNames={{
				body: 'gap-y-5 py-0',
			}}
		>
			<CardHeader>
				<Typography variant="h5" className={classNames?.title}>
					Biểu đồ thành viên theo tháng
				</Typography>
			</CardHeader>
			<CardBody>
				{isFetching ? (
					<Loading />
				) : (
					<ResponsiveContainer width="100%" height={isMobile ? 300 : 450}>
						<BarChart
							accessibilityLayer
							data={chartData}
							// margin={{ bottom: 20 }}
						>
							<CartesianGrid vertical={false} strokeWidth={0.2} />
							<XAxis
								dataKey="month"
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 12 }}
							/>
							<Tooltip content={<CustomTooltip />} cursor={false} />

							<Bar
								dataKey="total"
								fill={colors.noneLifeColor.color}
								radius={1}
								barSize={30}
							/>
						</BarChart>
					</ResponsiveContainer>
				)}
			</CardBody>
		</Card>
	);
};
