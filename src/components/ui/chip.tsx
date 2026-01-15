import { Chip as HeroChip, ChipProps as HeroChipProps } from "@heroui/react";
import { extendVariants } from "@heroui/react";
export const Chip = extendVariants(HeroChip, {
  variants: {
    color: {
      info: {
        base: "bg-blue-500/20",
        content: "text-blue-500",
      },
      orange: {
        base: "bg-orange-500/20",
        content: "text-orange-500",
      },
    },
    variant: {
      bordered: {
        base: "border",
      },
      solid: {
        content: "text-white",
      },
    },
    size: {
      sm: {
        base: "px-1 py-[3px] h-auto min-h-0 w-auto min-w-0",
        content: "text-[11px] leading-[12px]",
      },
    },
  },
  compoundVariants: [
    {
      color: "info",
      variant: "bordered",
      class: "border-blue-500 bg-transparent",
    },
    {
      color: "info",
      variant: "solid",
      class: "bg-blue-300",
      content: "text-white",
    },
    {
      color: "orange",
      variant: "bordered",
      class: "border-orange-500 bg-transparent",
    },
  ],
});
export type ChipProps = HeroChipProps;
