import {
	Card,
	CardBody,
	CardHeader,
	Grid,
	Stack,
	Typography,
} from '~/components/ui';
import Loading from '~/components/ui/loading';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuth } from '~/hooks';
import { useCrud } from '~/hooks/use-crud-v2';
import { useEffect, useState } from 'react';
import { LevelCell } from '~/features/shared/components/cells';

const levelColors: Record<number, string> = {
	1: '#2b7fff',
	2: '#00c950',
	3: '#f0b100',
	4: '#615fff',
	5: '#ad46ff',
	6: '#fb2c36',
	7: '#ff6900',
	8: '#000000',
};

const levelBgClasses: Record<number, string> = {
	1: 'bg-[rgba(0,137,173,0.1)]',
	2: 'bg-[rgba(0,201,80,0.1)]',
	3: 'bg-[rgba(240,177,0,0.1)]',
	4: 'bg-[rgba(97,95,255,0.1)]',
	5: 'bg-[rgba(173,70,255,0.1)]',
	6: 'bg-[rgba(251,44,54,0.1)]',
	7: 'bg-[rgba(255,105,0,0.1)]',
	8: 'bg-[rgba(0,0,0,0.1)]',
};
interface Props {
	colors?: any;
	classNames?: {
		title: string;
	};
	items: any[];
}
export default function AgentChildLevel({ classNames, items }: Props) {
	const [data, setData] = useState<any>([]);
	// const basePath = API_ENDPOINTS.dashboard;
	// const { getAll } = useCrud([basePath.listChildByLevel], {
	// 	endpoint: role,
	// });
	// const { data: agentLevelList, isFetching }: any = getAll();

	useEffect(() => {
		if (items) {
			const newData = items.map((item: any) => ({
				id: item.id_level,
				code: item.level_code,
				total: item.no_agent,
				bg: levelBgClasses[item.id_level],
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
				<Typography variant="h5" className={classNames?.title}>
					Cấp bậc thành viên
				</Typography>
				<Grid container spacing={3}>
					{data?.map((item: any) => (
						<Grid item xs={6} md={3} key={item.id}>
							<Stack
								direction={'col'}
								alignItems={'center'}
								className={`py-2.5 ${item.bg} rounded-xl gap-y-2.5`}
							>
								<LevelCell
									levelCodeKey="code"
									data={item}
									levelIdKey="id"
									className=" md:text-sm rounded-full size-7 md:size-10 justify-center items-center leading-0"
								/>
								<Typography
									variant={'h5'}
									className="mb-0 text-xl md:text-3xl font-bold"
								>
									{item.total}
								</Typography>
								{/* <Typography
									variant={'paragraph'}
									className="text-xs text-default-700"
								>
									thành viên
								</Typography> */}
							</Stack>
						</Grid>
					))}
				</Grid>
			</CardBody>
		</Card>
	);
}
