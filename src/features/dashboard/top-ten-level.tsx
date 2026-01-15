import { Typography } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { UserCell } from '~/features/shared/components/cells';
import { ScrollShadow } from '@heroui/react';
import { formatDate, formatTime } from '~/utils/formater';
import { useLocation } from '@tanstack/react-router';
import { ROLES } from '~/constant';
interface Props {
	classNames?: {
		title: string;
	};
}
export const TopTenLevel = ({ classNames }: Props) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS?.dashboard;

	const { getAll: getAllTopAgent } = useCrud(
		[basePath?.topAgentList, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath?.topAgentList) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);

	const { data: topAgent }: any = getAllTopAgent();
	return (
		<div>
			<Typography variant="h5" className={classNames?.title}>
				Top thành viên mới đăng ký
			</Typography>
			<ScrollShadow hideScrollBar className="h-[320px]" size={10}>
				<ul className="p-0 m-0 flex flex-col gap-y-2.5 mt-2.5">
					{topAgent?.map((item: any, index: number) => (
						<li
							key={index}
							className="p-2.5 bg-[#F9F9F9] rounded-lg flex items-center justify-between"
						>
							<UserCell data={item} />
							<span className="text-xs text-default-700">
								{formatDate(item.created_date)}
							</span>
						</li>
					))}
				</ul>
			</ScrollShadow>
		</div>
	);
};
