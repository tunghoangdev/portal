import 'chart.js/auto';
import 'rc-slider/assets/index.css';
import { Card, CardBody, Grid, Stack, Typography } from '~/components/ui';
import { Icons } from '~/components/icons';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import AgentChildLevel from './agent-child-level';
import { useMemo } from 'react';
import { ROLES } from '~/constant';
import { useLocation } from '@tanstack/react-router';
function renderCard(data: any) {
	return (
		<Card
			shadow="none"
			classNames={{
				base: `${data?.bg} min-h-[100px] border-none w-full`,
				body: 'text-center relative pt-5',
			}}
		>
			<CardBody>
				<Icons.users
					className={`${data?.text2 || ''} absolute top-2.5 right-2.5`}
					size={34}
					strokeWidth={1}
				/>
				<Typography
					variant="h4"
					className={`text-3xl font-bold ${data?.text || ''}`}
				>
					{data?.value}
				</Typography>
				<Typography variant="body" className="text-sm">
					{data?.label || ''}
				</Typography>
				<Typography
					variant="body"
					className={`text-[13px] ${data?.text || ''} font-medium`}
				>
					{data?.desc || ''}
				</Typography>
			</CardBody>
		</Card>
	);
}
interface Props {
	colors?: any;
	classNames?: {
		title: string;
	};
}
export const AgentStats = ({ colors, classNames }: Props) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS?.dashboard;

	const { getAll } = useCrud(
		[basePath?.newAgentWeek, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.newAgentWeek) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	// // *** QUERY ***
	const { data: agentWeek }: any = getAll();

	const { getAll: getAllNewAgentMonth } = useCrud(
		[basePath?.newAgentMonth, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.newAgentMonth) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	// // *** QUERY ***
	const { data: agentMonth }: any = getAllNewAgentMonth();

	const { getAll: getAllLevel } = useCrud(
		[basePath.listChildByLevel, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.listChildByLevel) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);

	const { data: agentLevelList }: any = getAllLevel();
	// // *** QUERY ***
	// const { data: topAgent }: any = getAllTopAgent();
	const totalAgent = useMemo(() => {
		if (!agentLevelList?.length) return 0;
		return agentLevelList.reduce(
			(total: any, item: any) => total + item.no_agent,
			0,
		);
	}, [agentLevelList]);

	return (
		<Grid container spacing={4} className="mb-5">
			<Grid item xs={12} md={4}>
				<Typography variant="h5" className={`${classNames?.title} mb-2.5`}>
					Tổng số thành viên hệ thống
				</Typography>
				{renderCard({
					value: totalAgent,
					isMonth: false,
					label: 'Thành viên',
					desc: 'toàn hệ thống',
					text: colors.noneLifeColor.base,
					text2: 'text-success/50',
					bg: 'bg-success/5',
				})}
				{/* <Typography variant="h5" className={classNames?.title}>
					Thống kê thành viên
				</Typography> */}
				<Stack alignItems={'center'} className="w-full gap-x-5 my-2.5">
					{agentWeek &&
						renderCard({
							value: agentWeek?.content ?? agentWeek,
							isMonth: false,
							label: 'Thành viên mới',
							desc: 'trong tuần',
							text: 'text-warning',
							text2: 'text-warning/50',
							bg: 'bg-warning/5',
						})}
					{agentMonth &&
						renderCard({
							value: agentMonth?.content ?? agentMonth,
							label: 'Thành viên mới',
							desc: 'trong tháng',
							text: 'text-secondary',
							text2: 'text-secondary/50',
							bg: 'bg-secondary/5',
							isMonth: true,
						})}
				</Stack>

				{/* <Typography variant="h5" className={classNames?.title}>
					Top 5 thành viên mới nhất
				</Typography>
				<ul className="p-0 m-0 flex flex-col gap-y-2.5 mt-2.5">
					{topAgent?.map((item: any, index: number) => (
						<li key={index} className="p-2.5 bg-[#F9F9F9] rounded-lg">
							<UserCell data={item} />
						</li>
					))}
				</ul> */}
			</Grid>
			<Grid item xs={12} md={8}>
				{agentLevelList && (
					<AgentChildLevel classNames={classNames} items={agentLevelList} />
				)}

				{/* <AgentMonthChart colors={colors} classNames={classNames} /> */}
			</Grid>
		</Grid>
	);
};
