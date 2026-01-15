import { extendVariants, Button as BaseButton } from "@heroui/react";

export const Button = extendVariants(BaseButton, {
  variants: {
    variant: {
      bordered: "border",
      light: "bg-transparent hover:!bg-transparent",
    },
    color: {
      orange: "text-white bg-secondary hover:bg-secondary/80",
    },
  },
  compoundVariants: [
    {
      color: "orange",
      variant: "bordered",
      className:
        "border-orange-500 text-orange-500 bg-transparent hover:bordrer-orange-500/80",
    },
    // {
    // 	color: 'secondary',
    // 	variant: 'bordered',
    // 	className: 'border-secondary text-secondary hover:secondary/80',
    // },
    // // Khi color là 'olive' VÀ variant là 'faded'
    {
      color: "orange",
      variant: "solid",
      className: "text-secondary text-green-800 hover:bg-green-200",
    },
  ],
  defaultVariants: {
    radius: "sm",
  },
});
