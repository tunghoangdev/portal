import {
	Button,
	Card,
	CardBody,
	Input,
	Listbox,
	ListboxItem,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	LogoText,
} from '~/components/ui';

import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuthStore } from '~/stores';
import { Form } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getCodeKey, roleFromCode } from '~/utils/util';
import { useClientIp } from '~/hooks';
import { useSwal } from '~/hooks';
import { ERROR_CODES, ROLES } from '~/constant';
import axiosClient from '~/lib/api';
import Forgetpassword from './forget-password';
export default function LoginForm() {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const { confirm } = useSwal();
	const { ip } = useClientIp();
	const [account, setAccount] = useState<any>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
	const selectedValue = useMemo(
		() => Array.from(selectedKeys).join(', '),
		[selectedKeys],
	);
	const navigate = useNavigate();
	const { loginAction } = useAuthStore();
	const handlerSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		const data: any = Object.fromEntries(new FormData(e.currentTarget));
		const currentRole: string = roleFromCode(data.code);
		const url =
			currentRole === ROLES.STAFF
				? API_ENDPOINTS.auth.businessCheckCode
				: API_ENDPOINTS.auth.businessCheckPhone;
		setAccount((prev: any) => ({
			...prev,
			currentRole,
			phone: data.code,
			password: data.password,
		}));
		try {
			const payload =
				currentRole === ROLES.AGENT
					? {
							agent_phone: data.code,
							id_staff_action: 0,
							secret_key: null,
						}
					: {
							staff_code: data.code,
						};
			const response: any = await axiosClient.post(url, payload);
			const listCompany = typeof response === 'object' ? [response] : response;
			setAccount((prev: any) => ({
				...prev,
				currentRole,
				phone: data.code,
				password: data.password,
				companies: currentRole === ROLES.AGENT ? listCompany : null,
				currentCompany: currentRole === ROLES.STAFF ? response : null,
			}));
			if (currentRole === ROLES.AGENT) {
				if (listCompany?.length === 1) {
					const { code, password } = data || {};
					const payload: any = {
						agent_phone: code,
						ip,
						password: password,
						secret_key: listCompany?.[0]?.secret_key,
						code_key: listCompany?.[0]?.code_key,
					};
					await handleLogin(currentRole, payload);
					setIsLoading(false);
					return;
				}
				onOpen();
				setIsLoading(false);
			} else {
				const payloadLogin: any = {
					code: data?.code,
					ip,
					pass: data?.password,
					secret_key: response?.secret_key,
				};
				await handleLogin(currentRole, payloadLogin);
			}
		} catch (error) {
			// console.log("error-->", error);
			setIsLoading(false);
			toast.error('Có lỗi xảy ra');
		}
	};

	const handleConfirm = async () => {
		const currentCompany = account?.companies?.find(
			(item: any) => item.secret_key === selectedValue,
		);
		const res = await confirm({
			title: 'Đăng nhập',
			html: `Bạn có chắc chắn đăng nhập vào portal công ty <br/> <b>${
				currentCompany?.company_name || ''
			}</b> này chứ?`,
			confirmButtonText: 'Đồng ý',
			cancelButtonText: 'Hủy',
			icon: 'warning',
		});

		if (res.isConfirmed && currentCompany) {
			const payload: any = {
				agent_phone: account.phone,
				ip,
				password: account.password,
				secret_key: selectedValue,
			};
			await handleLogin(account?.currentRole, payload);
			onClose();
		} else {
			onClose();
			setSelectedKeys(new Set([]));
		}
	};
	const handleLogin = async (currentRole: string, payload: any) => {
		const url = API_ENDPOINTS.auth.login?.[currentRole || ROLES.AGENT];
		setIsLoading(true);
		try {
			const res: any = await axiosClient.post(url, payload);
			const token = res?.user_token;
			const currentCompany =
				account?.companies?.find(
					(item: any) => item.secret_key === selectedValue,
				) || account?.currentCompany;

			setIsLoading(false);
			if (token) {
				loginAction(
					{
						...res,
						role: currentRole,
						secret_key: payload.secret_key,
						code_key:
							payload?.code_key ||
							currentCompany?.code_key ||
							getCodeKey(res?.code),
						company_name: currentCompany?.company_name || res?.company_name,
						token,
						isStaff: ROLES.STAFF.includes(currentRole),
					},
					token,
				);
				navigate({ to: `/${currentRole}/dashboard` });
			}
		} catch (error) {
			console.log('error--->', error);

			// toast.error('Lỗi khi đăng nhập');
		}
	};

	return (
		<>
			<Card
				shadow="sm"
				classNames={{
					base: 'min-w-sm md:min-w-[768px] min-h-[500px] ',
					body: 'px-6 py-10 grid p-0 md:grid-cols-2',
				}}
			>
				<CardBody>
					<Form
						className="w-full flex flex-col gap-4 p-6 items-center justify-center"
						onSubmit={handlerSubmit}
					>
						<div className="flex flex-col items-center text-center mb-2">
							<h1 className="text-2xl font-bold">Chào mừng</h1>
							<p className="text-content2 text-balance text-sm">
								Đăng nhập tài khoản
								<LogoText className="text-sm" />
							</p>
						</div>
						<Input
							isRequired
							errorMessage="Vui lòng nhập mã đăng nhập"
							label="Mã đăng nhập"
							labelPlacement="outside"
							name="code"
							placeholder="Nhập mã đăng nhập"
							type="text"
							variant="bordered"
							radius="sm"
							classNames={{
								label: 'font-semibold',
								inputWrapper: 'border shadow-xs',
							}}
						/>

						<Input
							isRequired
							errorMessage="Vui lòng nhập mật khẩu"
							label="Mật khẩu"
							labelPlacement="outside"
							name="password"
							placeholder="Nhập mật khẩu"
							type="password"
							radius="sm"
							classNames={{
								label: 'font-semibold',
								inputWrapper: 'border shadow-xs',
							}}
							variant="bordered"
						/>
						<Button
							color="primary"
							type="submit"
							radius="sm"
							fullWidth
							className="mt-2"
							isDisabled={isLoading}
							isLoading={isLoading}
						>
							Đăng nhập
						</Button>
						<Forgetpassword />
					</Form>
					<div className="bg-secondary/50 relative hidden md:flex items-center justify-center">
						<img
							src="/images/logo.png"
							alt="Logo"
							className="w-22 h-22 md:w-60 md:h-60"
						/>
					</div>
				</CardBody>
			</Card>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				isDismissable={false}
				isKeyboardDismissDisabled={true}
				classNames={{
					closeButton: '*:text-xl',
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-secondary text-2xl">
								Chọn công ty
							</ModalHeader>
							<ModalBody>
								<Listbox
									aria-label="Công ty"
									onSelectionChange={setSelectedKeys}
									selectedKeys={selectedKeys}
									selectionMode="single"
									variant="flat"
								>
									{account?.companies?.map((company: any, index: number) => (
										<ListboxItem
											key={company.secret_key}
											showDivider={index < account.companies.length - 1}
										>
											{`${company.code_key} - ${company.company_name}`}
										</ListboxItem>
									))}
								</Listbox>
							</ModalBody>

							<ModalFooter>
								<Button color="danger" onPress={onClose} variant="bordered">
									Hủy
								</Button>
								<Button color="primary" onPress={handleConfirm}>
									Xác nhận
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
