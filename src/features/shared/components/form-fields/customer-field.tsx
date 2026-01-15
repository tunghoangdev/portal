import {
  type Control,
  type FieldValues,
  type Path,
  useController,
  type UseFormReturn,
  useWatch,
} from "react-hook-form";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Stack,
  type InputProps,
} from "~/components/ui";
import { Icons } from "~/components/icons";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks";
import { Alert, User } from "@heroui/react";
import { useEffect, useState } from "react";
import { CustomerForm } from "~/features/shared/components/customer.form";
import { formatDate } from "~/utils/formater";
interface CustomerFieldProps<TFormValues extends FieldValues>
  extends Omit<InputProps, "name" | "ref"> {
  name: string;
  control: Control<TFormValues>;
  formMethods?: UseFormReturn<TFormValues>;
  isRequired?: boolean;
  label?: string;
  isDisabled?: boolean;
}

export const CustomerField = <TFormValues extends FieldValues>(
  props: CustomerFieldProps<TFormValues>
) => {
  const { name, control, formMethods, isRequired, isDisabled, label, ...rest } =
    props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayLabel = (
    <div className="flex items-center">
      {label}
      {isRequired && label && <span className="text-danger ml-1">*</span>}
    </div>
  ) as any;

  const agentId = useWatch({
    control,
    name: "id_agent" as Path<TFormValues>,
  });

  const { setValue } = formMethods || {};
  const {
    field,
    fieldState: { error },
  } = useController({
    name: name as Path<TFormValues>,
    control,
  });
  const value = field.value;
  const { getAll } = useCrud(
    [API_ENDPOINTS.customer.search.byPhone, value, agentId],
    {
      endpoint: "",
      customer_phone: value,
      id_agent: agentId,
    },
    {
      enabled: !!value && value?.length >= 10 && !!agentId,
      staleTime: 1,
    }
  );
  const { data, refetch }: any = getAll();
  useEffect(() => {
    if (agentId) {
      setValue?.("id_agent" as Path<TFormValues>, agentId, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [agentId]);
  useEffect(() => {
    if (data) {
      setValue?.("id_customer" as Path<TFormValues>, data?.id?.toString(), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [data]);

  return (
    <>
      <Input
        {...rest}
        {...field}
        isInvalid={!!error}
        errorMessage={error?.message}
        variant="bordered"
        labelPlacement="outside"
        label={displayLabel}
        isDisabled={!agentId || isDisabled}
        classNames={{
          inputWrapper: "border border-default-400 min-h-9 h-9 bg-white",
          label: "text-black/90 top-[20px] font-medium",
          input: "text-[13px] !shadow-none text-default-700",
        }}
        startContent={<Icons.phone size={16} className="text-default-800" />}
      />
      {data?.status === 2 ? (
        <Alert
          color="warning"
          title={
            <>
              Không tìm thấy khách hàng trong hệ thống. <br />{" "}
              <Button
                onPress={() => setIsModalOpen(true)}
                // onPress={() => handleCrudAction(CRUD_ACTIONS.ADD)}
                size="sm"
                color="primary"
                className="text-xs h-6 mt-2"
              >
                Tạo mới khách hàng
              </Button>
            </>
          }
          hideIconWrapper
          icon={<Icons.triangle size={16} />}
          classNames={{
            base: "mt-2.5 p-1.5",
            title: "text-xs",
            alertIcon: "fill-transparent",
            iconWrapper: "w-5",
            mainWrapper: "m-0 ml-1.5",
          }}
          variant={"flat"}
        />
      ) : data ? (
        <div className="relative w-full">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="absolute -top-1.5 -right-1.5 text-white rounded-full bg-secondary hover:!bg-secondary/80 hover:shadow-lg transition-shadow"
            onPress={() => setIsModalOpen(true)}
            isDisabled={isDisabled}
          >
            <Icons.edit size={14} />
          </Button>
          <div className="shadow-sm bg-success/5 rounded-md p-2 mt-2">
            <Stack alignItems={"center"} justifyContent={"between"}>
              <Stack alignItems={"center"} className="gap-y-1.5">
                <User
                  name={
                    <Stack
                      className="gap-x-1.5 font-semibold"
                      alignItems={"center"}
                    >
                      {data?.is_company ? (
                        <Icons.building size={16} strokeWidth={1} />
                      ) : (
                        <Icons.user size={16} strokeWidth={1} />
                      )}
                      {data?.customer_name}
                    </Stack>
                  }
                  description={
                    data?.email && (
                      <Stack className="text-xs">
                        <Icons.mail
                          className="mr-1"
                          size={16}
                          strokeWidth={1}
                        />
                        {data?.email}
                      </Stack>
                    )
                  }
                  avatarProps={{
                    classNames: {
                      base: "bg-white hidden",
                    },
                  }}
                />
              </Stack>

              <Stack
                className="text-xs mr-5 gap-y-1.5"
                direction={"col"}
                justifyContent={"start"}
              >
                {data?.gender ? (
                  <Stack className="text-xs">
                    {data?.gender === "Nam" ? (
                      <Icons.mars className="mr-1" size={16} strokeWidth={1} />
                    ) : (
                      <Icons.venus className="mr-1" size={16} strokeWidth={1} />
                    )}

                    {data?.gender}
                  </Stack>
                ) : null}
                {data?.birthday ? (
                  <Stack className="text-xs">
                    <Icons.calendar
                      className="mr-1"
                      size={16}
                      strokeWidth={1}
                    />
                    {formatDate(data?.birthday, "dd-MM-yyyy")}
                  </Stack>
                ) : null}
              </Stack>
            </Stack>
            {data?.full_address ? (
              <Stack className="text-xs text-default-700 mt-2.5">
                <Icons.mapPin className="mr-1" size={16} strokeWidth={1} />
                {data?.full_address}
              </Stack>
            ) : null}
          </div>
          {/* 
					<ul className="grid grid-cols-1">
						{renderItem('Số điện thoại', data?.customer_phone)}
						{renderItem('Tên đầy đủ', data?.customer_name)}
						{renderItem('Email', data?.email)}
						{renderItem(
							'Ngày sinh',
							formatDate(data?.birthday) || 'Chưa cập nhật',
						)}
						{renderItem('Giới tính', data?.gender)}
						{renderItem('Địa chỉ', data?.full_address)}
						{renderItem('Loại', data?.is_company ? 'Doanh nghiệp' : 'Cá nhân')}
					</ul> */}
        </div>
      ) : null}
      <Modal
        size="3xl"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="text-secondary text-sm">
            Thêm mới khách hàng
          </ModalHeader>
          <ModalBody>
            <CustomerForm
              onClose={() => setIsModalOpen(false)}
              onRefetch={refetch}
              formControl={control}
              formData={!data?.error_code ? data : undefined}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
