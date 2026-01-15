import 'chart.js/auto';
import { useMemo } from 'react';
import { Card, CardBody, CardHeader, Typography } from '~/components/ui';
import { useCrud } from '~/hooks/use-crud-v2';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import Loading from '~/components/ui/loading';
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	Tooltip,
	ResponsiveContainer,
	Legend,
	YAxis,
} from 'recharts';
import { formatNumber } from '~/utils/formater';
import { ROLES } from '~/constant';
import { isArray } from 'lodash';
import { useIsMobile } from '~/hooks/use-mobile';
import { useLocation } from '@tanstack/react-router';
type RawData = {
	month: number;
	type_name: 'life' | 'none_life' | 'abroad';
	total_xfyp: number;
};

type FinalData = {
	month: string;
	life: number;
	none_life: number;
	abroad: number;
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
	if (value === 'life') return 'Nhân thọ';
	if (value === 'none_life') return 'Phi nhân thọ';
	if (value === 'abroad') return 'Di trú';
	return value;
};

const chartConfig: Record<string, { label: string; color?: string }> = {
	visitors: {
		label: 'Tổng doanh thu',
	},
	none_life: {
		label: 'Phi nhân thọ',
		color: 'var(--chart-2)',
	},
	abroad: {
		label: 'Di trú',
		color: 'var(--chart-3)',
	},
	life: {
		label: 'Nhân thọ',
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
						{`${chartConfig[item.name].label}: ${formatNumber(item.value)}`}
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
		aggregatedMap.set(i, { life: 0, none_life: 0, abroad: 0 });
	}

	rawData.forEach((item) => {
		const month = item.month;
		const type = item.type_name;
		const total = item.total_xfyp;
		const currentMonthData = aggregatedMap.get(month);

		if (currentMonthData) {
			if (type === 'life' || type === 'none_life' || type === 'abroad') {
				currentMonthData[type] += total;
			}
		}
	});

	const finalResult: FinalData[] = [];

	for (let i = 1; i <= 12; i++) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const data = aggregatedMap.get(i)!;
		finalResult.push({
			month: MONTH_NAMES[i],
			life: data.life,
			none_life: data.none_life,
			abroad: data.abroad,
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
	colors: any;
	classNames?: {
		title: string;
	};
}
export const XfypChart = ({ colors, classNames }: Props) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const isMobile = useIsMobile();
	const basePath = API_ENDPOINTS?.dashboard;
	const { getAll } = useCrud(
		[basePath?.generalChart, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.generalChart) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: dataQuery, isFetching } = getAll();
	const chartData = useMemo(() => {
		if (!dataQuery || !isArray(dataQuery)) return [];
		return transformAndFillData(dataQuery as RawData[]);
	}, [dataQuery]);

	return (
		<Card
			radius="sm"
			classNames={{
				body: 'gap-y-5 py-0',
			}}
		>
			<CardHeader>
				<Typography variant="h5" className={classNames?.title}>
					Biểu đồ tổng doanh số
				</Typography>
			</CardHeader>
			<CardBody>
				{isFetching ? (
					<Loading />
				) : (
					<ResponsiveContainer width="100%" height={isMobile ? 300 : 450}>
						<AreaChart data={chartData}>
							<Tooltip content={<CustomTooltip />} />
							<Legend
								verticalAlign="top"
								formatter={formatLegendName}
								fontSize={11}
							/>
							<defs>
								<linearGradient id="lifeGradient" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.lifeColor.color}
										stopOpacity={0.8}
									/>{' '}
									<stop
										offset="95%"
										stopColor="#ffffff"
										stopOpacity={0.1}
									/>{' '}
								</linearGradient>

								{/* GRADIENT 2: Fill cho "none_life" (nếu khác nhau) */}
								<linearGradient
									id="noneLifeGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor={colors.noneLifeColor.color}
										stopOpacity={0.8}
									/>
									<stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
								</linearGradient>
								{/* GRADIENT 3: Fill cho "none_life" (nếu khác nhau) */}
								<linearGradient id="abroadGradient" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor={colors.abroadColor.color}
										stopOpacity={0.8}
									/>
									<stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
								</linearGradient>
							</defs>
							<YAxis
								domain={[0, 'auto']}
								yAxisId={0}
								tickLine={false}
								// axisLine={false}
								// hide
								tickFormatter={yAxisFormatter}
								style={xAxisTextStyle}
							/>
							<CartesianGrid vertical={false} stroke="#e5e7eb" />
							{/* Thêm màu xám nhạt cho grid */}
							<XAxis
								dataKey="month"
								// domain={[0, 'dataMax']}
								tickLine={false}
								style={xAxisTextStyle}
							/>
							<Area
								yAxisId={0}
								dataKey="abroad"
								type="monotone"
								fill="url(#abroadGradient)"
								stroke={colors.abroadColor.color}
								// stackId="a"
								baseValue={0}
								dot={{
									fill: colors.abroadColor.color,
									stroke: '#fff',
									strokeWidth: 2,
									r: 4,
								}}
							/>
							<Area
								yAxisId={0}
								dataKey="none_life"
								type="monotone"
								fill="url(#noneLifeGradient)"
								stroke={colors.noneLifeColor.color}
								// stackId="a"
								baseValue={0}
								dot={{
									fill: colors.noneLifeColor.color,
									stroke: '#fff',
									strokeWidth: 2,
									r: 4,
								}}
							/>
							<Area
								yAxisId={0}
								dataKey="life"
								type="monotone"
								fill="url(#lifeGradient)"
								stroke={colors.lifeColor.color}
								// stackId="a"
								baseValue={0}
								dot={{
									fill: colors.lifeColor.color,
									stroke: '#fff',
									strokeWidth: 2,
									r: 4,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
				{/* <Divider>
					<span className="text-info font-semibold">
						Biểu đồ thành viên theo tháng (Biểu đồ đường):
					</span>
				</Divider> */}
				<div className="w-full md:max-w-[800px] mx-auto">
					{/* <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}> */}
					{/* {isFetching ? (
						<Loading />
					) : (
						<Line data={chartData} options={options} />
					)} */}
				</div>
			</CardBody>
		</Card>
	);
};
