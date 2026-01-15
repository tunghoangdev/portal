import { Icons } from '~/components/icons';
import { Button, Card, CardBody, Grid, Stack } from '~/components/ui';
import { Image,Switch } from '@heroui/react';
import { useAuth, useModal, usePermissionAction } from '~/hooks';
import { useState, useEffect, useRef } from 'react';
import { actionInfoColumns, getColumns } from '~/features/shared/common';
import { columns } from './columns';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useCrud } from '~/hooks/use-crud-v2';
import { getFullFtpUrl } from '~/lib/auth';
import { CRUD_ACTIONS } from '~/constant';

const logColumns = getColumns<any>([...actionInfoColumns, ...columns]);

export default function PageClient() {
	const { role } = useAuth();
	// *** STATE ***
	const [data, setData] = useState<any>(null);
	const basePath = API_ENDPOINTS[role].notifications.featured;
	const { getAll, updateConfirm, update } = useCrud([basePath.get], {
		endpoint: role,
	});
	const { uploadFile } = useCrud([API_ENDPOINTS.upload.imageNotify], {
		endpoint: '',
	});

	const { openDetailModal } = useModal();
	// *** Ref ***
	const inputFileRef = useRef<any>(null);

	// *** QUERY ***
	const { data: dataQuery }: any = getAll();
	const { mutateAsync: onUpdate, isPending } = update();

	// *** EFFECT ***
	useEffect(() => {
		if (dataQuery) {
			setData(dataQuery);
		}
	}, [dataQuery]);

	const fileName = data?.image_notice;
	const url = getFullFtpUrl('notify', fileName);

	const handleCurdAction = async (action: string, data?: any) => {
		if (action === CRUD_ACTIONS.ACTIVE) {
			await updateConfirm(
				{ ...data, is_start: !data.is_start },
				{
					title: 'Cập nhật trạng thái',
					message: `Bạn có chắc chắn muốn ${
						data?.is_start ? 'ngưng hiển thị' : 'hiển thị'
					} thông báo này?`,
					_customUrl: basePath.update,
				},
			);
			return;
		}
		if (action === CRUD_ACTIONS.UPLOAD_IMAGE) {
			inputFileRef?.current?.click();
			return;
		}
		if (action === CRUD_ACTIONS.LOG) {
			openDetailModal(data, {
				title: 'Lịch sử thông báo nổi bật',
				detailUrl: basePath.logList,
				tableColumns: logColumns,
				tableOptions: {
					enabled: true,
				},
			});
			return;
		}
	};
	const { runAction } = usePermissionAction({ onAction: handleCurdAction });
	const onChangeImage = async (e: any) => {
		const file = e.target.files[0];
		const res = await uploadFile(file);
		if (res) {
			const dataSubmit = {
				...data,
				image_notice: res,
				_customUrl: basePath.update,
			};
			await onUpdate(dataSubmit);
		}
	};

	return (
		<>
			<Grid container>
				<Grid item sm={6}>
					<Card
						shadow="sm"
						classNames={{
							body: 'p-0',
						}}
					>
						<Image
							alt="HeroUI hero Image"
							src={url}
							height={500}
							className="cursor-pointer h-[500px] max-w-full object-cover"
							radius="none"
							onClick={() => {
								window.open(url, '_blank');
							}}
						/>
						<CardBody>
							<Stack
								justifyContent={'between'}
								alignItems={'center'}
								className="bg-default-50 px-2.5 py-5"
							>
								<Switch
									isSelected={data?.is_start}
									isDisabled={isPending}
									onValueChange={() => runAction(CRUD_ACTIONS.ACTIVE, data)}
									color="secondary"
									size="sm"
								>
									{data?.is_start ? 'Đang hoạt động' : 'Không hoạt động'}
								</Switch>
								<Stack alignItems={'center'} className="gap-x-2.5">
									<Button
										// color="flat-primary"
										color="secondary"
										size="sm"
										onClick={() => runAction(CRUD_ACTIONS.UPLOAD_IMAGE)}
										disabled={isPending}
										variant="bordered"
										// className="text-warning-900"
									>
										{isPending ? (
											'Đang tải lên...'
										) : (
											<>
												<Icons.upload size={14} />
												<span className="align-middle ms-1">Tải ảnh mới</span>
											</>
										)}
									</Button>
									<Button
										color="default"
										variant="bordered"
										onClick={() => runAction(CRUD_ACTIONS.LOG, data)}
										size="sm"
										startContent={<Icons.history size={14} />}
										className="text-warning-800"
									>
										Xem lịch sử
									</Button>
								</Stack>
							</Stack>
						</CardBody>
					</Card>
				</Grid>
			</Grid>

			<input
				type="file"
				id="file"
				hidden
				ref={inputFileRef}
				onChange={onChangeImage}
			/>

			{/* Modal Log List */}
			{/* <ViewLogList
        title={"Lịch sử thông báo nổi bật"}
        open={modals.log}
        toggle={() => toggleModal("log")(false)}
        data={data}
        columns={COLUMNS}
        url={QUERY.logList}
      /> */}
		</>
	);
}
