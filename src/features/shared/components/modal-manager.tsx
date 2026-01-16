import { ACTION_EXPORT_EXCELS, CRUD_ACTIONS } from "@/constant";
import { useDynamicForm } from "@/hooks";
import { exportSchema, normalizeFormDataForForm } from "@/schema-validations";
import { useModalStackConfig } from "@/stores";
import type {
  CombinedFormFields,
  TExportFormFields,
  TItemFormFields,
} from "@/types/form-field";
import { isEmpty } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { DetailModal } from "./detail-modal"; // Import DetailModal
import { FormModal } from "./form-modal";

export function ModalManager() {
  const currentModalConfig: any = useModalStackConfig();
  const currentSchema = useMemo(() => {
    if (ACTION_EXPORT_EXCELS.includes(currentModalConfig?.action)) {
      return exportSchema;
    }
    return currentModalConfig?.itemSchema;
  }, [currentModalConfig]);
  const { formMethods, resetFormState } = useDynamicForm<
    TItemFormFields,
    TExportFormFields,
    CombinedFormFields<TItemFormFields, TExportFormFields>
  >({
    itemSchema:
      currentModalConfig?.type === "form"
        ? currentSchema || undefined
        : undefined,
  });
  const lastFormModalIdRef = useRef<string | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement | HTMLFormElement>(null);
  useEffect(() => {
    if (!currentModalConfig || currentModalConfig.type !== "form") {
      resetFormState();
      lastFormModalIdRef.current = undefined; // Reset ID đã theo dõi
      return;
    }

    const {
      id: currentModalId,
      action: currentAction,
      defaultItemValues,
    } = currentModalConfig;
    if (currentModalId !== lastFormModalIdRef.current) {
      let valuesToReset:
        | CombinedFormFields<TItemFormFields, TExportFormFields>
        | undefined;
      if (
        // (currentAction === CRUD_ACTIONS.ADD ||
        //   currentAction === CRUD_ACTIONS.EDIT) &&
        defaultItemValues
      ) {
        valuesToReset = normalizeFormDataForForm(defaultItemValues);
      } else if (ACTION_EXPORT_EXCELS.includes(currentAction)) {
        valuesToReset = {
          fileName: `Export_${new Date().toISOString().slice(0, 10)}`,
        };
      } else {
        valuesToReset = {};
      }
      if (!isEmpty(valuesToReset)) {
        resetFormState(valuesToReset);
      }

      // Cập nhật ID của modal form hiện tại để so sánh trong lần chạy tiếp theo
      lastFormModalIdRef.current = currentModalId;
    }
    // Nếu ID không thay đổi (tức là form modal hiện tại vẫn đang mở), không reset lại
    // Điều này ngăn re-render vô hạn
  }, [currentModalConfig, formMethods]); // Dependencies: currentModalConfig và formMethods

  useEffect(() => {
    // Kiểm tra xem có modal nào đang mở không
    if (currentModalConfig?.isOpen) {
      // Dùng setTimeout để đảm bảo modal đã render hoàn toàn trước khi focus
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 0);
    }
  }, [currentModalConfig?.isOpen]);

  if (!currentModalConfig || !currentModalConfig.isOpen) {
    return null;
  }
  // SETUP MODAL VIEW
  const { id, type, modalProps } = currentModalConfig;
  // Render modal dựa trên type
  if (type === "form") {
    const formProps = currentModalConfig as typeof currentModalConfig & {
      type: "form";
    };
    const commonFormProps = {
      action: formProps.action,
      control: formMethods.control,
      formMethods,
    };
    const FormContentComponent: any = formProps.renderFormContent;
    return (
      <FormModal
        ref={modalRef}
        key={id} // Key để React nhận biết instance modal khác nhau
        isOpen={formProps.isOpen}
        onClose={modalProps?.onClose || formProps.onClose}
        title={formProps.title}
        form={formMethods} // Cần truyền formMethods.formMethods
        onSubmit={formProps.onSubmit}
        onExport={formProps.onExport}
        isLoading={false} // Cần quản lý loading riêng
        isEditMode={formProps.action !== CRUD_ACTIONS.ADD}
        size={formProps.size}
        isExport={ACTION_EXPORT_EXCELS.includes(formProps.action)}
        // submitLabel={getSubmitButtonLabel()}
        modalId={id}
        action={formProps.action}
        modalProps={{
          ...modalProps,
          scrollBehavior: modalProps?.scrollBehavior || "outside",
        }}
      >
        {!formProps.isOnlyExport && FormContentComponent ? (
          <FormContentComponent {...commonFormProps} />
        ) : null}
      </FormModal>
    );
  }
  if (type === "detail") {
    const detailProps = currentModalConfig as typeof currentModalConfig & {
      type: "detail";
    };
    const {
      renderContent,
      isOpen,
      onClose,
      title,
      size,
      data,
      tableColumns,
      tableOptions,
      detailUrl,
      modalProps,
    } = detailProps;

    const ContentComponent: any = renderContent;
    return (
      <DetailModal
        ref={modalRef}
        key={id}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size={size}
        data={data}
        modalId={id}
        renderContent={ContentComponent}
        tableColumns={tableColumns}
        tableOptions={tableOptions}
        detailUrl={detailUrl}
        modalProps={modalProps}
      />
    );
  }
  return null;
}
