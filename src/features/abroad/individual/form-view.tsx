import {
  type FieldValues,
  type Control,
  type UseFormReturn,
  useWatch,
} from "react-hook-form";
import { Grid } from "~/components/ui";
import type { ToolbarAction } from "~/types/data-table-type";
import { formFields } from "./form.schema";
import { FormField } from "~/features/shared/components/form-fields";
import { useEffect, useMemo, useRef } from "react";
import { useCommon } from "~/hooks";
const notAllowed = ["agent_phone"];
interface FormViewProps<T extends FieldValues> {
  control: Control<T>;
  action: ToolbarAction;
  formMethods?: UseFormReturn<T>;
}
export function FormView<T extends FieldValues>({
  control,
  formMethods,
}: FormViewProps<T>) {
  const { productList } = useCommon();
  const { setValue } = formMethods || {};
  const listProduct = useWatch({
    control,
    name: "list_product" as any,
  });
  const prevListRef = useRef<any>(null);

  useEffect(() => {
    if (prevListRef.current === null) {
      prevListRef.current = listProduct || [];
      return;
    }
    if (productList?.length > 0 && listProduct?.length > 0) {
      listProduct.forEach((item: any, index: number) => {
        const prevItem = prevListRef.current?.[index];
        if (
          prevItem &&
          prevItem?.id_abroad_product !== item?.id_abroad_product
        ) {
          const product = productList.find(
            (p: any) => p.id === +item.id_abroad_product
          );
          if (product) {
            setValue?.(
              `list_product.${index}.fee` as any,
              product.total_fee || product.fee || 0
            );
          }
        }
      });
    }
    prevListRef.current = listProduct;
  }, [productList, listProduct, setValue]);

  const newFormFields = useMemo(() => {
    return formFields.map((f: any) => {
      f.isDisabled = notAllowed.includes(f.name);
      return f;
    });
  }, []);
  return (
    <Grid container spacing={6}>
      {newFormFields.map((field: any, k: number) => {
        return field.type === "hidden" ? (
          <FormField key={k} control={control} {...field} />
        ) : (
          <Grid item xs={12} lg={field.col} key={k}>
            {field.extra ? (
              <field.extra
                {...field}
                control={control}
                formMethods={formMethods}
              />
            ) : (
              <FormField key={field.name} control={control} {...field} />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
FormView.displayName = "FormView";
