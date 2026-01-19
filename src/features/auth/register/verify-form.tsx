
import {
  Button,
  InputOtp,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Typography,
} from "@/components/ui";
import { ERROR_CODES, ROLES } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { Captcha } from "@/features/shared/common";
import { FormField } from "@/features/shared/components/form-fields";
import { useCrud } from "@/hooks/use-crud-v2";
import { testValidPhone } from "@/utils/util";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  phone: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .refine((value) => testValidPhone(value), {
      message: "Số điện thoại không hợp lệ",
    }),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")), // Cho phép chuỗi rỗng nếu người dùng xóa sạch input
});

const defaultValues = {
  phone: "",
  email: "",
};

const PhoneForm = ({ onSubmit, isLoading }: any) => {
  // *** HOOK FORM ***
  const { control, handleSubmit }: any = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues,
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={"col"} className="gap-4" alignItems={"start"}>
        <FormField
          control={control}
          name="phone"
          label="Số điện thoại (zalo)"
          placeholder="Nhập số điện thoại..."
          isRequired
        />
        <FormField
          control={control}
          name="email"
          label="Email (Không bắt buộc)"
          placeholder="Nhập email..."
        />
        {/* <ControllerField
					control={control}
					errors={errors}
					name="phone"
					label="Số điện thoại (zalo)"
					isRequired
					componentProps={{
						placeholder: 'Nhập số điện thoại...',
					}}
				/> */}
        {/* <ControllerField
					control={control}
					errors={errors}
					name="email"
					label="Email"
					isRequired
					componentProps={{
						placeholder: 'Nhập email...',
					}}
				/> */}
        <Button color="primary" size="sm" type="submit" isDisabled={isLoading}>
          {isLoading ? "Đang kiểm tra..." : "Xác minh thông tin"}
        </Button>
      </Stack>
    </form>
  );
};

