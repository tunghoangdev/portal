import {
  extendVariants,
  Modal as HeroMoal,
  ModalBody as HeroModalBody,
  ModalContent as HeroModalContent,
  ModalFooter as HeroModalFooter,
  ModalHeader as HeroModalHeader,
  ModalProps as HeroModalProps,
  useDisclosure as useDisclosureHero,
} from "@heroui/react";

export const Modal = extendVariants(HeroMoal, {
  defaultVariants: {
    size: "xl",
    closeButton: "*:text-xl",
  },
});
export const ModalHeader = HeroModalHeader;
export const ModalFooter = HeroModalFooter;
export const ModalBody = HeroModalBody;
export const ModalContent = HeroModalContent;
export type ModalProps = HeroModalProps;
export const useDisclosure = useDisclosureHero;
