import { Control } from "react-hook-form";
import { PasswordField } from "~/features/shared/components/form-fields";
import { Stack } from "../ui";
interface Props {
  control: Control<any, any>;
}
export default function ChangePasswordView({ control }: Props) {
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
