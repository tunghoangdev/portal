import {
	Card,
	CardBody,
	CardHeader,
	Grid,
	Stack,
	Typography,
} from '~/components/ui';
import { useEffect, useState } from 'react';
import { LevelCell } from '~/features/shared/components/cells';
const levelBgClasses: Record<number, string> = {
	1: 'bg-[rgba(0,137,173,1)]',
	2: 'bg-[rgba(0,201,80,1)]',
	3: 'bg-[rgba(240,177,0,0.05)]',
	4: 'bg-[rgba(97,95,255,0.05)]',
	5: 'bg-[rgba(173,70,255,0.05)]',
	6: 'bg-[rgba(251,44,54,0.05)]',
	7: 'bg-[rgba(255,105,0,0.05)]',
	8: 'bg-[rgba(0,0,0,0.05)]',
};
const levelColorClasses: Record<number, string> = {
	1: '!text-[rgba(0,137,173,1)]',
	2: '!text-[rgba(0,201,80,1)]',
	3: '!text-[rgba(240,177,0,1)]',
	4: '!text-[rgba(97,95,255,1)]',
	5: '!text-[rgba(173,70,255,1)]',
	6: '!text-[rgba(251,44,54,1)]',
	7: '!text-[rgba(255,105,0,1)]',
	8: '!text-[rgba(0,0,0,1)]',
};
interface Props {
	colors?: any;
	classNames?: {
		title: string;
	};
	items: any[];
}
export default function AgentChildLevel({ classNames, items }: Props) {
	// const { role } = useAuth();
	const [data, setData] = useState<any>([]);
	// const basePath = API_ENDPOINTS.dashboard;
	// const { getAll } = useCrud([basePath.listChildByLevel], {
	// 	endpoint: role,
	// });
	// const { data: agentLevelList, isFetching }: any = getAll();

	useEffect(() => {
		if (!items) return;
		if (items) {
			const newData = items.map((item: any) => ({
				id: item.id_level,
				code: item.level_code,
				total: item.no_agent,
				bg: levelBgClasses[item.id_level],
				color: levelColorClasses[item.id_level],
			}));
			setData(newData);
		}
	}, [items]);

	// if (isFetching) return <Loading />;
	return (
		<Card
			radius="sm"
			shadow="none"
			classNames={{ base: 'w-full', body: 'gap-y-2.5 py-0 outline-none' }}
		>
			<CardBody>
				<Typography variant="h5" className={`${classNames?.title}`}>
					Cấp bậc thành viên
				</Typography>
				<Grid container spacing={3}>
					{data?.map((item: any) => (
						<Grid item xs={3} key={item.id}>
							<Stack
								direction={'col'}
								alignItems={'center'}
								className={
									'bg-success/5 rounded-xl relative py-2.5 min-h-[100px] pt-5'
								}
							>
								{/* <LevelCell
									levelCodeKey="code"
									data={item}
									levelIdKey="id"
									className={`md:text-xl rounded-full size-5 md:size-10 justify-center items-center leading-0 absolute top-2 right-2 bg-transparent shadow-none border-none ${item.color}`}
								/> */}
								<Typography
									variant="h4"
									className={`mb-0 text-3xl font-bold ${item.color}`}
								>
									{item.total}
								</Typography>
								<Typography variant="body" className={'text-sm'}>
									Cấp bậc{' '}
									<span className={`font-semibold ${item.color}`}>
										{item.code}
									</span>
								</Typography>
								<Typography
									variant="body"
									className={'text-[13px] text-default-700'}
								>
									thành viên
								</Typography>
							</Stack>
						</Grid>
					))}
				</Grid>
			</CardBody>
		</Card>
	);
}
