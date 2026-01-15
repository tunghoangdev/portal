import { useForm } from "react-hook-form";
import { PasswordField } from "./form-fields";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useSwal } from "~/hooks";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks/use-crud-v2";
import { Button, Stack } from "~/components/ui";
import { ROLES } from "~/constant";
const passwordSchema = z
  .string({
    invalid_type_error: "Mật khẩu là bắt buộc",
    required_error: "Mật khẩu là bắt buộc",
  })
  .min(4, "Mật khẩu phải có ít nhất 4 ký tự");

export const Schema = z
  .object({
    old_password: passwordSchema.refine((val) => val.trim() !== "", {
      message: "Nhập mật khẩu cũ",
    }),
    new_password: passwordSchema.refine((val) => val.trim() !== "", {
      message: "Nhập mật khẩu mới",
    }),
    verify_password: z.optional(z.any()),
  })
  .superRefine((data, ctx) => {
    if (data.new_password === data.old_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu mới phải khác mật khẩu cũ",
        path: ["new_password"],
      });
    }

    if (!data.verify_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Xác nhận mật khẩu mới là bắt buộc",
        path: ["verify_password"],
      });
    }

    if (data.verify_password && data.new_password !== data.verify_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu không khớp",
        path: ["verify_password"],
      });
    }
  });
// .refine((data) => data.new_password !== data.old_password, {
//   message: "Mật khẩu mới phải khác mật khẩu cũ",
//   path: ["new_password"],
// });
// .refine((data) => data.new_password === data.verify_password, {
//   message: "Mật khẩu không khớp",
//   path: ["verify_password"],
// });

export const ChangePasswordForm = () => {
  const { user, role } = useAuth();
  // *** Hook Form ***
  const { control, handleSubmit, formState }: any = useForm({
    resolver: zodResolver(Schema),
    mode: "onChange",
  });
  const { isSubmitting, isValid } = formState;
  const url = API_ENDPOINTS?.[role]?.profile;
  const { updateConfirm } = useCrud([url?.get, role]);

  const onSubmit = async (values: any) => {
    await updateConfirm(
      {
        id: user?.id,
        old_password: values.old_password,
        new_password: values.new_password,
      },
      {
        title: "Xác nhận đổi mật khẩu",
        message: "Bạn có chắc chắn muốn đổi mật khẩu?",
        _customUrl: `${role === ROLES.SAMTEK ? "/root" : ""}${url?.changePassword}`,
        _customMessage: "Đổi mật khẩu thành công",
      }
      //   {
      //     onSuccess: (data) => {
      //       if (!data.error_code) {
      //         onClose();
      //         logoutAction(router);
      //       }
      //     },
      //   }
    );
    // onClose();
    // logoutAction(router);
    // mutate(
    // 	{
    // 		id: user?.id,
    // 		old_password: values.old_password,
    // 		new_password: values.new_password,
    // 		_customUrl: url?.changePassword,
    // 		_customMessage: 'Đổi mật khẩu thành công',
    // 	},
    // 	{
    // 		onSuccess: (data) => {
    // 			if (!data.error_code) {
    // 				onClose();
    // 				logoutAction(router);
    // 			}
    // 		},
    // 	},
    // );
    // onClose();

    // const res = await confirm({
    // 	title: 'Xác nhận',
    // 	text: 'Bạn có chắc chắn muốn đổi mật khẩu?',
    // 	// customClass: {
    // 	// 	container: '!z-[9999]',
    // 	// 	htmlContainer: '!z-[9999]',
    // 	// },
    // 	// target: document.body,
    // });

    // if (res.isConfirmed) {
    // 	mutate(
    // 		{
    // 			id: user?.id,
    // 			old_password: values.old_password,
    // 			new_password: values.new_password,
    // 			_customUrl: url?.changePassword,
    // 			_customMessage: 'Đổi mật khẩu thành công',
    // 		},
    // 		{
    // 			onSuccess: (data) => {
    // 				if (!data.error_code) {
    // 					onClose();
    // 					logoutAction(router);
    // 				}
    // 			},
    // 		},
    // 	);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button
          type="submit"
          color="secondary"
          className="mt-2.5 self-center"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || !isValid}
        >
          Xác nhận
        </Button>
      </Stack>
    </form>
  );
};
