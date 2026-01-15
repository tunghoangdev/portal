import { Control, FieldValues, Path } from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useCommon, useCrud } from "~/hooks";
import { SelectField } from "./select-field";
import { useEffect, useState } from "react";
interface ProductMainFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  defaultOption?: number;
  formMethods?: any;
}

export function ProductMainField<TFormValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  formMethods,
}: ProductMainFieldProps<TFormValues>) {
  const { currentProviderId } = useCommon();
  const { setValue, getValues } = formMethods;
  const [payload, setPayload] = useState<any>();
  const basePath = API_ENDPOINTS.dic.lifeProductByProvider;
  const { getAll } = useCrud(
    [basePath, payload],
    {
      endpoint: "",
      id: +currentProviderId,
    },
    {
      enabled: !!currentProviderId,
    }
  );
  const { data: lifeProducts }: any = getAll();
  // const { data: lifeProducts }: any = useQuery({
  //   queryKey: [basePath, payload],
  //   queryFn: () => api.post(basePath, payload),
  //   enabled: !!payload,
  // });

  useEffect(() => {
    if (currentProviderId) {
      setPayload({
        id: +currentProviderId,
      });
    }
    const currentValue = getValues()?.id_product_main;
    if (lifeProducts?.length && currentValue) {
      setValue(name, currentValue, { shouldValidate: true, shouldDirty: true });
    }
  }, [currentProviderId, lifeProducts, getValues]);

  const listData = transformToOptions(lifeProducts, "product_name", "id");
  return (
    <SelectField
      control={control}
      name={name}
      options={listData}
      placeholder={placeholder}
      label={label}
    />
  );
}
