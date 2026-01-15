import {
  extendVariants,
  InputOtp as BaseInput,
  type InputOtpProps as BaseInputProps,
} from "@heroui/react";
export type InputOtpProps = BaseInputProps;
export const InputOtp = extendVariants(BaseInput, {
  variants: {
    variant: {
      bordered: {
        inputWrapper: "border border-default-600 min-h-9 h-9 bg-white",
        input: "text-sm bg-white",
      },
    },
  },
  defaultVariants: {
    radius: "sm",
    variant: "bordered",
  },
});
