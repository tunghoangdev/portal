import { Badge, User } from '@heroui/react';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	useDisclosure,
} from '~/components/ui';
import { Icons } from '~/components/icons';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth, useModal } from '~/hooks';
import { cn } from '~/lib/utils';
import { ROLES } from '~/constant';
import { useAuthStore } from '~/stores';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { getFullFtpUrl } from '~/lib/auth';
import { useCrud } from '~/hooks/use-crud-v2';
import { useEffect } from 'react';
import { LevelCell, StatusAgentCell } from '~/features/shared/components/cells';
import ChangePasswordView from './change-password-view';
import { changePasswordSchema } from './change-password.schema';
import {ResetDataForm} from './reset-data-form';
export default function UserDropdown() {
	const { user, logoutAction, role, avatar: avatarImg } = useAuth();
	const navigate = useNavigate();
	const { openFormModal, openDetailModal } = useModal();
	const { setAvatar } = useAuthStore();
	const { onClose } = useDisclosure();
	const location = useLocation();
	const pathname = location.pathname;
	const name = user?.agent_name || user?.staff_name || user?.finan_name || '';
	const avatar = getFullFtpUrl('avatar', avatarImg);
	const phone = user?.agent_phone || '';
	const code = user?.code;
	const status = user?.agent_status_name || '';
	const basePath =  role === ROLES.SAMTEK ? API_ENDPOINTS?.upload?.avatar.replace('/system/', '/') : API_ENDPOINTS?.upload?.avatar || '';
	const url = API_ENDPOINTS?.[role]?.profile || '';
	const { uploadFile, update, updateConfirm } = useCrud([basePath], {
		endpoint: role === ROLES.SAMTEK ? 'root': '',
	});
	const { mutateAsync } = update();
	// *** VARIABLES ***
	const canRunCommission =
		user?.isStaff && user?.permission_name?.toLowerCase() === ROLES.ADMIN;

	// *** HOOKS ***
	useEffect(() => {
		if (user) {
			if (user?.is_update_cccd && !user?.isStaff) {
				navigate({ to: '/agent/profile' });
			}
		}
	}, [user, pathname]);
	// *** FUNCTIONS ***
	const onChangeAvatar = async (e: any) => {
		const file = e.target.files[0];
		const key = role !== ROLES.AGENT ? 'staff_avatar' : 'agent_avatar';
		const linkAvt: any = await uploadFile(file);
		const url = API_ENDPOINTS?.[role]?.profile?.changeAvatar || '';
		if (!url) {
			return toast.error('Tải ảnh thất bại');
		}
		const payload = {
			[key]: linkAvt,
			id: user?.id,
			_customUrl: url,
			_hideMessage: true,
		};
		await mutateAsync(payload);
		toast.success('Đổi ảnh đại diện thành công');
		setAvatar(linkAvt);
	};

	const handleChangeAvatar = () => {
		const input = document.createElement('input');
		input.id = 'avatar';
		input.hidden = true;
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = onChangeAvatar;
		input.click();
	};

	const handleRunCommission = async () => {
		await updateConfirm(
			{},
			{
				title: 'Xác nhận chạy tính thưởng',
				message: 'Bạn có chắc chắn muốn chạy tính thưởng?',
				_customUrl: API_ENDPOINTS?.staff?.system?.commission,
				_customMessage: 'Chạy tính thưởng thành công',
				onSuccess: (data) => {
					if (!data.error_code) {
						onClose();
					}
				},
			},
		);
	};

	const handleChangePassword = () => {
		openFormModal('edit', {
			title: 'Đổi mật khẩu',
			renderFormContent: ChangePasswordView,
			itemSchema: changePasswordSchema,
			size: 'md',
			onItemSubmit: async (values: any) => {
				await updateConfirm(
					{
						id: user?.id,
						old_password: values.old_password,
						new_password: values.new_password,
					},
					{
						title: 'Xác nhận đổi mật khẩu',
						message: 'Bạn có chắc chắn muốn đổi mật khẩu?',
						_customUrl: url?.changePassword,
						_customMessage: 'Đổi mật khẩu thành công',
						onSuccess: (data) => {
							if (!data.error_code) {
								onClose();
								logoutAction({ navigate });
							}
						},
					},
				);
			},
		});
	};
	const handleShowImage = () => {
		openDetailModal('', {
			title: 'Ảnh chân dung',
			renderContent: () => (
				<img
					src={getFullFtpUrl('avatar', user?.link_portrait)}
					width={500}
					height={300}
					className="max-w-full h-auto"
					alt=""
				/>
			),
			size: '3xl',
			modalProps: {
				scrollBehavior: 'inside',
			},
		});
	};

	const handleResetData = async () => {
		openDetailModal('', {
			title: 'Reset toàn bộ dữ liệu',
			renderContent: () => <ResetDataForm />,
			size: 'md',
			modalProps: {
				scrollBehavior: 'inside',
			},
		});
	};

	// useEffect(() => {
	// 	if (confirmResetData) {
	// 		openDetailModal('', {
	// 		title: 'Xác nhận reset toàn bộ dữ liệu',
	// 		renderContent: () => <VerifyForm />,
	// 		modalProps: {
	// 			scrollBehavior: 'inside',
	// 		},
	// 	});
	// 	}
	// }, [confirmResetData]);
	
	return (
			<Dropdown placement="bottom-end">
				<Badge
					color={user?.id_agent_status === 1 ? 'secondary' : 'success'}
					content=""
					placement="bottom-right"
					shape="circle"
					size="sm"
					className="right-1"
				>
					<DropdownTrigger>
						<User
							name={`${name} ${phone}`}
							description={
								(code || (
									<div className="flex items-center gap-2">
										<StatusAgentCell
											id={user?.id_agent_status || 0}
											name={status}
										/>
										<LevelCell
											data={user}
											levelIdKey={'id_agent_level'}
											levelCodeKey={'agent_level_code'}
										/>
									</div>
								)) as any
							}
							classNames={{
								base: 'flex-row-reverse hover:cursor-pointer',
								name: 'text-[10px] md:text-xs font-semibold',
								description: 'flex w-full justify-end gap-x-2 mt-1',
							}}
							avatarProps={{
								src: avatarImg ? avatar : '/images/logo-icon.png',
								className: cn(
									'transition-transform size-6 md:size-8',
									user?.id_agent_status === 1 &&
										'animate-pulse border-2 border-secondary',
								),
							}}
						/>
					</DropdownTrigger>
				</Badge>
				<DropdownMenu
					aria-label="Profile Actions"
					variant="flat"
					className="*:text-sm"
				>
					<DropdownItem key="profile" className="h-14 gap-2">
						<p className="font-medium text-foreground">Đang đăng nhập</p>
						<p className="font-semibold">{name}</p>
					</DropdownItem>
					{user?.isStaff && user?.is_root ? (
						<DropdownItem
							key={'run-reset-data'}
							className="text-xs hover:*:text-secondary"
							color="secondary"
							onClick={handleResetData}
							startContent={
								<Icons.refresh
									size={16}
									className="text-default-800 hover:text-secondary"
								/>
							}
						>
							Reset dữ liệu
						</DropdownItem>
					) : null}	
					{canRunCommission ? (
						<DropdownItem
							key={'run-commission'}
							className="text-xs hover:*:text-secondary"
							color="secondary"
							onClick={handleRunCommission}
							startContent={
								<Icons.dollarSign
									size={16}
									className="text-default-800 hover:text-secondary"
								/>
							}
						>
							Chạy tính thưởng
						</DropdownItem>
					) : null}
					{role === ROLES.AGENT ? (
						<DropdownItem
							key="image-portrait"
							startContent={
								<Icons.image size={16} className="text-default-800" />
							}
							onClick={handleShowImage}
						>
							Ảnh chân dung
						</DropdownItem>
					) : null}

					<DropdownItem
						key="change-avatar"
						startContent={
							<Icons.image size={16} className="text-default-800" />
						}
						onClick={handleChangeAvatar}
					>
						Đổi hình đại diện
					</DropdownItem>
					<DropdownItem
						key="change-password"
						showDivider
						startContent={<Icons.lock size={16} className="text-default-800" />}
						// onPress={onOpen}
						onPress={handleChangePassword}
					>
						Đổi mật khẩu
					</DropdownItem>
					<DropdownItem
						key="logout"
						color="danger"
						onPress={() => logoutAction({ navigate })}
						startContent={
							<Icons.power size={16} className="text-default-800" />
						}
					>
						Đăng xuất
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
	);
}
