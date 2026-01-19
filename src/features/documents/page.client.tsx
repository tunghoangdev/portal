
import { useEffect } from 'react';
import { useState } from 'react';
import {
	Card,
	CardBody,
	Table,	
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui';
import { Icons } from '@/components/icons';
import { useCrud } from '@/hooks';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { useAuthStore } from '@/stores';
import { Endpoint } from '@/types/axios';
import { FileDowloadCell } from '@/features/shared/components/cells';

const DocumentClientPage = () => {
	// *** STATE ***
	const [searchValue, setSearchValue] = useState('');
	const [groupData, setGroupData] = useState<any>([]);
	const { user, role } = useAuthStore();
	const basePath = API_ENDPOINTS[role].documents.members;
	// *** QUERY ***
	const { getAll } = useCrud(
		[basePath.list, searchValue],
		{
			endpoint: role as Endpoint,
			id_agent_level: user?.id_agent_level,
			info: searchValue,
		},
		{
			enabled: !!user?.id_agent_level,
		},
	);
	const { data: listData, isFetching }: any = getAll();
	// const { data: documentQuery, isFetching } = useFetchData({
	// 	url: URLS.agent.documents.list,
	// 	payload: {
	// 		id_agent_level: userData?.id_agent_level,
	// 		info: searchValue,
	// 	},
	// 	options: {
	// 		enabled: !!userData?.id_agent_level,
	// 	},
	// });

	// *** FUNCTIONS ***
	// const onView = (item: any) => {
	// 	const url = getFullFtpUrl('document', item.link_doc);
	// 	return window.open(url, '_blank');
	// };

	useEffect(() => {
		const list = listData || [];
		if (listData && listData?.length > 0) {
			setGroupData(
				listData.reduce((acc: any, curr: any) => {
					const key = curr.document_type_name;
					if (!acc[key]) {
						acc[key] = [];
					}
					acc[key].push(curr);
					return acc;
				}, {}),
			);
		} else {
			setGroupData(list);
		}
	}, [listData]);

	return (
		<>
			<div className="w-1/3">
				{/* <div className="me-1">
					<InputSearch
						onChange={(value: any) => setSearchValue(String(value))}
						placeholder="Tìm kiếm..."
					/>
				</div> */}
			</div>
			<div className="kb-search-content-info match-height mt-8">
				{Object.keys(groupData).map((key: any) => (
					<div key={key} className="mt-5">
						<h3 className="font-semibold text-secondary mb-1">{key}</h3>
						<Card
							radius="sm"
							classNames={{
								base: 'p-0',
								body: 'p-0',
							}}
						>
							<CardBody>
								<Table>
									<TableHeader>
										<TableRow>
											{/* <th style={{ width: '50px' }}>STT</th> */}
											<TableHead style={{ width: '150px' }}>
												Link tài liệu
											</TableHead>
											<TableHead>Tên tài liệu</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{groupData[key]?.length > 0 &&
											groupData[key].map((item: any) => (
												<TableRow key={item.id}>
													{/* <td>{idx + 1}</td> */}
													<TableCell className="d-flex gap-1">
														{/* <span
																className="cursor-pointer text-primary"
																id={`view_document_${item.id}`}
																onClick={() => onView(item)}
															>
																<FileDowloadCell
																	fileName={item.link_doc}
																	label={'Xem tài liệu'}
																/>
																
															</span> */}
														<FileDowloadCell
															fileName={item.link_doc}
															label={'Xem tài liệu'}
														/>
													</TableCell>
													<TableCell>
														<div className="flex gap-2">
															{item.document_name}
															{item.is_hot && (
																<Icons.star
																	size={16}
																	className="text-secondary fill-secondary"
																/>
															)}
														</div>
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</CardBody>
						</Card>
					</div>
				))}
				{isFetching && (
					<div className="text-center mt-3 flex gap-2">
						{/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
						<i className="fa fa-spinner fa-spin"></i>
						Đang tải dữ liệu...
					</div>
				)}
			</div>
		</>
	);
};

export default DocumentClientPage;
