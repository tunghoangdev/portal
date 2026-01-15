import z from "zod";
import { generateDefaultValues, generateZodSchema } from "./custom-validatior";
import {
  PhoneField,
  ProvinceSelect,
  SwitchField,
  WardSelect,
} from "~/features/shared/components/form-fields";

const customerFormFields: any[] = [
  {
    name: "agent_phone",
    label: "SĐT thành viên",
    placeholder: "Nhập số sđt thành viên...",
    type: "text",
    extra: PhoneField,
    defaultValue: "",
    isRequired: true,
    isPhone: true,
    col: 12,
  },
  {
    name: "customer_name",
    label: "Tên khách hàng",
    placeholder: "Nhập tên khách hàng...",
    type: "text",
    isRequired: true,
    defaultValue: "",
    col: 4,
  },
  {
    name: "customer_phone",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại...",
    type: "text",
    defaultValue: "",
    isRequired: true,
    isPhone: true,
    col: 4,
  },
  {
    name: "gender",
    label: "Giới tính",
    placeholder: "Chọn giới tính",
    type: "select",
    isRequired: true,
    defaultValue: "Nam",
    options: [
      {
        label: "Nam",
        value: "Nam",
      },
      {
        label: "Nữ",
        value: "Nữ",
      },
    ],
    col: 4,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Nhập email",
    type: "text",
    defaultValue: "",
    col: 4,
  },
  {
    name: "birthday",
    label: "Ngày sinh",
    placeholder: "Nhập ngày sinh",
    type: "date",
    isBefore: true,
    defaultValue: "",
    col: 4,
  },
  {
    name: "is_company",
    label: "Doanh nghiệp",
    extra: SwitchField,
    defaultValue: false,
    classNames: {
      wrapper: "flex flex-col h-full justify-end",
    },
    col: 4,
  },
  {
    name: "id_province",
    label: "Tỉnh/Thành phố",
    placeholder: "Chọn tỉnh/ thành phố",
    extra: ProvinceSelect,
    isRequired: true,
    isNumber: true,
    defaultValue: "",
    // fieldOptions: {
    // 	col: 4,
    // 	districtName: 'id_district',
    // 	wardName: 'id_commune',
    // },
    col: 4,
  },
  {
    name: "id_commune",
    label: "Phường/xã",
    placeholder: "Chọn phường/ xã",
    extra: WardSelect,
    isRequired: true,
    isNumber: true,
    defaultValue: "",
    // fieldOptions: {
    // 	col: 4,
    // 	districtName: 'id_district',
    // 	wardName: 'id_commune',
    // },
    col: 4,
  },

  {
    name: "address",
    label: "Số nhà tên đường",
    placeholder: "Nhập địa chỉ...",
    type: "text",
    isRequired: true,
    defaultValue: "",
    col: 4,
  },
  {
    name: "id_agent",
    type: "hidden",
    label: "ID thành viên",
    defaultValue: "",
  },
  {
    name: "full_address",
    type: "hidden",
    defaultValue: "",
  },
];

const customerSchema: any =
  generateZodSchema<CustomerSchema>(customerFormFields);
const initialCustomerFormValues = generateDefaultValues(customerFormFields);
type CustomerSchema = z.infer<typeof customerSchema>;
export {
  customerFormFields,
  customerSchema,
  type CustomerSchema,
  initialCustomerFormValues,
};
