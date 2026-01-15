import {
  extendVariants,
  Input as BaseInput,
  type InputProps as BaseInputProps,
} from "@heroui/react";
export type InputProps = BaseInputProps;
export const Input = extendVariants(BaseInput, {
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
