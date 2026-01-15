import { generateZodSchema } from "./custom-validatior";
import z from "zod";
import {
  ContactTypeField,
  CustomerField,
  LifeStatusField,
  PhoneField,
  ProductMainField,
  ProductSubField,
  ProviderField,
} from "~/features/shared/components/form-fields";

const lifeContractFields: any[] = [
  [
    {
      name: "id_life_type",
      label: "Loại hợp đồng",
      extra: ContactTypeField,
      defaultOption: 0,
      isRequired: true,
      type: "select",
      col: 4,
      options: [],
    },
    {
      name: "id_life_provider",
      label: "Nhà cung cấp",
      isRequired: true,
      placeholder: "Chọn nhà cung cấp",
      extra: ProviderField,
      defaultOption: 0,
      col: 4,
    },
    {
      name: "agent_phone",
      label: "SĐT thành viên",
      isRequired: true,
      defaultValue: "",
      placeholder: "Nhập số điện thoại...",
      extra: PhoneField,
      col: 4,
    },
    {
      name: "id_agent",
      type: "hidden",
      label: "ID thành viên",
      isRequiredWhen: (data: any) => {
        return !!data?.agent_phone && data?.agent_phone?.length >= 10;
      },
      requiredMessage:
        "ID thành viên là bắt buộc khi số điện thoại thành viên có giá trị.",
      col: 1,
    },
    {
      name: "number_contract",
      label: "Số hợp đồng",
      placeholder: "Nhập số hợp đồng",
      type: "text",
      col: 4,
    },
    {
      name: "number_request",
      label: "Số yêu cầu",
      placeholder: "Nhập số yêu cầu",
      defaultValue: "",
      isRequired: true,
      type: "text",
      col: 4,
    },
    {
      name: "id_customer",
      label: "Khách hàng",
      extra: CustomerField,
      isRequired: true,
      placeholder: "Chọn khách hàng",
      type: "text",
      col: 4,
    },
    {
      name: "id_life_fee_time",
      label: "Loại đóng phí",
      placeholder: "Chọn loại đóng phí",
      type: "select",
      options: [],
      defaultOption: 0,
      isRequired: true,
      col: 4,
    },
    {
      name: "id_finan",
      label: "Tư vấn tài chính",
      placeholder: "Chọn tư vấn tài chính",
      type: "select",
      isRequired: true,
      options: [],
      col: 4,
    },
  ],
  [
    {
      name: "id_product_main",
      label: "Sản phẩm chính",
      placeholder: "Chọn sản phẩm chính",
      extra: ProductMainField,
      isRequired: true,
      col: 5,
    },
    {
      name: "fee_main",
      label: "Phí đóng",
      placeholder: "Nhập...",
      type: "number",
      isRequired: true,
      col: 3,
    },
    {
      name: "list_sub_product",
      label: "Sản phẩm bổ trợ",
      placeholder: "Chọn sản phẩm phụ",
      type: "select",
      isRequired: true,
      extra: ProductSubField,
      defaultValue: [
        {
          product_id: "",
          quantity: "1",
        },
      ],
      col: 6,
    },
  ],
];
const lifeContractStatusFields: any[] = [
  {
    name: "number_request",
    label: "Số yêu cầu",
    placeholder: "Nhập số yêu cầu",
    defaultValue: "",
    type: "text",
    isDisabled: true,
    col: 6,
  },
  {
    name: "number_contract",
    label: "Số hợp đồng",
    placeholder: "Nhập số hợp đồng",
    defaultValue: "",
    isRequired: true,
    type: "text",
    col: 6,
  },

  {
    name: "issued_date",
    label: "Ngày phát hành",
    defaultValue: "",
    type: "date",
    col: 4,
  },
  {
    name: "effective_date",
    label: "Ngày hiệu lực",
    defaultValue: "",
    type: "date",
    col: 4,
  },
  {
    name: "ack_date",
    label: "Ngày ACK",
    defaultValue: "",
    type: "date",
    col: 4,
  },
  {
    name: "id_life_status",
    label: "Trạng thái hợp đồng",
    extra: LifeStatusField,
    defaultOption: 0,
    isRequired: true,
    isNumber: true,
    col: 12,
  },
];
const lifeContractAckFields: any[] = [
  {
    name: "ack_date",
    label: "Ngày ACK",
    defaultValue: "",
    type: "date",
    isRequired: true,
    col: 12,
  },
];
// Giả định generateZodSchema trả về một ZodObject cơ bản
const lifeContractSchema: any = generateZodSchema<LifeContractSchema>(
  lifeContractFields.flat(),
  {
    superRefine: (data, ctx) => {
      const { agent_phone, id_agent } = data as {
        agent_phone?: string;
        id_agent?: string;
      };

      //   // Điều kiện 1: agent_phone có dữ liệu và đủ dài
      if (agent_phone && agent_phone.length >= 10) {
        // Điều kiện 2: và KHÔNG CÓ id_agent (tức là API chưa tìm thấy hoặc trả về không hợp lệ)
        // Hoặc id_agent có nhưng là chuỗi rỗng
        if (!id_agent) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Không tìm thấy thành viên liên kết cho số điện thoại này. Vui lòng nhập số khác.",
            path: ["agent_phone"], // ✨ Gán lỗi vào trường agent_phone ✨
          });
        }
      }
    },
  }
);

const lifeContractStateSchema: any = generateZodSchema<LifeContractSchema>(
  lifeContractStatusFields
);
const lifeContractAckSchema: any = generateZodSchema<LifeContractSchema>(
  lifeContractAckFields
);
type LifeContractSchema = z.infer<typeof lifeContractSchema>;
type LifeContractStatusSchema = z.infer<typeof lifeContractSchema>;
export {
  lifeContractFields,
  lifeContractStatusFields,
  lifeContractSchema,
  type LifeContractSchema,
  type LifeContractStatusSchema,
  lifeContractStateSchema,
  lifeContractAckSchema,
  lifeContractAckFields,
};
