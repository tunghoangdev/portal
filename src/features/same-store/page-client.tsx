'use client';
import { useAuth, useDataQuery } from '@/hooks';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useCrud } from '@/hooks/use-crud-v2';
import { Button, Grid, Stack, Typography } from '@/components/ui';
import { useMemo } from 'react';
import { groupBy } from 'lodash';
import { User } from '@heroui/react';
import { getFullFtpStoreUrl } from '@/lib/auth';
import { formatNumber } from '@/utils/formater';
export default function SameStore() {
	// Global state
	const { role } = useAuth();
	const basePath = API_ENDPOINTS[role].products;
	// CRUD HOOKS
	const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
		basePath: basePath.list,
		endpoint: 'root',
		// rangeFilter: true,
	});

	const { getInfinite } = useCrud(
		queryKey,
		queryParams,
		{
			enabled: isQueryEnabled,
		}
	);
	
	const {
		listData,
	}: any = getInfinite();

	const items = useMemo(() => {
		if (!listData) return [];

		return groupBy(listData, 'group_name');
	}, [listData]);

	return (
		<Stack direction={'col'}>
			{Object.entries(items).map(([key, value]) => (
				<Stack key={key} direction={'col'} className='py-4'>
					<Typography variant={'body2m'} className='text-lg font-semibold mb-2.5'>{key}</Typography>
					<Grid container spacing={4}>
						{value.map((item: any) => (
							<Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
								<Stack alignItems={'center'} justifyContent={'between'} className='w-full'>
									<User 
									name={item.product_name}
									 avatarProps={{
										src: getFullFtpStoreUrl(item.link_icon),
										classNames: {
											base: 'rounded-md'	
										}
									}}
									description={item.product_code}
									classNames={{
										name: 'text-sm font-semibold',
										description: 'text-xs'
									}}
								/>
									<Stack direction={'col'} justifyContent={'center'} alignItems={'center'}>
										<Button
											size="sm"
											className='min-w-0 min-h-0 w-auto h-auto px-[5px] py-[2px] bg-secondary/25 hover:bg-secondary/70 text-secondary font-bold text-[10px]'
											onClick={() => {

											}}
										>
											Mua
										</Button>
										<Typography variant={'body2b'} className='text-xs'>{formatNumber(item.amount)}</Typography>
									</Stack>
								</Stack>
							</Grid>
						))}
					</Grid>
					{/* {value.map((item: any) => (
						<Stack key={item.id}>
							<h3>{item.name}</h3>
						</Stack>
					))} */}
				</Stack>
			))}
		</Stack>
	);
}
