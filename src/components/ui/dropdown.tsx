import { Dropdown as DropdownHeroui, extendVariants } from "@heroui/react";
export const Dropdown = extendVariants(DropdownHeroui, {
  defaultVariants: {
    radius: "sm",
  },
});
export { DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
