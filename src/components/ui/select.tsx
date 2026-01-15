import {
  extendVariants,
  Select as HeroSelect,
  SelectItem as HeroSelectItem,
  type SelectProps as HeroSelectProps,
  type SelectItemProps as HeroSelectItemProps,
} from "@heroui/react";
export type SelectProps = HeroSelectProps;
export type SelectItemProps = HeroSelectItemProps;
export const Select = extendVariants(HeroSelect, {
  variants: {
    variant: {
      bordered: {
        trigger:
          "border border-default-600 hover:border-default-300/60 min-h-9 h-9",
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "bordered",
    radius: "sm",
  },
});
export const SelectItem = extendVariants(HeroSelectItem, {});
