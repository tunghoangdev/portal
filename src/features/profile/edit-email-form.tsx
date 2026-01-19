
import { Button, Modal, ModalBody, ModalHeader } from "@/components/ui";
import { ModalContent, useDisclosure } from "@heroui/react";
import { useCrud } from "@/hooks/use-crud-v2";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Icons } from "@/components/icons";
import { FormField } from "@/features/shared/components/form-fields";
import { useAuth } from "@/hooks";
const defaultValues = {
  email: "",
};
const formSchema = z.object({
  email: z
    .string({
      required_error: "Email không được để trống",
    })
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng, vui lòng kiểm tra lại"),
});
export default function UpdateEmailForm() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const basePath = API_ENDPOINTS.agent.changeEmail;
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  }: any = useForm({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const { update } = useCrud([basePath], {
    endpoint: "",
  });
  const { mutateAsync: updateEmail } = update();
  const onSubmit = async (data: any) => {
    await updateEmail({
      ...data,
      id: user?.id,
      _customUrl: basePath,
      _hideMessage: true,
    });
  };
  return (
    <>
      <Button
        isIconOnly
        variant="bordered"
        onPress={onOpen}
        size="sm"
        className="h-9 w-9"
        color="secondary"
      >
        <Icons.edit size={16} className="text-blue-700" />
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        onClose={onClose}
        classNames={{
          body: "gap-y-5 pb-10",
        }}
      >
        <ModalContent>
          <ModalHeader>Thay đổi email</ModalHeader>
          <ModalBody>
            <FormField
              control={control}
              name="email"
              label="Email mới"
              placeholder="Nhập email mới..."
              isRequired
            />

            <Button
              onClick={handleSubmit(onSubmit)}
              color="primary"
              isDisabled={!isValid}
            >
              Xác nhận
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
