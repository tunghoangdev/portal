import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Alert } from "@heroui/react";
import {
  Button,
  InputOtp,
  Stack,
  Typography,
} from "~/components/ui";
import { useCrud } from "~/hooks/use-crud-v2";
import { useAuth } from "~/hooks";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { ERROR_CODES } from "~/constant";
import { Icons } from "../icons";
interface OtpResponse {
  error_code?: string;
}

const OTP_COUNTDOWN_SECONDS = 120;
const OTP_LENGTH = 4;
import { useModal } from "~/hooks/use-modal";
export const ResetDataForm = () => {
  // *** STATE ***
  const [isConfirm, setIsConfirm] = useState(false);
  const { closeModal } = useModal();
  const [otpCode, setOtpCode] = useState("");
  const [otpCountDown, setOtpCountDown] = useState(0);
  const [isFirstSendOtp, setIsFirstSendOtp] = useState(false);
  const [invalidCodeMessage, setInvalidCodeMessage] = useState("");

  const { role, user } = useAuth();

  const { update } = useCrud([API_ENDPOINTS[role].system.genOtp], {
    endpoint: role,
  });
  const { mutateAsync: onGenOtp, isPending: isGenering } = update();
  const { mutateAsync: onVerifyOtp, isPending: isVerifing } = update();
  const { mutateAsync: onResetData, isPending: isResetting } = update();

  // *** EFFECTS ***
  // Verify OTP when user enters 4 digits
  useEffect(() => {
    if (otpCode.length !== OTP_LENGTH || !user?.id) return;

    const verifyAndReset = async () => {
      try {
        // Step 1: Verify OTP
        const verifyRes = await onVerifyOtp({
          id: user.id,
          staff_code: user.code,
          otp: otpCode,
          _customUrl: API_ENDPOINTS[role].system.verifyOtp,
          _hideMessage: true,
        });
        if (verifyRes?.error_code) {
          setInvalidCodeMessage("Mã OTP không chính xác");
          return;
        }
        // Step 2: Reset data
        const resetRes = await onResetData({
          id: user.id,
          staff_code: user.code,
          _customUrl: API_ENDPOINTS[role].system.resetData,
          _hideMessage: true,
        });
        closeModal();
        if (resetRes?.error_code) {
          toast.error(
            (ERROR_CODES?.[resetRes.error_code] as string) || "Có lỗi xảy ra"
          );
          return;
        }

        toast.success("Reset dữ liệu thành công");
        
        // Reset form state after successful reset
        setOtpCode("");
        setInvalidCodeMessage("");
        setIsConfirm(false);
        setIsFirstSendOtp(false);
      } catch (error) {
         closeModal();
        toast.error("Có lỗi xảy ra trong quá trình xử lý");
        setInvalidCodeMessage("Có lỗi xảy ra, vui lòng thử lại");
      }
    };

    verifyAndReset();
  }, [otpCode, onVerifyOtp, onResetData, role, user]);

  // OTP countdown timer
  useEffect(() => {
    if (otpCountDown <= 0) return;

    const timeOut = setTimeout(() => {
      setOtpCountDown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [otpCountDown]);

  // *** HANDLERS ***
  const handleConfirm = useCallback(async () => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }
    const res = await onGenOtp(
      {
        id: user.id,
        staff_code: user.code,
        _customUrl: API_ENDPOINTS[role].system.genOtp,
        _hideMessage: true,
        _closeModal: false,
      })
      if (res?.error_code) {
        toast.error(
          (ERROR_CODES?.[res.error_code] as string) || "Có lỗi xảy ra"
        );
        return;
      }
      setIsConfirm(true);
      setOtpCountDown(OTP_COUNTDOWN_SECONDS);
      setIsFirstSendOtp(true);
      setOtpCode("");
      setInvalidCodeMessage("");

  }, [onGenOtp, role, user]);

  const handleResendOTP = useCallback(async () => {
    if (!user?.id) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    await onGenOtp(
      {
        id: user.id,
        _customUrl: API_ENDPOINTS[role].system.genOtp,
        _hideMessage: true,
      },
      {
        onSuccess(data: OtpResponse) {
          if (data?.error_code) {
            toast.error(
              (ERROR_CODES?.[data.error_code] as string) || "Có lỗi xảy ra"
            );
            return;
          }
          setOtpCountDown(OTP_COUNTDOWN_SECONDS);
          setOtpCode("");
          setInvalidCodeMessage("");
          toast.success("Đã gửi lại mã OTP");
        },
      }
    );
  }, [onGenOtp, role, user]);

  const handleOtpChange = useCallback((value: string) => {
    setOtpCode(value);
    setInvalidCodeMessage("");
  }, []);

  return (
    <div className="w-full md:max-w-md mx-auto pb-5">
      {!isConfirm && (
        <div className="flex flex-col items-start gap-4">
          <Alert
            variant="bordered"
            title="Cảnh báo"
            color="danger"
            description={
              (<div className="space-y-2 text-sm text-warning-800">
                <p>
                  Bạn đang thực hiện reset toàn bộ dữ liệu hệ thống của portal
                  này.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Tất cả dữ liệu hiện tại sẽ bị xóa vĩnh viễn</li>
                  <li>Dữ liệu sau khi reset không thể khôi phục</li>
                  <li>
                    Hệ thống sẽ trở về trạng thái ban đầu như lúc mới khởi tạo
                  </li>
                </ul>
                <p className="mt-3 font-semibold">
                  Nếu bạn chắc chắn muốn tiếp tục, vui lòng xác thực OTP để hệ
                  thống tự động reset toàn bộ dữ liệu.
                </p>
              </div>) as any
            }
          />
          <Button
            color="primary"
            size="sm"
            onPress={handleConfirm}
            isLoading={isGenering}
            
          >
            <Icons.check size={16} />
            Xác nhận reset toàn bộ dữ liệu
          </Button>
        </div>
      )}

      {isFirstSendOtp && (
        <Stack alignItems="center" direction="col">
          <Typography variant="h5" className="text-lg text-secondary">
            Xác thực OTP
          </Typography>
          <p className="mb-2.5 text-sm text-default-800">
            Hệ thống đã gửi mã xác minh đến Zalo và Email của bạn. Nhập mã vào
            trường bên dưới. Mã xác minh có hiệu lực trong 2 phút.
          </p>

          {!otpCountDown ? (
            <p className="mb-4">
              Bạn chưa nhận được mã? &nbsp;
              <Button
                className="p-0 text-blue-600"
                variant="light"
                onPress={handleResendOTP}
                isLoading={isGenering}
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
            length={OTP_LENGTH}
            value={otpCode}
            onValueChange={handleOtpChange}
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
    </div>
  );
};