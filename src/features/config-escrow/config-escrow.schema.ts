import { NumberField } from "@/features/shared/components/form-fields";
import z from "zod";
import { generateZodSchema } from "~/schema-validations";

const configEscrowFormFields: any[] = [
  {
    name: "amount_escrow",
    label: "Tiền ký quỹ",
    placeholder: "Nhập tiền ký quỹ...",
    extra: NumberField,
    isRequired: true,
    defaultValue: "",
    col: 4,
  },
  {
    name: "percentage_period",
    label: "% ký quỹ trên kỳ",
    placeholder: "Nhập % ký quỹ trên kỳ",
    type: "text",
    isRequired: true,
    defaultValue: "",
    isPercent: true,
    col: 4,
  },
  {
    name: "max_escrow",
    label: "Ký quỹ tối đa trên kỳ",
    placeholder: "Nhập quỹ tối đa trên kỳ",
    extra: NumberField,
    defaultValue: "",
    isRequired: true,
    col: 4,
  },
];

const configEscrowSchema: any = generateZodSchema<ConfigEscrowSchema>(
  configEscrowFormFields,
);
type ConfigEscrowSchema = z.infer<typeof configEscrowSchema>;
export { configEscrowFormFields, configEscrowSchema, type ConfigEscrowSchema };
