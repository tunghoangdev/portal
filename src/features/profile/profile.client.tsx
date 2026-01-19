
import { ChevronRight } from 'lucide-react';
import { Alert } from '@heroui/react';
import { Button, Skeleton, Stack } from '@/components/ui';
import { useAuth } from '@/hooks';
import { ROLES } from '@/constant';
import { Icons } from '@/components/icons';
import { FormView } from './form-view';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, initialFormValues } from './form.schema';
import { useEffect } from 'react';
import { useCrud } from '@/hooks/use-crud-v2';
import { API_ENDPOINTS } from '@/constant/api-endpoints';
import { ParentSquareCard } from '@/features/shared/components';
import { getFullFtpUrl } from '~/lib/auth';
import { useNavigate } from '@tanstack/react-router';

const ProfileClientPage = () => {
	const {
		control,
		watch,
		reset,
		handleSubmit,
		setValue,
		setError,
		getValues,
		formState,
	}: any = useForm({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
		defaultValues: initialFormValues,
	});
	const { isSubmitting } = formState;
	const { user, role } = useAuth();
	const basePath = API_ENDPOINTS[role].profile;
	const { getAll, updateConfirm } = useCrud(
		[basePath.get],
		{
			id: user?.id,
			endpoint: '',
		},
		{
			enabled: !!user?.id,
			staleTime: 1,
		},
	);
	const { data, isFetching, refetch }: any = getAll();
	const navigate = useNavigate();
	// *** VARIABLES ***
	const isApproved = data?.id_agent_status > 1;
	const isHasIdNumber = !!data?.id_number;
	const parentData = {
		avatar: getFullFtpUrl('avatar', data?.parent_avatar),
		name: data?.parent_name,
		phone: data?.parent_phone,
		level_code: data?.parent_level_code,
		id_level: data?.id_parent_level,
	};

	// *** FUNCTIONS ***
	const onSubmit = async (data: any) => {
		await updateConfirm(data, {
			title: 'Cập nhật thông tin',
			message: 'Bạn có chắc muốn cập nhật thông tin?',
			_customUrl: basePath.update,
			_customMessage: 'Cập nhật thông tin thành công',
			onSuccess: (res:any) => {
				if(res?.error_code) return
				refetch();
				// user updated cccd
				if (data?.id_number && user?.is_update_cccd && role === ROLES.AGENT) {
					navigate({to: `/${role}/dashboard`});
				}
			},
		});
	};

	const scrollToCIDSection = () => {
		document.getElementById('id_number')?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};
	useEffect(() => {
	if (data) {
			reset({ ...data, id_commune: data?.id_commune?.toString(),issued_place: data?.issued_place?.toString() || 'Bộ Công An',link_portrait: data?.link_portrait || '' });
		}
	}, [data]);

	// *** RENDER ***
	if (isFetching) return <Skeleton />;
	return (
		<div className="px-2.5 lg:px-4 py-8 space-y-8">
			<div className="max-w-4xl mx-auto">
				{/* Status Banner */}
				<Alert
					color={isApproved ? 'success' : 'warning'}
					title={isApproved ? 'Hồ sơ đã được duyệt' : 'Hồ sơ chưa được duyệt'}
					variant="bordered"
					classNames={{
						base: 'shadow-md mb-5',
						title: `text-lg font-semibold ${
							isApproved ? 'text-success-700' : 'text-orange-700'
						}`,
						description: 'text-xs',
					}}
					description={
						!isApproved && (
							<p className="mt-1.5 text-orange-600/90 text-xs max-w-prose mx-auto">
								Vui lòng kiểm tra lại thông tin và hoàn tất hồ sơ của bạn
							</p>
						)
					}
				/>
				{!isHasIdNumber && (
					<Alert
						color={'danger'}
						title={'Thiếu thông tin căn cước công dân'}
						variant="faded"
						classNames={{
							title: 'text-md font-semibold',
							description: 'text-xs',
						}}
						description={
							<>
								<p>
									Bạn cần cập nhật số căn cước công dân để hoàn tất hồ sơ đăng
									ký thành viên.
								</p>
								<Button
									onPress={scrollToCIDSection}
									variant="bordered"
									color="danger"
									size="sm"
									className="min-h-0 h-auto py-1.5 mt-1.5 font-semibold"
									// 			className="mt-3 inline-flex items-center gap-1.5 text-red-700 hover:text-red-900
									//  font-medium transition-colors"
								>
									Cập nhật ngay
									<ChevronRight className="w-4 h-4" />
								</Button>
							</>
						}
					/>
				)}
			</div>

			{/* Profile Content */}
			<div className="space-y-8">
				{/* Parent Card Section */}
				<ParentSquareCard data={parentData} />
				{!isApproved ? (
					<h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
						<Icons.edit className="w-5 h-5 text-blue-600" />
						Cập nhật thông tin
					</h3>
				) : null}
				<form onSubmit={handleSubmit(onSubmit)} id="id_number">
					<FormView
						control={control}
						canEdit={!isApproved}
						formMethods={{
							setValue,
							reset,
							watch,
							getValues,
							formState,
							setError,
						}}
					/>
					{!isApproved && (
						<Stack justifyContent={'end'} className="mt-5">
							<Button
								type="submit"
								isDisabled={isSubmitting}
								// isDisabled={isUpdating || isSubmitting}
								isLoading={isFetching}
								startContent={<Icons.save className="w-4 h-4" />}
								color="secondary"
							>
								Cập nhật thông tin
							</Button>
						</Stack>
					)}
				</form>
			</div>
		</div>
	);
};

export default ProfileClientPage;
