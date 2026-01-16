import type React from "react";
import { forwardRef, memo, type ReactNode } from "react";
import {
  Modal as HeroModal, // Đổi tên để tránh xung đột với tên file
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps,
} from "@/components/ui"; // Đảm bảo đường dẫn đúng
import type { UseFormReturn, FieldValues } from "react-hook-form";
import type { ToolbarAction } from "@/types/data-table-type";
import { Icons } from "@/components/icons";
import { isEmpty } from "lodash";
import { FormField } from "@/features/shared/components/form-fields";

interface FormModalProps<TFieldValues extends FieldValues> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  form: UseFormReturn<TFieldValues>;
  onSubmit?: (data: TFieldValues) => void;
  onExport?: (data: TFieldValues) => void;
  isLoading?: boolean;
  children: ReactNode;
  size?: ModalProps["size"];
  submitLabel?: string;
  isEditMode?: boolean;
  isExport?: boolean;
  exportLabel?: string;
  modalId?: string;
  action?: ToolbarAction;
  modalProps?: any;
}
export const FormModal = memo(
  forwardRef<any, FormModalProps<any>>(
    <TFieldValues extends FieldValues>(
      {
        isOpen,
        onClose,
        title,
        form,
        onSubmit,
        onExport,
        isLoading = false,
        children,
        size,
        submitLabel,
        isEditMode = false,
        isExport = false,
        exportLabel = "Tải xuống",
        modalId,
        modalProps,
      }: FormModalProps<TFieldValues>,
      ref: any
    ) => {
      const {
        handleSubmit,
        formState: { isSubmitting, errors },
        control,
      } = form;
      // Determine the submit button text based on props
      const defaultSubmitLabel = isEditMode ? "Cập nhật" : "Tạo mới";
      const finalSubmitLabel = submitLabel || defaultSubmitLabel;
      const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // if (e.key === "Escape") {
        //   onClose();
        // }
        if (e.key === "Enter" && !isSubmitting) {
          e.preventDefault();
          handleFormSubmit();
        }
      };
      
      const handleFormSubmit = form.handleSubmit(async (data) => {
        if (isExport && onExport) {
          await onExport(data);
        } else {
          await onSubmit?.(data);
        }
      });
      return (
        <HeroModal
          isOpen={isOpen}
          onClose={onClose}
          size={size || (isExport ? "xl" : "4xl")}
          classNames={{
            closeButton:
              "text-xl right-1.5 hover:cursor-pointer text-secondary p-1.5",
          }}
          {...modalProps}
        >
          <ModalContent ref={ref} tabIndex={-1} onKeyDown={handleKeyDown}>
            <form onSubmit={handleFormSubmit}>
              <ModalHeader className="text-secondary text-sm">
                {title}
              </ModalHeader>
              <ModalBody>
                {isExport && !children ? (
                  <FormField
                    control={control}
                    name="fileName"
                    placeholder="Nhập tên file"
                    type="text"
                  />
                ) : (
                  children
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end gap-2">
                  <Button variant="bordered" size="sm" onPress={onClose}>
                    Hủy
                  </Button>

                  {isExport ? (
                    <Button
                      type="submit"
                      onPress={
                        onExport ? () => handleFormSubmit() : undefined
                      }
                      color="primary"
                      size="sm"
                      isDisabled={isSubmitting}
                      isLoading={isLoading || isSubmitting}
                    >
                      {exportLabel}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onPress={
                        onSubmit ? () => handleFormSubmit() : undefined
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Enter pressed");
                          // handleSubmit(onSubmit)();
                        }
                      }}
                      color="secondary"
                      size="sm"
                      isDisabled={isSubmitting || !isEmpty(errors)}
                      startContent={<Icons.save size={18} />}
                      isLoading={isLoading || isSubmitting}
                    >
                      {finalSubmitLabel}
                    </Button>
                  )}
                </div>
              </ModalFooter>
            </form>
          </ModalContent>
        </HeroModal>
      );
    }
  )
);
FormModal.displayName = "FormModal";
