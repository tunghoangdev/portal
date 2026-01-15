import { Control, useForm } from "react-hook-form";
import { useAuth, useSwal } from "~/hooks";
import { Stack } from "../ui";
import { PasswordField } from "../form";
import { useRouter } from "next/navigation";
interface Props {
  control: Control<any, any>;
  formMethods: any;
}
export default function ChangePasswordView({ control, formMethods }: Props) {
  //   const { user, role, logoutAction } = useAuth();
  //   const { confirm } = useSwal();
  //   const navigate = useNavigate();
  // *** Hook Form ***
  // const { control, handleSubmit, getValues, formState }: any = useForm({
  //   defaultValues: {
  //     old_password: "",
  //     new_password: "",
  //     confirm_password: "",
  //   },
  // });
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent={"center"}
      className="mb-2.5"
    >
      <PasswordField
        control={control}
        label="Mật khẩu cũ"
        placeholder="Nhập mật khẩu cũ"
        name="old_password"
        isRequired
      />
      <PasswordField
        control={control}
        label="Mật khẩu mới"
        placeholder="Nhập mật khẩu mới"
        name="new_password"
        isRequired
      />
      <PasswordField
        control={control}
        label="Xác nhận mật khẩu mới"
        placeholder="Nhập lại mật khẩu mới"
        name="verify_password"
        isRequired
      />
      {/* <Button
					type="submit"
					color="secondary"
					className="mt-2.5 self-center"
					isLoading={isSubmitting}
					isDisabled={isSubmitting || !isValid}
				>
					Xác nhận
				</Button> */}
    </Stack>
  );
}
