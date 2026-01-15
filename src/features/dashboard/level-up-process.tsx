import { LevelCell } from '~/features/shared/components/cells';
import { Card, CardBody, CardHeader, Stack, Typography } from '~/components/ui';
import Loading from '~/components/ui/loading';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { formatNumber } from '~/utils/formater';
import { Progress, Tooltip } from '@heroui/react';
import { Icons } from '~/components/icons';
import { useLocation } from '@tanstack/react-router';
import { ROLES } from '~/constant';
const classProgress = {
	// base: 'max-w-md',
	track: 'h-2',
	indicator: 'bg-blue-500',
	label: 'text-xs text-default-800',
	value: 'text-foreground/60',
};
interface IProps {
	classNames?: {
		title: string;
	};
}
export const LevelUpProcess = ({ classNames }: IProps) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS.dashboard;
	const { getAll } = useCrud(
		[basePath.agentLevelUpProcess, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath.agentLevelUpProcess) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: agentLevelList, isFetching }: any = getAll();
	if (isFetching) return <Loading />;
	const {
		xp_person,
		xp_person_reach,
		xp_group,
		xp_group_reach,
		no_child,
		no_child_reach,
	} = agentLevelList || {};
	const perCentXpPerson = Math.round((xp_person / xp_person_reach) * 100);
	const perCentXpGroup = Math.round((xp_group / xp_group_reach) * 100);
	const perCentXpNoChild = Math.round((no_child / no_child_reach) * 100);

	return (
		<Card
			radius="sm"
			classNames={{ base: 'w-full mt-2.5', body: 'gap-y-5 pb-10' }}
		>
			<CardHeader>
				<Typography variant="h5" className={classNames?.title}>
					Lộ trình thăng tiến
				</Typography>
			</CardHeader>
			<CardBody>
				<Stack alignItems={'center'} className="gap-2">
					<Typography variant="body2m">
						<LevelCell data={agentLevelList} />
					</Typography>
					<Icons.arrowRight size={16} strokeWidth={1} />
					<Typography variant="body2m">
						<LevelCell
							data={agentLevelList}
							levelCodeKey="agent_level_code_next"
							levelIdKey="id_agent_level_next"
						/>
					</Typography>
				</Stack>
				<Tooltip
					content={`Điểm tích lũy đang có ${formatNumber(xp_person)}/${formatNumber(
						xp_person_reach,
					)}`}
					color="foreground"
					classNames={{
						content: 'text-xs font-medium',
					}}
				>
					<Progress
						classNames={classProgress}
						label="Điểm tích lũy cá nhân"
						radius="sm"
						showValueLabel={true}
						size="sm"
						value={perCentXpPerson}
						valueLabel={
							<span className="text-xs text-pink-800 font-semibold">
								{perCentXpPerson}%
							</span>
						}
					/>
				</Tooltip>
				<Tooltip
					content={`Điểm tích lũy đang có ${formatNumber(xp_group)}/${formatNumber(
						xp_group_reach,
					)}`}
					color="foreground"
					classNames={{
						content: 'text-xs font-medium',
					}}
				>
					<Progress
						classNames={classProgress}
						label="Điểm tích lũy nhóm"
						radius="sm"
						showValueLabel={true}
						size="sm"
						value={perCentXpGroup}
						valueLabel={
							<span className="text-xs text-success font-semibold">
								{perCentXpGroup}%
							</span>
						}
					/>
				</Tooltip>
				<Tooltip
					content={`Cơ cấu hệ thống ${formatNumber(no_child)}/${formatNumber(
						no_child_reach,
					)}`}
					color="foreground"
					classNames={{
						content: 'text-xs font-medium',
					}}
				>
					<Progress
						classNames={classProgress}
						label="Cơ cấu hệ thống"
						radius="sm"
						showValueLabel={true}
						size="sm"
						value={perCentXpNoChild}
						valueLabel={
							<span className="text-xs text-shadow-green-700 font-semibold">
								{perCentXpNoChild}%
							</span>
						}
					/>
				</Tooltip>
			</CardBody>
		</Card>
	);
};