const VerifyForm = ({ setVerify }: any) => {
  // *** STATE ***
  const [openModalVerifyOtp, setOpenModalVerifyOtp] = useState(false);
  const toggleModalVerifyOtp = () => setOpenModalVerifyOtp(!openModalVerifyOtp);
  const [isVerifyCaptCha, setIsVerifyCaptCha] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  //   const [otpCode, setOtpCode] = useState(Array(4).fill(""));
  const [otpCountDown, setOtpCountDown] = useState(0);
  const [isFirstSendOtp, setIsFirstSendOtp] = useState(false);
  const [invalidCodeMessage, setInvalidCodeMessage] = useState("");
  const [data, setData] = useState({
    phone: "",
    email: "",
  });
  // const [checkingStatus, setCheckingStatus] = useState({
  // 	phone: false,
  // 	email: false,
  // });
  const { update } = useCrud([API_ENDPOINTS.auth.register.checkPhone], {
    endpoint: ROLES.AGENT,
  });
  const { mutateAsync: onCheckPhone, isPending: isCheckingPhone } = update();
  const { mutateAsync: onCheckEmail, isPending: isCheckingMail } = update();
  const { mutateAsync: onGenOtp, isPending: isGenering } = update();
  const { mutateAsync: onVerifyOtp, isPending: isVerifing } = update();
  // *** EFFECT ***
  // useEffect(() => {
  // 	console.log('checkingStatus', checkingStatus);
  // 	console.log('data.email', data.email);
  // 	console.log('case 1', checkingStatus.phone && !data.email);
  // 	console.log(
  // 		'case 2',
  // 		!!data.email && checkingStatus.email && checkingStatus.phone,
  // 	);

  // 	if (
  // 		(checkingStatus.phone && !data.email) ||
  // 		(!!data.email && checkingStatus.email && checkingStatus.phone)
  // 	) {
  // 		setOpenModalVerifyOtp(true);
  // 	}
  // }, [checkingStatus, data]);

  useEffect(() => {
    // const otp = otpCode.join("");
    if (otpCode.length === 4) {
      onVerifyOtp(
        {
          agent_phone: data.phone,
          otp: otpCode,
          _customUrl: API_ENDPOINTS.auth.register.verifyOtp,
          _hideMessage: true,
        },
        {
          onSuccess(res) {
            if (res?.error_code) {
              //   toast.error(
              //     (ERROR_CODES?.[res?.error_code] as string) || "Có lỗi xảy ra"
              //   );
              setInvalidCodeMessage("Mã OTP không chính xác");
              return;
            }
            setVerify(data);
            setOpenModalVerifyOtp(false);
            toast.success("Xác thực thành công");
          },
        }
      );
    }
  }, [data, otpCode, setVerify]);

  useEffect(() => {
    let timeOut: any;
    if (otpCountDown > 0) {
      timeOut = setTimeout(() => setOtpCountDown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timeOut);
  }, [otpCountDown]);

  const onSubmit = async (values: any) => {
    const existPhone = await onCheckPhone({
      agent_phone: values.phone,
      _customUrl: API_ENDPOINTS.auth.register.checkPhone,
      _hideMessage: true,
    });
    if (!values?.email) {
      if (existPhone === true) {
        return toast.error(ERROR_CODES?.["12"] || "Có lỗi xảy ra");
      }
      setData(values);
      setOpenModalVerifyOtp(true);
      return;
    }

    if (existPhone === true && values?.email) {
      return toast.error(ERROR_CODES?.["12"] || "Có lỗi xảy ra");
    }

    const existEmail = await onCheckEmail({
      email: values.email,
      _customUrl: API_ENDPOINTS.auth.register.checkEmail,
      _hideMessage: true,
    });

    if (existEmail === true) {
      return toast.error((ERROR_CODES?.["9"] as string) || "Có lỗi xảy ra");
    }
    setData(values);
    setOpenModalVerifyOtp(true);
    return;
  };

  const onVerifyCaptCha = async () => {
    await onGenOtp(
      {
        agent_phone: data.phone,
        // secret_key,
        _customUrl: API_ENDPOINTS.auth.register.genOtp,
        _hideMessage: true,
      },
      {
        onSuccess(data: any) {
          if (data?.error_code) {
            toast.error(
              (ERROR_CODES?.[data?.error_code] as string) || "Có lỗi xảy ra"
            );
            return;
          }
          setIsVerifyCaptCha(true);
          setOtpCountDown(120);
          setIsFirstSendOtp(true);
        },
      }
    );
  };

  const handleResendOTP = async () => {
    await onGenOtp({
      agent_phone: data.phone,
      // secret_key,
      _customUrl: API_ENDPOINTS.auth.register.genOtp,
      _hideMessage: true,
    });
    // onGenOtp({
    // 	agent_phone: data.phone,
    // });
  };

  return (
    <>
      <div className="w-full md:max-w-md mx-auto mt-8">
        <PhoneForm
          onSubmit={onSubmit}
          isLoading={isCheckingPhone || isCheckingMail}
        />
      </div>

      {/* <ModalComponent
        title="Xác thực OTP"
        open={openModalVerifyOtp}
        onClose={() => setOpenModalVerifyOtp(false)}
        toggle={toggleModalVerifyOtp}
        size="md"
        Body={
          <div className="flex flex-col items-center justify-center gap-8">
            {!isVerifyCaptCha && (
              <Captcha onNext={onVerifyCaptCha} isLoading={isGenering} />
            )}

            {isFirstSendOtp && (
              <>
                <p className="mb-2.5 text-sm text-default-800">
                  Hệ thống đã gửi mã xác minh đến Zalo và Email của bạn. Nhập mã
                  vào trường bên dưới. Mã xác minh có hiệu lực trong 2 phút.
                </p>
                {!otpCountDown ? (
                  <p className="mb-4">
                    Bạn chưa nhận được mã? &nbsp;
                    <Button
                      // color="link"
                      className="p-0"
                      onClick={handleResendOTP}
                    >
                      Gửi lại mã OTP
                    </Button>
                  </p>
                ) : (
                  <p className="mb-5 font-bold">
                    Mã OTP còn hiệu lực trong {otpCountDown}s
                  </p>
                )}

                <OtpCodeInput
                  value={otpCode}
                  setValue={setOtpCode}
                  isLoading={isVerifing}
                  title="Nhập mã OTP"
                  invalidMessage={invalidCodeMessage}
                />
              </>
            )}
          </div>
        }
        Footer={<CancelButton text="Quay lại" onClick={toggleModalVerifyOtp} />}
      /> */}
      <Modal
        isOpen={openModalVerifyOtp}
        onClose={toggleModalVerifyOtp}
        size="md"
      >
        <ModalContent>
          <ModalBody>
            {isFirstSendOtp ? (
              <ModalHeader>
                <Typography variant="h5" className="text-lg text-secondary">
                  Xác thực OTP
                </Typography>
              </ModalHeader>
            ) : null}
            {!isVerifyCaptCha && (
              <Captcha onNext={onVerifyCaptCha} isLoading={isGenering} />
            )}
            {isFirstSendOtp && (
              <Stack alignItems={"center"} direction={"col"}>
                <p className="mb-2.5 text-sm text-default-800">
                  Hệ thống đã gửi mã xác minh đến Zalo và Email của bạn. Nhập mã
                  vào trường bên dưới. Mã xác minh có hiệu lực trong 2 phút.
                </p>
                {!otpCountDown ? (
                  <p className="mb-4">
                    Bạn chưa nhận được mã? &nbsp;
                    <Button
                      // color="link"
                      className="p-0 text-blue-600"
                      variant="light"
                      onClick={handleResendOTP}
                    >
                      Gửi lại mã OTP
                    </Button>
                  </p>
                ) : (
                  <p className="mb-5 font-bold">
                    Mã OTP còn hiệu lực trong {otpCountDown}s
                  </p>
                )}

                <InputOtp
                  length={4}
                  value={otpCode}
                  onValueChange={setOtpCode}
                  isDisabled={isVerifing}
                  errorMessage={invalidCodeMessage}
                  size="lg"
                  classNames={{
                    segmentWrapper: "gap-x-2.5",
                    segment: [
                      "relative",
                      "h-14",
                      "w-14",
                      "border-default-200",
                      "data-[active=true]:border-secondary",
                      "data-[active=true]:z-20",
                      "data-[active=true]:ring-none",
                    ],
                  }}
                />
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" size="sm" onPress={toggleModalVerifyOtp}>
              Quay lại
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VerifyForm;
