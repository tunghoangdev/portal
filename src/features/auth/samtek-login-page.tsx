import { Button, Input, Grid, Stack, MyImage } from '~/components/ui';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { useAuthStore } from '~/stores';
import { Form } from '@heroui/react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useClientIp } from '~/hooks';
import axiosClient from '~/lib/api';
import { InputPassword } from '~/features/shared/components/form-fields';
export default function SamteckLoginPage() {
	const { ip } = useClientIp();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const { loginAction } = useAuthStore();
	const handlerSubmit = async (e: any) => {
		e.preventDefault();
		setIsLoading(true);
		const data: any = Object.fromEntries(new FormData(e.currentTarget));
		try {
			const payloadLogin: any = {
				code: data?.code,
				ip,
				pass: data?.password,
			};
			const res: any = await axiosClient.post(
				API_ENDPOINTS.auth.login.root,
				payloadLogin,
			);
			const token = res?.user_token;
			setIsLoading(false);
			if (token) {
				loginAction(
					{
						...res,
						role: 'samtek',
						token,
						// secret_key: payload.secret_key,
						// code_key:
						// 	payload?.code_key ||
						// 	currentCompany?.code_key ||
						// 	getCodeKey(res?.code),
						// company_name: currentCompany?.company_name || res?.company_name,
						// token,
						// isStaff: ROLES.STAFF.includes(currentRole),
					},
					token,
				);
				navigate({ to: '/samtek/customers' });
			}
			// const payload =
			// 	currentRole === ROLES.AGENT
			// 		? {
			// 				agent_phone: data.code,
			// 				id_staff_action: 0,
			// 				secret_key: null,
			// 			}
			// 		: {
			// 				staff_code: data.code,
			// 			};
			// const response: any = await axiosClient.post(url, payload);
			// const listCompany = Array.isArray(response) ? response : [response];
			// setAccount((prev: any) => ({
			// 	...prev,
			// 	currentRole,
			// 	phone: data.code,
			// 	password: data.password,
			// 	companies: currentRole === ROLES.AGENT ? listCompany : null,
			// 	currentCompany: currentRole === ROLES.STAFF ? response : null,
			// }));
			// if (currentRole === ROLES.AGENT) {
			// 	if (listCompany?.length === 1) {
			// 		const { code, password } = data || {};
			// 		const payload: any = {
			// 			agent_phone: code,
			// 			ip,
			// 			password: password,
			// 			secret_key: listCompany?.[0]?.secret_key,
			// 			code_key: listCompany?.[0]?.code_key,
			// 		};
			// 		await handleLogin(currentRole, payload);
			// 		setIsLoading(false);
			// 		return;
			// 	}
			// 	onOpen();
			// 	setIsLoading(false);
			// } else {
			// 	const payloadLogin: any = {
			// 		code: data?.code,
			// 		ip,
			// 		pass: data?.password,
			// 		secret_key: response?.secret_key,
			// 	};
			// 	await handleLogin(currentRole, payloadLogin);
			// }
		} catch (error) {
			// console.log("error-->", error);
			setIsLoading(false);
			toast.error('Có lỗi xảy ra');
		}
	};

	return (
	<div className="flex h-svh flex-col items-center justify-center gap-6 p-2.5 md:p-10 overflow-hidden relative">
		<MyImage src={`/images/bg1.png`} alt="bg" className="absolute top-0 left-0 w-full h-full" />
		<Grid container spacing={4} className="w-full h-full relative z-index-1">
			<Grid item xs={12} sm={8} className="hidden sm:flex">
					<div className="w-full h-full bg-cover bg-center" />
			</Grid>
			<Grid item xs={12} sm={4} className="rounded-lg bg-white">
				<Form
					className="md:w-full flex flex-col gap-4 mx-2.5 sm:mx-0 p-6 items-center md:px-10 justify-center bg-white h-full rounded-lg"
					onSubmit={handlerSubmit}
				>
					<div className="flex flex-col items-center text-center mb-2">
						<MyImage 
									src="/images/logo.png" 
									alt="Logo Full" 
									className="h-12 w-auto transition-all duration-300"
									width={120} 
									height={48} 
								/>
						<h1 className="text-2xl font-bold mt-5">Chào mừng</h1>
						<p className="text-content2 text-balance text-sm flex flex-col items-center gap-x-1">
							Đăng nhập hệ thống
							{/* <LogoText className="text-sm" /> */}
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

					<InputPassword
						isRequired
						errorMessage="Vui lòng nhập mật khẩu"
						label="Mật khẩu"
						labelPlacement="outside"
						name="password"
						placeholder="Nhập mật khẩu"
						radius="sm"
						classNames={{
							label: 'font-semibold',
							inputWrapper: 'border shadow-xs',
						}}
						variant="bordered"
					/>
					<Stack
						className="w-full gap-y-2.5"
						alignItems={'center'}
						direction={'col'}
					>
						<Button
							color="secondary"
							type="submit"
							radius="sm"
							fullWidth
							className="mt-2"
							isDisabled={isLoading}
							isLoading={isLoading}
						>
							Đăng nhập
						</Button>
					</Stack>
				</Form>
			</Grid>
		</Grid>
	</div>
	);
}
