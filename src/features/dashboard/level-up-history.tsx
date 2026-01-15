import { LevelCell, UserCell } from '~/features/shared/components/cells';
import {
	Button,
	Card,
	CardBody,
	NoRowsOverlay,
	Stack,
	Typography,
} from '~/components/ui';
import Loading from '~/components/ui/loading';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth, useFilter } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { Icons } from '~/components/icons';
import { formatDate } from '~/utils/formater';
import { ScrollShadow } from '@heroui/react';
import { exportDataToExcel } from '~/utils/export';
import { useLocation } from '@tanstack/react-router';
import { ROLES } from '~/constant';
interface IProps {
	classNames?: {
		title: string;
	};
}
export const LevelUpHistory = ({ classNames }: IProps) => {
	const { role } = useAuth();
	const { agentId } = useFilter();
	const location = useLocation(); const pathname = location.pathname;
	const basePath = API_ENDPOINTS.dashboard;
	const { getAll } = useCrud(
		[basePath.listChildLevelUp, agentId],
		{
			endpoint: agentId ? ROLES.AGENT : role,
			id_agent: agentId,
			id: agentId,
		},
		{
			enabled:
				Boolean(basePath.listChildLevelUp) ||
				(Boolean(agentId) && !pathname.endsWith('/dashboard')),
		},
	);
	const { data: agentLevelList, isFetching }: any = getAll();
	const handleExport = () => {
		const fileName = 'Danh_sach_thanh_vien_thang_tien';
		const columns = [
			'Họ tên',
			'Số điện thoại',
			'Cấp bậc cũ',
			'Cấp bậc mới',
			'Tháng',
			'Ngày khởi tạo',
			'Năm',
		];

		const list = agentLevelList.map((item: any) => ({
			'Họ tên': item.agent_name,
			'Số điện thoại': item.agent_phone,
			'Cấp bậc cũ': item.old_level_code,
			'Cấp bậc mới': item.new_level_code,
			'Ngày khởi tạo': formatDate(item.created_date, 'dd/MM/yyyy'),
			Tháng: formatDate(item.created_date, 'MM'),
			Năm: formatDate(item.created_date, 'yyyy'),
		}));
		exportDataToExcel(list, columns, fileName);
	};
	if (isFetching) return <Loading />;
	return (
		<Card
			radius="sm"
			shadow="none"
			classNames={{ base: 'w-full', body: 'gap-y-2.5 py-0 pb-5' }}
		>
			{/* <CardHeader>
				<Typography variant="h5" className={classNames?.title}>
					Thành viên thăng tiến
				</Typography>
			</CardHeader> */}
			<Stack justifyContent="between" className="my-2.5">
				<Typography variant="h5" className={classNames?.title}>
					Thành viên thăng tiến
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
			<ScrollShadow hideScrollBar className="h-[445px]" size={10}>
				<CardBody>
					{(agentLevelList?.length > 0
						? agentLevelList
						: Array.from({ length: 6 })
					)?.map((item: any, index: number) => {
						return (
							<Stack
								key={index}
								alignItems={'center'}
								className={`gap-1 p-2 rounded-md ${index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-[#f5f5f5]'}`}
								justifyContent={'between'}
							>
								<div className="flex-1 flex flex-col">
									{item?.agent_name && <UserCell data={item} />}
								</div>
								<div>
									<Stack justifyContent={'center'} className="gap-x-2.5">
										{item?.old_level_code && (
											<LevelCell
												data={item}
												levelCodeKey="old_level_code"
												levelIdKey="id_level_old"
											/>
										)}
										{item?.new_level_code && (
											<Icons.chevronsRight
												size={16}
												strokeWidth={1.5}
												className="text-green-600"
											/>
										)}
										{item?.new_level_code && (
											<LevelCell
												data={item}
												levelCodeKey="new_level_code"
												levelIdKey="id_level_new"
											/>
										)}
									</Stack>
									{item?.created_date && (
										<Typography
											variant="body2r"
											className="text-xs text-default-600 ml-9 italic"
										>
											{formatDate(item?.created_date)}
										</Typography>
									)}
								</div>
							</Stack>
						);
					})}
				</CardBody>
			</ScrollShadow>
		</Card>
	);
};
