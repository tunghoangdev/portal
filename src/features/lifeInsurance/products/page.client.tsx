"use client";
import { CRUD_ACTIONS } from "@/constant";
import { API_ENDPOINTS } from "@/constant/api-endpoints";
import { getColumns } from "@/features/shared/common";
import { DataTable } from "@/features/shared/components/data-table";
import { useDataQuery, useModal } from "@/hooks";
import { useCallback, useMemo } from "react";

import { createColumnDef } from "@/features/shared/common/create-column";
import { useAuth } from "@/hooks/use-auth";
import { useCrud } from "@/hooks/use-crud-v2";
import {
  generateDefaultValues,
  generateZodSchema,
  lifePolicyFields,
  lifeProductSchema,
  productFormFields,
} from "@/schema-validations";
import type { CrudActionType, ToolbarAction } from "@/types/data-table-type";
import type { TItemFormFields } from "@/types/form-field";
import { toast } from "sonner";
import { lifeProductColumns, lifeProductPercentageColumns } from "./columns";
import { LifeProductForm } from "./form";
import { LifeProductPolicyForm } from "./policy.form";
export default function PageClient() {
  const { role } = useAuth();
  const basePath = API_ENDPOINTS[role].lifeInsurance.products;

  const initialFormValues = useMemo(
    () => generateDefaultValues(productFormFields),
    [productFormFields],
  );

  const { queryParams, queryKey, isQueryEnabled } = useDataQuery({
    basePath: basePath.list,
    // rangeFilter: true,
    // filter: {
    // 	provider_code: true,
    // 	contract_type: true,
    // },
  });

  const { getInfinite, create, update, deleteConfirm } = useCrud(
    queryKey,
    queryParams,
    {
      enabled: isQueryEnabled,
    },
  );

  const {
    listData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  }: any = getInfinite();
  // Lấy các actions từ Zustand store
  const { openFormModal, openDetailModal } = useModal();
  const { getAll } = useCrud([API_ENDPOINTS.dic.agentLevel], {
    endpoint: "",
  });

  const { update: updateConfigProduct } = useCrud([basePath.list], {
    endpoint: role,
    updateUrl: "config",
  });

  const { data: agentLevelList }: any = getAll();
  const levelColumns = useMemo(() => {
    if (!agentLevelList?.length) return [];
    const rewardColumns = agentLevelList.map(
      createColumnDef("percentage_level_", "Thưởng", { hiddenPercent: true }),
    );
    const sameLevelColumns = agentLevelList.map(
      createColumnDef("percentage_same_level_", "Thưởng đồng cấp", {
        hiddenPercent: true,
      }),
    );
    return [
      ...rewardColumns,
      ...sameLevelColumns,
      {
        title: "Thưởng TVTC %",
        key: "percentage_finan",
        type: "number",
      },
    ];
  }, [agentLevelList]);

  const newFields: any = useMemo(() => {
    const fields = levelColumns.map((item: any) => ({
      name: item.key,
      label: item.title,
      isRequired: true,
      placeholder: `Nhập tỷ lệ ${item.title.toLowerCase()}`,
      type: "number",
      defaultValue: "0",
      allowZero: true,
      col: 3,
    }));

    let fields2: any = [...lifePolicyFields];
    fields2[0] = [...fields];
    return fields2;
  }, [levelColumns]);

  const tableCol = useMemo(() => {
    const baseColumns = [
      ...lifeProductColumns,
      ...levelColumns,
      ...lifeProductPercentageColumns,
    ];
    return {
      columns: getColumns<any>(baseColumns, {
        actions: [
          CRUD_ACTIONS.LOG,
          CRUD_ACTIONS.EDIT,
          CRUD_ACTIONS.CONFIG_POLICY,
          CRUD_ACTIONS.DELETE,
        ],
      }),
      logColumns: getColumns<any>(baseColumns, { isLog: true }),
    };
  }, [lifeProductColumns, levelColumns]);

  const { mutateAsync: createProductMutation } = create();
  const { mutateAsync: updateProductMutation } = update();
  const { mutateAsync: updateConfigProductMutation } = updateConfigProduct();
  const lifeProductPolicySchema = useMemo(
    () => generateZodSchema<any>(newFields.flat()),
    [newFields, levelColumns],
  );
  const handleCrudAction = useCallback(
    (action: CrudActionType, formData?: TItemFormFields) => {
      const payload =
        action === CRUD_ACTIONS.ADD ? initialFormValues : formData;
      if (action === CRUD_ACTIONS.DELETE) {
        deleteConfirm(formData, {
          title: "Xóa sản phẩm",
          message: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        });
        return;
      }
      const isForm = (
        [
          CRUD_ACTIONS.ADD,
          CRUD_ACTIONS.EDIT,
          CRUD_ACTIONS.CONFIG_POLICY,
        ] as string[]
      ).includes(action as string);
      if (isForm) {
        const titleMap: any = {
          [CRUD_ACTIONS.CONFIG_POLICY]: `Cấu hình chính sách sản phẩm ${
            payload?.product_name || ""
          }`,
          [CRUD_ACTIONS.EDIT]: `Chỉnh sửa sản phẩm ${
            payload?.product_name || ""
          }`,
          [CRUD_ACTIONS.ADD]: "Thêm sản phẩm",
        };
        openFormModal(action as ToolbarAction, {
          itemSchema:
            action === CRUD_ACTIONS.CONFIG_POLICY
              ? lifeProductPolicySchema
              : lifeProductSchema,
          renderFormContent: ({ control, formMethods }: any) =>
            action === CRUD_ACTIONS.CONFIG_POLICY ? (
              <LifeProductPolicyForm
                control={control}
                formMethods={formMethods}
                fields={newFields}
              />
            ) : (
              <LifeProductForm control={control} formMethods={formMethods} />
            ),
          formData: payload,
          size: "5xl",
          title: titleMap[action],
          onItemSubmit: async (
            values: TItemFormFields,
            currentAction: string,
          ) => {
            try {
              if (currentAction === CRUD_ACTIONS.ADD) {
                await createProductMutation(
                  values as Omit<TItemFormFields, "id">,
                );
              } else if (currentAction === CRUD_ACTIONS.EDIT) {
                if (!values.id && !payload?.id) {
                  toast.error("Không tìm thấy sản phẩm");
                  return;
                }
                const updateData = {
                  ...payload,
                  ...values,
                };
                await updateProductMutation(updateData);
              } else if (currentAction === CRUD_ACTIONS.CONFIG_POLICY) {
                if (!values.id && !payload?.id) {
                  toast.error("Không tìm thấy sản phẩm");
                  return;
                }
                const updateData = {
                  // ...payload,
                  ...values,
                  id: payload?.id,
                };
                await updateConfigProductMutation(updateData);
              }
            } catch (error) {
              console.error("Failed to submit item:", error);
              throw error;
            }
          },
          // onFormSubmitSuccess: () => {
          // 	useFormModalStore.getState().closeModal();
          // },
        });
      } else {
        openDetailModal(formData, {
          title: `Lịch sử sản phẩm ${formData?.product_name || ""}`,
          tableColumns: tableCol.logColumns,
          tableOptions: {
            enabled: true,
          },
          detailUrl: basePath.logList,
        });
      }
    },
    [
      openFormModal,
      openDetailModal,
      createProductMutation,
      updateProductMutation,
      newFields,
      lifeProductPolicySchema,
    ],
  );

  return (
    <DataTable
      data={listData}
      columns={tableCol.columns}
      loading={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      total={total || 0}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      onAction={handleCrudAction}
      columnPinningConfig={{
        left: ["product_name"],
        right: [],
      }}
      toolbar={{
        canAdd: true,
      }}
    />
  );
}
