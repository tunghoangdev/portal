"use client";
import { Divider } from "@/components/ui";
import { ParentSquareCard } from "@/features/shared/components";
import { useSwal } from "@/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { BRAND_LOGO_ICON } from "~/constant";
import AgentRegisterForm from "./register-form";
import VerifyForm from "./verify-form";
const AgentSquareCard = ({ data }: any) => {
  const { parent_avatar, parent_name, parent_phone, ftp_web } = data;
  const avatar = parent_avatar
    ? `${ftp_web}/avatar/${parent_avatar}`
    : //  + `${ftp_web}/avatar/${parent_avatar}`
      BRAND_LOGO_ICON;
  return (
    <ParentSquareCard
      data={{
        avatar,
        name: parent_name,
        phone: parent_phone,
        hiddenLevel: true,
      }}
    />
  );
};

const RegisterView = ({
  parentData,
  onRegister,
  isLoading,
  companyCode,
}: any) => {
  // *** STATE ***
  const [isVerifyOtp, setIsVerifyOtp] = useState(false);
  // const { data: dataStore } = useCommonStore();
  const [verifyData, setVerifyData] = useState({
    phone: "",
    email: "",
  });
  const { confirm } = useSwal();
  // *** SUBMIT ***
  const onSubmit = async (values: any) => {
    const dataSubmit = {
      ...values,
      id_parent: parentData.id,
    };
    const res = await confirm({
      title: "Xác nhận đăng ký",
      text: `Bạn có chắc chắn muốn đăng ký tài khoản với số điện thoại ${dataSubmit.agent_phone} và email ${dataSubmit.email}?`,
      confirmButtonText: "Đồng ý",
    });

    if (res.isConfirmed) {
      return onRegister(dataSubmit);
    }

    // console.log('dataSubmit', dataSubmit);

    // return ConfirmAlert({
    // 	title: 'Xác nhận đăng ký',
    // 	text: `Bạn có chắc chắn muốn đăng ký tài khoản với số điện thoại ${dataSubmit.agent_phone} và email ${dataSubmit.email}?`,
    // 	cb: () => onRegister(dataSubmit),
    // });
  };

  const handleSetVerifyData = (data: any) => {
    setVerifyData(data);
    setIsVerifyOtp(true);
  };

  // *** RENDER ***
  return (
    <div className="flex flex-col justify-center h-full">
      <div
        className={cn("md:flex items-center flex-col", {
          hidden: isVerifyOtp,
        })}
      >
        <AgentSquareCard data={parentData} companyCode={companyCode} />
        <Divider className="my-5" />
      </div>
      {!isVerifyOtp ? (
        <>
          <VerifyForm setVerify={handleSetVerifyData} />
        </>
      ) : (
        <AgentRegisterForm
          submitText="Đăng ký"
          isLoading={isLoading}
          onUpdate={onSubmit}
          data={{
            agent_phone: verifyData.phone,
            email: verifyData.email,
          }}
        />
      )}
    </div>
  );
};

export default RegisterView;
