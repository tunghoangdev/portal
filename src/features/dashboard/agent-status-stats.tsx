import { Icons } from '~/components/icons';
import { Card, CardBody, Stack, Typography } from '~/components/ui';
import { ROLES } from '~/constant';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { cn } from '~/lib/utils';
import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';

function renderCard(data: any) {
	return (
		<Card
			shadow="none"
			classNames={{
				base: `${data?.bg} min-h-[120px] border-none w-full`,
				body: cn(
					'text-center relative',
					'[&>.icon-status]:absolute [&>.icon-status]:top-1.5 [&>.icon-status]:md:top-2.5 [&>.icon-status]:right-1.5 [&>.icon-status]:md:right-2.5 [&>.icon-status]:opacity-50 [&>.icon-status]:scale-80',
					'hover:[&>.icon-status]:opacity-100 hover:[&>.icon-status]:transition-opacity hover:[&>.icon-status]:scale-110 hover:[&>.icon-status]:transition-transform',
				),
			}}
			key={data.id}
		>
			<CardBody>
				{data?.icon}
				<Typography
					variant="h4"
					className={`text-xl md:text-3xl mt-2.5 font-bold ${data?.text || ''}`}
				>
					{data?.value}
				</Typography>
				<Typography variant="body" className="text-sm text-default-600">
					{data?.label || ''}
				</Typography>
			</CardBody>
		</Card>
	);
}

const itemDatas: Record<number, any> = {
	1: {
		bg: 'bg-warning/10',
		text: 'text-warning',
		icon: (
			<Icons.loaderCircle
				size={40}
				strokeWidth={1}
				className="text-warning icon-status"
			/>
		),
	},
	2: {
		bg: 'bg-success/10',
		text: 'text-success',
		icon: <Icons.doubleCheck size={40} className="text-success icon-status" />,
	},
	3: {
		bg: 'bg-danger/10',
		text: 'text-danger',
		icon: (
			<Icons.warning
				size={40}
				strokeWidth={1}
				className="text-danger icon-status"
			/>
		),
	},
};
interface IProps {
	classNames?: {
		title: string;
	};
}
export const AgentStatusStats = ({ classNames }: IProps) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS?.dashboard;

	const { getAll } = useCrud(
		[basePath?.listChildByStatus, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.listChildByStatus) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	// // *** QUERY ***
	const { data: agentStatus }: any = getAll();
	const listStatus = useMemo(() => {
		if (!agentStatus) return [];
		return agentStatus?.map((item: any) => {
			return {
				id: item.id_agent_status,
				label: item.agent_status_name,
				icon: itemDatas[item.id_agent_status].icon,
				value: item.no_agent,
				desc: item.desc,
				text: itemDatas[item.id_agent_status].text,
				text2: item.text2,
				bg: itemDatas[item.id_agent_status].bg,
			};
		});
	}, [agentStatus]);
	return (
		<div>
			<Typography variant="h5" className={classNames?.title || ''}>
				Trạng thái thành viên
			</Typography>
			<Stack
				alignItems={'center'}
				// direction={'col'}
				className="w-full gap-x-2.5 my-2.5"
			>
				{listStatus?.map((item: any) => renderCard({ ...item }))}
			</Stack>
		</div>
	);
};
