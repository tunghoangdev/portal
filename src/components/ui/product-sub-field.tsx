import {
  type Control,
  type FieldValues,
  type Path,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useCrud } from "~/hooks";
import { SelectField } from "./select-field";
import { Stack } from "./stack";
import { Button } from "./button";
import { Icons } from "~/components/icons";
import { useMemo } from "react";
import { FormField } from "~/features/shared/components/form-fields";
interface ProductSubFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  defaultOption?: number;
  placeholder?: string;
  label?: string;
}

export function ProductSubField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  placeholder,
  label,
}: ProductSubFieldProps<TFormValues>) {
  const productMainId = useWatch({
    control,
    name: "id_product_main",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });
  const { getAll } = useCrud(
    [API_ENDPOINTS.dic.lifeSubProductByMain, { id: productMainId }],
    {
      endpoint: "",
      id: productMainId,
    },
    {
      enabled: !!productMainId,
    }
  );
  const { data: lifeSubProductFetch }: any = getAll();

  const listData = useMemo(() => {
    if (!lifeSubProductFetch) {
      return [];
    }
    return transformToOptions(lifeSubProductFetch, "product_name", "id");
  }, [lifeSubProductFetch]);

  return (
    <div className="w-2/3">
      {fields.map((field, index) => (
        <Stack
          key={field.id}
          alignItems={"end"}
          className="gap-x-2 gap-y-3 mb-2.5"
        >
          <SelectField
            control={control}
            name={`${name}.${index}.product_id`}
            options={listData}
            value={
              defaultOption && listData[defaultOption]?.value
                ? listData[defaultOption]?.value
                : undefined
            }
            placeholder={placeholder}
            label={label}
          />
          <FormField
            control={control}
            name={`${name}.${index}.quantity`}
            type="number"
            label="Phí đóng"
            isRequired
            fieldProps={{
              className: "w-1/2",
            }}
          />
          <Button
            onClick={() => {
              remove(index);
            }}
            color="danger"
            size="sm"
            variant="bordered"
            isIconOnly
          >
            <Icons.trash size={14} />
          </Button>
        </Stack>
      ))}
      <Stack>
        <Button
          isDisabled={!productMainId}
          onClick={() => {
            append({
              //@ts-ignore
              product_id: "",
              quantity: "1",
            });
          }}
          variant="bordered"
          color="secondary"
          size="sm"
          startContent={<Icons.add size={12} strokeWidth={1} />}
          className="h-6"
        >
          Thêm sản phẩm bổ trợ
        </Button>
      </Stack>
    </div>
  );
}
