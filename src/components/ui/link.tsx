import { extendVariants, Link as BaseLink } from "@heroui/react";

export const Link = extendVariants(BaseLink, {
  defaultVariants: {
    color: "foreground",
  },
});
