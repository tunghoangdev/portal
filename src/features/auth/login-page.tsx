import {
  Button,
  Grid,
  Input,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  MyImage,
  Stack,
  useDisclosure,
} from "~/components/ui";

import { Form } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { InputPassword } from "~/features/shared/components/form-fields";
import { useClientIp, useSwal } from "~/hooks";
import axiosClient from "~/lib/api";
import { useAuthStore } from "~/stores";
import { getCodeKey, roleFromCode } from "~/utils/util";
import Forgetpassword from "./forget-password";
import SignUpForm from "./signup-form";
export default function LoginPage() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { confirm } = useSwal();
  const { ip } = useClientIp();
  const [account, setAccount] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
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
      const listCompany = Array.isArray(response) ? response : [response];
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
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleConfirm = async () => {
    const currentCompany = account?.companies?.find(
      (item: any) => item.secret_key === selectedValue
    );
    const res = await confirm({
      title: "Đăng nhập",
      html: `Bạn có chắc chắn đăng nhập vào portal công ty <br/> <b>${
        currentCompany?.company_name || ""
      }</b> này chứ?`,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      icon: "warning",
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
          (item: any) => item.secret_key === selectedValue
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
          token
        );
        navigate({ to: `/${currentRole}/dashboard` });
      }
    } catch (error) {
      console.log("error--->", error);

      // toast.error('Lỗi khi đăng nhập');
    }
  };

  return (
    <div className="flex h-svh flex-col items-center justify-center gap-6 p-2.5 md:p-10 overflow-hidden relative">
      <MyImage
        src={`/images/bg.jpg`}
        alt="bg"
        className="absolute top-0 left-0 w-full h-full"
      />
      <Grid container spacing={4} className="w-full h-full relative z-index-1">
        <Grid item xs={12} sm={8} className="hidden sm:flex">
          <div className="w-full h-full bg-cover bg-center" />
          {/* <Carousel /> */}
        </Grid>
        <Grid item xs={12} sm={4} className="rounded-lg bg-white">
          <Form
            className="md:w-full flex flex-col gap-4 mx-2.5 sm:mx-0 p-6 items-center md:px-10 justify-center h-full"
            onSubmit={handlerSubmit}
          >
            <div className="flex flex-col items-center text-center mb-2">
              {/* <img
								src={'/images/logo-full.png'}
								alt=""
								className="w-[200px] md:max-w-[350px] h-auto"
							/> */}
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
                label: "font-semibold",
                inputWrapper: "border shadow-xs",
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
                label: "font-semibold",
                inputWrapper: "border shadow-xs",
              }}
              variant="bordered"
            />
            <Stack
              className="w-full gap-y-2.5"
              alignItems={"center"}
              direction={"col"}
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
              <Forgetpassword />

              <SignUpForm />
            </Stack>
          </Form>
        </Grid>
      </Grid>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        classNames={{
          closeButton: "*:text-xl",
        }}
      >
        <ModalContent>
          {(onClose: any) => (
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
    </div>
  );
}
