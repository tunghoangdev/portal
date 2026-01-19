import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useCrud } from "~/hooks";
import { AutocompleteField } from "./auto-complete-field";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useCommonStore } from "~/stores";
interface ProductMainFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  customPath?: string;
  storeName?: string;
  defaultOption?: number;
  formMethods?: any;
  isDisabled?: boolean;
  isRequired?: boolean;
}

export function ProductMainField<TFormValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  defaultOption,
  customPath,
  isDisabled,
  storeName,
  isRequired,
}: ProductMainFieldProps<TFormValues>) {
  const pathName = useLocation().pathname;
  const providerId = useWatch({
    control,
    name: storeName || "id_life_provider",
  });
  const [basePath, setBasePath] = useState("");
  const { setData } = useCommonStore();
  const { getAll } = useCrud(
    [basePath, providerId, pathName],
    {
      endpoint: "",
      id: +providerId,
    },
    {
      enabled: !!providerId && !!basePath,
    }
  );
  const { data: lifeProducts, isFetching }: any = getAll();

  useEffect(() => {
    if (customPath) {
      setBasePath(customPath);
    } else {
      setBasePath(API_ENDPOINTS.dic.lifeProductByProvider);
    }
  }, [customPath, providerId, pathName]);

  useEffect(() => {
    if (lifeProducts?.length > 0) {
      setData("productList", lifeProducts);
    }
  }, [lifeProducts]);

  const listData = useMemo(() => {
    return transformToOptions(lifeProducts, "product_name");
  }, [lifeProducts]);

  return (
    <AutocompleteField
      name={name}
      control={control}
      label={label}
      options={listData}
      isRequired={isRequired}
      placeholder={isFetching ? "Đang tải" : placeholder}
      defaultOption={defaultOption}
      isDisabled={isDisabled}
    />
  );
}
