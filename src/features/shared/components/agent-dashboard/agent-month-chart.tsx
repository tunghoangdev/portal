import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { serializeListData, useFetchData } from '~/hooks/query/query';
import classNames from 'classnames';
import { Divider } from '~/components/ui';

const AgentMonthChart = ({ query, userId, open }: any) => {
	const [noAgents, seNoAgents] = useState([]);

	// *** QUERY ***
	const { data: dataQuery, isFetching } = useFetchData({
		url: query.agentMonthChart,
		payload: {
			id: userId,
		},
		options: {
			enabled: open && Boolean(userId),
		},
	});

	const data = {
		labels: [
			'T.1',
			'T.2',
			'T.3',
			'T.4',
			'T.5',
			'T.6',
			'T.7',
			'T.8',
			'T.9',
			'T.10',
			'T.11',
			'T.12',
		],
		datasets: [
			{
				label: 'Số lượng',
				data: noAgents,
				borderColor: '#3366FF',
				backgroundColor: 'rgba(51, 102, 255, 0.2)',
				tension: 0.4,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		scales: {
			y: {
				beginAtZero: true,
				max: 50,
				ticks: { stepSize: '2' },
			},
		},
	};

	useEffect(() => {
		if (dataQuery) {
			const dataChart = serializeListData(dataQuery);
			const month: any = Array(12).fill(0);

			dataChart.forEach((entry: any) => {
				const index = entry.month - 1; // Convert month (1-based) to array index (0-based)
				month[index] = entry.no_agent;
			});

			seNoAgents(month);
		}
	}, [dataQuery]);

	return (
		<div className="h-[100%]">
			<Divider>
				<span className="text-info font-semibold">
					Biểu đồ thành viên theo tháng (Biểu đồ đường):
				</span>
			</Divider>
			<div>
				<div
					className={classNames('overlay-loading-datatable', {
						show: isFetching,
					})}
				>
					<div className="main">
						<div className="b">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
				<div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
					<Line data={data} options={options} />
				</div>
			</div>
		</div>
	);
};

export default AgentMonthChart;
