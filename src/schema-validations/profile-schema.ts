import {
  validateBirthday,
  validateBirthdayAndTransform,
  validateDateTransform,
  validateIdNumber,
  validatePhone,
} from "./custom-validatior";
import { z } from "zod";
export const agentProfileSchema = z.object({
  agent_phone: validatePhone("SĐT thành viên"),
  agent_name: z
    .string({
      required_error: "Tên thành viên không được để trống",
      invalid_type_error: "Tên thành viên không được để trống",
    })
    .min(1, "Tên thành viên không được để trống"),

  email: z
    .string({
      required_error: "Email không được để trống",
      invalid_type_error: "Email không được để trống",
    })
    .email("Email không hợp lệ")
    .min(1, "Email không được để trống"), // Zod sẽ kiểm tra chuỗi rỗng

  birthday: validateBirthdayAndTransform("Ngày sinh"),
  // birthday: validateBirthday("Ngày sinh"),
  id_number: validateIdNumber("Số CCCD"),
  issued_date: validateDateTransform("Ngày cấp"),
  // issued_date: z
  // 	.date({
  // 		required_error: 'Ngày cấp không được để trống',
  // 		invalid_type_error: 'Ngày cấp không hợp lệ',
  // 	})
  // 	.min(new Date('1900-01-01'), 'Ngày cấp không hợp lệ') // Ví dụ: ngày cấp không quá xa quá khứ
  // 	.max(new Date(), 'Ngày cấp không được trong tương lai') // Ngày cấp không được là ngày trong tương lai
  // 	.nullable(),

  issued_place: z
    .number({
      required_error: "Tỉnh/Thành phố không được để trống",
      invalid_type_error: "ID Tỉnh/Thành phố không hợp lệ",
    })
    .min(1, "Nơi cấp không được để trống"),
  link_front_id: z
    .string({
      required_error: "Ảnh mặt trước không được để trống",
      invalid_type_error: "Ảnh mặt trước không được để trống",
    })
    .min(1, "Ảnh mặt trước không được để trống"),
  // .url('Đường dẫn ảnh mặt trước không hợp lệ'), // Nếu đây là URL

  link_back_id: z
    .string({
      required_error: "Ảnh mặt sau không được để trống",
      invalid_type_error: "Ảnh mặt sau không được để trống",
    })
    .min(1, "Ảnh mặt sau không được để trống"),

  link_portrait: z
    .string({
      required_error: "Ảnh chân dung không được để trống",
      invalid_type_error: "Ảnh chân dung không được để trống",
    })
    .min(1, "Ảnh chân dung không được để trống"),

  // .url("Đường dẫn ảnh mặt sau không hợp lệ"), // Nếu đây là URL

  bank_number: z
    .string({
      required_error: "Số tài khoản không được để trống",
      invalid_type_error: "Số tài khoản không được để trống",
    })
    .min(1, "Số tài khoản không được để trống")
    .regex(/^\d{9,14}$/, "Số tài khoản không hợp lệ (9-14 chữ số)"), // Ví dụ cho số tài khoản ngân hàng

  id_bank: z
    .number({
      required_error: "Ngân hàng không được để trống",
      invalid_type_error: "ID Ngân hàng không hợp lệ",
    })
    .int("ID Ngân hàng phải là số nguyên")
    .min(1, "Ngân hàng không được để trống"),

  id_province: z
    .number({
      required_error: "Tỉnh/Thành phố không được để trống",
      invalid_type_error: "ID Tỉnh/Thành phố không hợp lệ",
    })
    .int("ID Tỉnh/Thành phố phải là số nguyên")
    .min(1, "Tỉnh/Thành phố không được để trống"),

  // id_district: z
  // 	.number({
  // 		required_error: 'Quận/Huyện không được để trống',
  // 		invalid_type_error: 'ID Quận/Huyện không hợp lệ',
  // 	})
  // 	.int('ID Quận/Huyện phải là số nguyên')
  // 	.min(1, 'Quận/Huyện không được để trống'),

  id_commune: z
    .number({
      required_error: "Xã/Phường không được để trống",
      invalid_type_error: "ID Xã/Phường không hợp lệ",
    })
    .int("ID Xã/Phường phải là số nguyên")
    .min(1, "Xã/Phường không được để trống"),

  address: z
    .string({
      required_error: "Số nhà tên đường không được để trống",
      invalid_type_error: "Số nhà tên đường không được để trống",
    })
    .min(1, "Số nhà tên đường không được để trống"),
});

// Đây là cách bạn suy luận kiểu dữ liệu từ schema Zod
export type AgentFormData = z.infer<typeof agentProfileSchema>;
