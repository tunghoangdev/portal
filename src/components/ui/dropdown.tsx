import { Dropdown as DropdownHeroui, extendVariants } from "@heroui/react";
export const Dropdown = extendVariants(DropdownHeroui, {
  defaultVariants: {
    radius: "sm",
  },
}) as any;
export { DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
