import z from "zod";

const passwordSchema = z
  .string({
    invalid_type_error: "Mật khẩu là bắt buộc",
    required_error: "Mật khẩu là bắt buộc",
  })
  .min(4, "Mật khẩu phải có ít nhất 4 ký tự");

export const changePasswordSchema = z
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
