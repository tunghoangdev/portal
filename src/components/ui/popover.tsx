import {
  Popover as BasePropover,
  PopoverTrigger as BasePopoverTrigger,
  PopoverContent as BasePopoverContent,
  PopoverProps as BasePopoverProps,
  extendVariants,
} from "@heroui/react";
export const Popover = extendVariants(BasePropover, {});
export const PopoverTrigger = extendVariants(BasePopoverTrigger, {});
export const PopoverContent = extendVariants(BasePopoverContent, {});
export type PopoverProps = BasePopoverProps;
