import { useMemo } from 'react';
import {
	Card,
	CardBody,
	Input,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { Icons } from '~/components/icons';
import { useDataQuery, useFilter } from '~/hooks';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuthStore } from '~/stores';
import { FileDowloadCell } from '~/features/shared/components/cells';
import { useCrud } from '~/hooks/use-crud-v2';
import { debounce } from 'lodash';
import { Spinner } from '@heroui/react';

export const DocumentClientPage = () => {
	const { user, role } = useAuthStore();
	const { setFilter } = useFilter();
	const basePath = API_ENDPOINTS[role].documents.members;
	const { queryParams, queryKey } = useDataQuery({
		basePath: basePath.list,
		filter: {
			id_agent_level: user?.id_agent_level,
		},
	});
	const handleSearch = (value: string) => {
		setFilter('info', value);
	};

	const debouncedSearch = useMemo(() => debounce(handleSearch, 500), []);

	const { getInfinite } = useCrud(queryKey, queryParams);
	const { listData, isFetching }: any = getInfinite();
	const groupDataKeys = useMemo(() => {
		const newData =
			listData?.length > 0
				? listData.reduce((acc: any, curr: any) => {
						const key = curr.document_type_name;
						if (!acc[key]) {
							acc[key] = [];
						}
						acc[key].push(curr);
						return acc;
					}, {})
				: [];
		return Object.entries(newData);
	}, [listData]);
	return (
		<>
			<div className="w-1/3">
				<div className="me-1">
					<Input
						isClearable
						type="text"
						placeholder="Tìm kiếm..."
						onValueChange={(val) => {
							debouncedSearch(val);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								debouncedSearch.cancel();
								handleSearch((e.target as HTMLInputElement).value);
							}
						}}
						startContent={
							<Icons.search strokeWidth={1} className="text-default-600" />
						}
						className="max-w-[180px] md:max-w-[250px]"
						classNames={{
							inputWrapper: 'min-h-8 h-8 md:min-h-9 md:h-9',
							input: 'text-xs md:text-sm',
						}}
					/>
				</div>
			</div>
			<div className="kb-search-content-info match-height mt-8">
				{groupDataKeys.map(([key, valueArray]: any) => (
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
											<TableHead style={{ width: '50px' }}>STT</TableHead>
											<TableHead style={{ width: '150px' }}>
												Link tài liệu
											</TableHead>
											<TableHead>Tên tài liệu</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{valueArray?.length > 0 &&
											valueArray.map((item: any, idx: number) => (
												<TableRow key={idx}>
													<TableCell className="text-center">
														{idx + 1}
													</TableCell>
													<TableCell className="d-flex gap-1">
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
																	className="text-warning fill-warning min-w-4"
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
						<Spinner size="md" />
					</div>
				)}
			</div>
		</>
	);
};
