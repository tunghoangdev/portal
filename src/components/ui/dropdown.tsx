import {
  Dropdown as DropdownHeroui,
  DropdownItem as DropdownItemHeroui,
  DropdownMenu as DropdownMenuHeroui,
  DropdownTrigger as DropdownTriggerHeroui,
  extendVariants,
} from "@heroui/react";
export const Dropdown = extendVariants(DropdownHeroui, {
  defaultVariants: {
    radius: "sm",
  },
});
export const DropdownItem = extendVariants(DropdownItemHeroui, {});
export const DropdownMenu = extendVariants(DropdownMenuHeroui, {});
export const DropdownTrigger = extendVariants(DropdownTriggerHeroui, {});
