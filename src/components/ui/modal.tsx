import {
  extendVariants,
  Modal as HeroMoal,
  ModalBody as HeroModalBody,
  ModalContent as HeroModalContent,
  ModalFooter as HeroModalFooter,
  ModalHeader as HeroModalHeader,
  useDisclosure as useDisclosureHero,
  ModalProps as HeroModalProps,
} from "@heroui/react";

export const Modal = extendVariants(HeroMoal, {
  defaultVariants: {
    size: "xl",
    closeButton: "*:text-xl",
  },
});
export const ModalHeader = extendVariants(HeroModalHeader, {});
export const ModalFooter = extendVariants(HeroModalFooter, {});
export const ModalBody = extendVariants(HeroModalBody, {});
export const ModalContent = extendVariants(HeroModalContent, {});
export type ModalProps = HeroModalProps;
export const useDisclosure = useDisclosureHero;
