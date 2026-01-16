"use client";
import { Grid, MyImage } from "@/components/ui";
import { ERROR_CODES, ROLES } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { useCrud } from "@/hooks/use-crud-v2";
import { useCommonStore } from "@/stores";
import { Alert } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import RegisterView from "./register-view";

export const RegisterPage = () => {
  const searchQueryParams = useSearchParams();
  const companyCode = searchQueryParams.get("code") || "";
  const parentPhone = searchQueryParams.get("staff") || "";
  const { setData } = useCommonStore();
  const router = useRouter();
  // CHECK PARENT
  const { getAll, create } = useCrud(
    [API_ENDPOINTS.agent.search.byParent, parentPhone, companyCode],
    {
      agent_phone: parentPhone,
      key_code: companyCode,
      endpoint: "",
    },
    {
      enabled: !!companyCode && !!parentPhone,
    }
  );
  const { data: searchParentQuery, isFetching }: any = getAll();

  // *** QUERY ***
  const { mutateAsync: onRegisterAgent, isPending } = create();
  //   const parentData = searchParentQuery?.content || null;
  const isParentOpen = searchParentQuery?.is_open;

  const renderContent = () => {
    if (searchParentQuery) {
      if (!isParentOpen) {
        return (
          <div className="flex h-screen justify-center items-center px-5">
            <Alert
              color="danger"
              description="Người tuyển dụng đã bị khóa!, vui lòng liên hệ với quản trị viên."
            />
          </div>
        );
      }
      return (
        <RegisterView
          parentData={searchParentQuery}
          onRegister={handleRegister}
          isLoading={isPending}
          companyCode={companyCode}
        />
      );
    }
    if (isFetching) {
      return (
        <div className="flex h-screen justify-center items-center px-5">
          <Alert color="primary" description="Đang tải dữ liệu..." />
        </div>
      );
    }
    return (
      <div className="flex h-screen justify-center items-center px-5">
        <Alert
          color="warning"
          description="Hệ thống không tìm thấy người tuyển dụng, vui lòng kiểm tra lại."
        />
      </div>
    );
  };

  useEffect(() => {
    if (searchParentQuery) {
      setData("currentSecretKey", searchParentQuery?.secret_key);
    }
  }, [searchParentQuery]);

  const handleRegister = async (data: any) => {
    await onRegisterAgent(
      {
        ...data,
        code: companyCode,
        _customUrl: `${ROLES.AGENT}${API_ENDPOINTS.auth.register.agent}`,
        _hideMessage: true,
      },
      {
        onSuccess(data) {
          if (data?.error_code) {
            toast.error(
              (ERROR_CODES?.[data?.error_code] as string) || "Có lỗi xảy ra"
            );
            return;
          }
          toast.success("Đăng ký tài khoản thành công");
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 p-2.5 md:p-10 overflow-hidden relative">
      <MyImage
        src={`/images/bg.jpg`}
        alt="bg"
        className="absolute top-0 left-0 w-full h-full"
      />

      <Grid container className="m-0 min-h-screen w-full z-10">
        <Grid
          item
          xs={12}
          lg={7}
          className="hidden lg:flex h-screen items-center p-0"
        >
          <div className="w-full h-full bg-cover bg-center" />
        </Grid>
        {/* <Grid
        item
        xs={12}
        lg={7}
        className="hidden lg:flex h-screen items-center p-0"
      >
        <div className="d-lg-flex align-items-center justify-content-center">
          <img
            className="max-w-full h-auto"
            src={"/images/BH.png"}
            alt="Login Cover"
          />
        </div>
      </Grid> */}
        <Grid xs={12} lg={5} item className="p-0 md:p-8">
          <div className="p-5 md:p-8 m-[20px] md:m-0 md:h-full items-center bg-white shadow-md rounded-md md:rounded-2xl">
            {renderContent()}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
