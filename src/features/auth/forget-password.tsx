import { useEffect, useState } from 'react';
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Select,
	SelectItem,
	Stack,
	Typography,
	useDisclosure,
} from '~/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OtpField, TextField } from '~/features/shared/components/form-fields';
import { validatePhoneOrCode } from '~/schema-validations';
import { useCrud } from '~/hooks/use-crud-v2';
import { API_ENDPOINTS } from '~/constant/api-endpoints';
import { ROLES } from '~/constant';
import { Captcha } from '~/features/shared/common';
import { cn } from '~/lib/utils';
import { roleFromCode } from '~/utils/util';
import { useCommonStore } from '~/stores';
const defaultValues = {
	code: '',
	otp: '',
	newPassword: '',
	confirmPassword: '',
};
export default function Forgetpassword() {
	const { setData } = useCommonStore();
	const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
	const [currentData, setCurrentData] = useState<any>();
	const [companies, setCompanies] = useState<any>();
	const [currentUrl, setCurrentUrl] = useState<any>();
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const basePath = API_ENDPOINTS.auth;
	const { getAll, create } = useCrud(
		[currentUrl || basePath.login.agent, currentData?.code],
		{
			endpoint: '',
			...currentData?.payload,
		},
		{
			enabled: !!currentUrl && !!currentData?.payload,
		},
	);

	// const [isVerifyCaptCha, setIsVerifyCaptCha] = useState(false);
	// const [isVerifyPhone, setIsVerifyPhone] = useState(false);
	// const [isFirstSendOtp, setIsFirstSendOtp] = useState(false);

	const [verifyCaptCha, setVerifyCaptCha] = useState(false);

	const [otpCountDown, setOtpCountDown] = useState(0);
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(1);
	const formSchema = z
		.object({
			code: validatePhoneOrCode('Mã đăng nhập'),
			otp: z.string().optional(),
			newPassword: z.string().optional(),
			confirmPassword: z.string().optional(),
		})
		.superRefine(({ newPassword, confirmPassword, otp }, ctx) => {
			if (step === 2) {
				if (!otp || otp.trim() === '') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mã OTP là bắt buộc',
						path: ['otp'],
					});
				} else if (otp.length !== 4) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mã OTP phải có 4 ký tự',
						path: ['otp'],
					});
				}
			} else if (step === 3) {
				if (!newPassword || newPassword.trim() === '') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu mới là bắt buộc',
						path: ['newPassword'],
					});
				} else if (newPassword.length < 6) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu phải có ít nhất 6 ký tự',
						path: ['newPassword'],
					});
				} else if (newPassword.length > 32) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu không được vượt quá 32 ký tự',
						path: ['newPassword'],
					});
				}

				if (!confirmPassword || confirmPassword.trim() === '') {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Xác nhận mật khẩu là bắt buộc',
						path: ['confirmPassword'],
					});
				} else if (confirmPassword.length < 6) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu phải có ít nhất 6 ký tự',
						path: ['confirmPassword'],
					});
				} else if (confirmPassword.length > 32) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu không được vượt quá 32 ký tự',
						path: ['confirmPassword'],
					});
				}

				// Sau khi đảm bảo chúng tồn tại và đúng độ dài cơ bản, mới so sánh
				if (newPassword && confirmPassword && newPassword !== confirmPassword) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Mật khẩu không khớp',
						path: ['confirmPassword'],
					});
				}
			}
		});
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		getValues,
		setFocus,
		reset,
	}: any = useForm({
		mode: 'onChange',
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	// const currentData = useMemo(() => {
	// 	const role: string = roleFromCode(watchPhone);
	// 	const url =
	// 		role === ROLES.STAFF
	// 			? API_ENDPOINTS.auth.businessCheckCode
	// 			: API_ENDPOINTS.auth.businessCheckPhone;
	// 	return {
	// 		role,
	// 		url,
	// 	};
	// 	// if (data && data.length > 0) {
	// 	//   return data.find((item: any) => item.agent_phone === watchPhone);
	// 	// }
	// }, [watchPhone]);
	// console.log("currentData", currentData);

	// const currentRole: string = roleFromCode(watchPhone);
	// const url =
	//   currentRole === ROLES.STAFF
	//     ? API_ENDPOINTS.auth.businessCheckCode
	//     : API_ENDPOINTS.auth.businessCheckPhone;
	// const [isVerifing, setIsVerifing] = useState(false);
	// const { mutateAsync: updateMutation } = update();
	const { data }: any = getAll();

	useEffect(() => {
		if (data) {
			setLoading(false);
			setVerifyCaptCha(true);
			if (Array.isArray(data)) {
				setCompanies(data);
			} else {
				setData('currentSecretkey', data?.secret_key);
				setSelectedKeys([data?.secret_key]);
				setCompanies([data]);
			}
		}
	}, [data]);

	useEffect(() => {
		let timeOut: any;
		if (otpCountDown > 0) {
			timeOut = setTimeout(() => setOtpCountDown((prev) => prev - 1), 1000);
		}
		return () => clearTimeout(timeOut);
	}, [otpCountDown]);
	// Function
	const { mutateAsync: sendOtp } = create();
	const onSubmitStep1 = (data: any) => {
		setLoading(true);
		const currentRole: string = roleFromCode(data.code);
		const payload =
			currentRole === ROLES.AGENT
				? {
						agent_phone: data.code,
						id_staff_action: 0,
					}
				: {
						staff_code: data.code,
					};

		const url =
			currentRole === ROLES.STAFF
				? API_ENDPOINTS.auth.businessCheckCode
				: API_ENDPOINTS.auth.businessCheckPhone;

		setCurrentData({
			payload,
		});
		setCurrentUrl(url);
	};

	const handleSendOTP = async () => {
		setLoading(true);
		const code = getValues()?.code;
		const currentRole: string = roleFromCode(code);
		const payload: any =
			currentRole === ROLES.AGENT
				? {
						agent_phone: code,
					}
				: {
						staff_code: code,
					};
		const res = await sendOtp({
			...payload,
			secret_key: Array.from(selectedKeys)?.[0] || '',
			_customUrl: `/${currentRole}${basePath.register.genOtp}`,
			_customMessage: 'Gửi OTP thành công',
		});
		setLoading(false);
		if (res.status === 1) {
			setVerifyCaptCha(false);
			setOtpCountDown(120);
			setStep(2);
			setFocus('otp');
			return;
		}
	};

	const onSubmitStep2 = async (data: any) => {
		setLoading(true);
		const code = data?.code;
		const otp = data?.otp;
		const currentRole: string = roleFromCode(code);
		const payload: any =
			currentRole === ROLES.AGENT
				? {
						agent_phone: code,
					}
				: {
						staff_code: code,
					};
		const res = await sendOtp({
			...payload,
			otp,
			secret_key: Array.from(selectedKeys)?.[0] || '',
			_customUrl: `/${currentRole}/${basePath.register.verifyOtp}`,
			_customMessage: 'Xác minh OTP thành công',
		});
		setLoading(false);
		if (res.status === 1) {
			setStep(3);
		}
	};

	const onSubmitStep3 = async (data: any) => {
		setLoading(true);
		const { code, newPassword } = data;
		const currentRole: string = roleFromCode(data.code);
		const payload: any =
			currentRole === ROLES.AGENT
				? {
						agent_phone: code,
					}
				: {
						staff_code: code,
					};
		const res = await sendOtp({
			...payload,
			new_pass: newPassword,
			secret_key: Array.from(selectedKeys)?.[0] || '',
			_customUrl: basePath.updatePassword?.[currentRole],
			_customMessage: 'Đặt lại mật khẩu thành công',
		});
		setLoading(false);
		if (res.status === 1) {
			onClose();
			setStep(1);
			reset(defaultValues);
			setCompanies([]);
			setSelectedKeys(new Set([]));
			setCurrentData(null);
			setCurrentUrl(null);
		}
	};

	const handleClose = () => {
		setStep(1);
		setLoading(false);
		setVerifyCaptCha(false);
		setCurrentUrl(null);
		setCurrentData(null);
		setCompanies([]);
		setSelectedKeys(new Set([]));
		reset(defaultValues);
		onClose();
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && !isSubmitting) {
			e.preventDefault();
			if (step === 1) {
				if (!verifyCaptCha) {
					handleSubmit(onSubmitStep1)();
					return;
				}
				handleSendOTP();
				return;
			}
			if (step === 2) {
				handleSubmit(onSubmitStep2)();
				return;
			}
			if (step === 3) {
				handleSubmit(onSubmitStep3)();
				return;
			}
		}
	};
	return (
		<>
			<Button
				className="text-blue-500 min-w-0 w-auto min-h-0 h-auto p-0 self-start text-xs hover:!bg-transparent"
				onPress={onOpen}
				type="button"
				variant="light"
			>
				Quên mật khẩu?
			</Button>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				onClose={handleClose}
				className="p-4"
			>
				<ModalContent tabIndex={-1} onKeyDown={handleKeyDown}>
					<ModalHeader>Đặt lại mật khẩu</ModalHeader>
					<ModalBody>
						<form>
							{step === 1 ? (
								!verifyCaptCha ? (
									<>
										<Typography
											variant={'paragraph'}
											className="text-default-700 text-xs mb-2.5  "
										>
											Vui lòng nhập số điện đã đăng ký tài khoản để lấy mã OTP
										</Typography>
										<Stack alignItems={'end'} className="gap-x-2.5">
											<TextField
												control={control}
												name="code"
												label="Mã đăng nhập"
												placeholder="Nhập mã đăng nhập..."
												errorMessage={errors.code?.message}
											/>
											<Button
												type="button"
												onPress={handleSubmit(onSubmitStep1)}
												isDisabled={!isValid || loading}
												color="secondary"
												isLoading={loading}
												className={cn('h-9', {
													'mb-[25px]': !!errors?.code?.message,
												})}
												size="sm"
											>
												Gửi OTP
											</Button>
										</Stack>
									</>
								) : (
									<>
										{selectedKeys.size || companies?.length === 1 ? (
											<div className="flex flex-col items-center justify-center gap-8">
												<Captcha onNext={handleSendOTP} isLoading={false} />
											</div>
										) : (
											<div className="min-h-[120px]">
												<Typography
													variant={'paragraph'}
													className="text-default-700 text-xs mb-2.5  "
												>
													Vui lòng chọn công ty bạn muốn đặt lại mật khẩu
												</Typography>
												<Select
													label="Chọn công ty"
													placeholder="Chọn công ty"
													labelPlacement="outside"
													className="w-full"
													selectedKeys={selectedKeys}
													onSelectionChange={(keys) => {
														setData('currentSecretkey', keys.currentKey);
														setSelectedKeys(keys);
													}}
												>
													{companies.map((company: any) => (
														<SelectItem key={company.secret_key}>
															{company.company_name}
														</SelectItem>
													))}
												</Select>
											</div>
										)}
									</>
								)
							) : null}

							{step === 2 && (
								<div className="flex flex-col items-center justify-between">
									<p className="mb-2.5 text-xs text-default-800">
										Hệ thống đã gửi mã xác minh đến Zalo và Email của bạn. Nhập
										mã vào trường bên dưới. Mã xác minh có hiệu lực trong 2
										phút.
									</p>
									{!otpCountDown ? (
										<p className="mb-4 tex-sm">
											Bạn chưa nhận được mã? &nbsp;
											<Button
												//   color="link"
												className="p-0 min-w-0 w-auto min-h-0 h-auto text-blue-700 hover:!bg-transparent"
												variant="light"
												onPress={handleSendOTP}
											>
												Gửi lại mã OTP
											</Button>
										</p>
									) : (
										<p className="mb-2.5 font-bold text-xs">
											Mã OTP còn hiệu lực trong{' '}
											<span className="text-secondary font-bold">
												{otpCountDown}s
											</span>
										</p>
									)}
									<OtpField
										control={control}
										name="otp"
										length={4}
										label="Mã OTP"
										className="shadow-none"
									/>
									<Button
										type="button"
										onClick={handleSubmit(onSubmitStep2)}
										isLoading={loading}
										color="secondary"
										className="h-9 mt-2.5"
										size="sm"
									>
										Xác thực OTP
									</Button>
								</div>
							)}
							{step === 3 && (
								<Stack
									direction={'col'}
									className="gap-y-3.5"
									justifyContent={'start'}
									alignItems={'start'}
								>
									<TextField
										control={control}
										name="newPassword"
										label="Mật khẩu mới"
										type="password"
										placeholder="Nhập mật khẩu mới"
									/>
									<TextField
										control={control}
										name="confirmPassword"
										label="Xác nhận mật khẩu"
										type="password"
										placeholder="Xác nhận mật khẩu mới"
									/>

									<Button
										type="button"
										onClick={handleSubmit(onSubmitStep3)}
										isLoading={loading}
										color="secondary"
										className="h-9 mt-2.5 self-start"
										size="sm"
									>
										Đặt lại mật khẩu
									</Button>
								</Stack>
							)}
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
