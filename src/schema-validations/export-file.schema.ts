import z from "zod";

export const exportSchema = z.object({
  fileName: z
    .string({
      required_error: "Vui lòng nhập tên file",
    })
    .min(1, "Vui lòng nhập tên file"),
});
