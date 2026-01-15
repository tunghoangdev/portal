import { UserCell } from '~/features/shared/components/cells';
import { Button, Stack, Typography } from '~/components/ui';
import Loading from '~/components/ui/loading';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { formatDate } from '~/utils/formater';
import { ScrollShadow } from '@heroui/react';
import { Icons } from '~/components/icons';
import { exportDataToExcel } from '~/utils/export';
import { ROLES } from '~/constant';
import { useLocation } from '@tanstack/react-router';
interface IProps {
	classNames?: {
		title: string;
	};
}
export const AgentBirthdayMonth = ({ classNames }: IProps) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS.dashboard;
	const { getAll } = useCrud(
		[basePath.listAgentBirthday, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath.listAgentBirthday) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: agentLevelList, isFetching }: any = getAll();
	const handleExport = () => {
		const fileName = `Danh_sach_thanh_vien_sinh_nhat_thang_${new Date().getMonth() + 1}`;
		const columns = [
			'Họ tên',
			'Số điện thoại',
			'Cấp bậc',
			'Ngày sinh',
			'Tháng',
		];

		const list = agentLevelList.map((item: any) => ({
			'Họ tên': item.agent_name,
			'Số điện thoại': item.agent_phone,
			'Cấp bậc': item.level_code,
			'Ngày sinh': formatDate(item.birthday, 'dd'),
			Tháng: formatDate(item.birthday, 'MM'),
			// Ngay_sinh: formatDate(item.birthday, 'dd-MM'),
		}));
		exportDataToExcel(list, columns, fileName);
	};
	if (isFetching) return <Loading />;
	return (
		<div>
			<Stack justifyContent="between">
				<Typography variant="h5" className={classNames?.title}>
					Thành viên sinh nhật
				</Typography>
				<Button
					endContent={<Icons.download size={14} className="text-default-700" />}
					onClick={handleExport}
					isIconOnly
					variant="light"
					className="p-0 min-w-auto w-auto min-h-0 h-auto text-xs "
				>
					Tải xuống
				</Button>
			</Stack>
			<ScrollShadow
				hideScrollBar
				className={role === ROLES.AGENT ? 'h-[800px]' : 'h-[320px]'}
				size={10}
			>
				<ul className="p-0 m-0 flex flex-col gap-y-2.5 mt-2.5">
					{(agentLevelList?.length > 0
						? agentLevelList
						: Array.from({ length: 6 })
					)?.map((item: any, index: number) => (
						<li
							key={index}
							className={`p-2.5 ${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-[#f5f5f5]'} rounded-lg flex items-center justify-between`}
						>
							{item?.agent_name && <UserCell data={item} />}
							{item?.birthday && (
								<span className="text-xs text-default-700">
									{formatDate(item.birthday, 'dd-MM')}
								</span>
							)}
						</li>
					))}
				</ul>
			</ScrollShadow>
		</div>
	);
};
