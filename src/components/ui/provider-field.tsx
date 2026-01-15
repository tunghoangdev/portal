import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions, useCommon, useCommonData } from "~/hooks";
import { useCommonStore } from "~/stores";
import { SelectField } from "./select-field";
import { useEffect, useMemo } from "react";
interface ProviderFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  defaultOption?: number;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  basePath?: string;
  storeName?: string;
}

export function ProviderField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  label,
  isRequired,
  placeholder,
  basePath,
  storeName,
}: ProviderFieldProps<TFormValues>) {
  const { setData } = useCommonStore();
  const { lifeProviders, noneLifeProviders } = useCommon();
  const { isFetching } = useCommonData(
    storeName || "lifeProviders",
    basePath || API_ENDPOINTS.dic.lifeProvider,
    {
      enabled: true,
    }
  );
  const providerId = useWatch({
    control,
    name,
  });

  useEffect(() => {
    if (
      providerId ||
      (lifeProviders?.length && defaultOption !== undefined) ||
      (noneLifeProviders?.length && defaultOption !== undefined)
    ) {
      const currentProviderId =
        providerId ||
        lifeProviders?.[defaultOption || 0]?.id ||
        noneLifeProviders?.[defaultOption || 0]?.id;
      if (currentProviderId) {
        setData("currentProviderId", currentProviderId);
      }
    }
  }, [providerId, lifeProviders, noneLifeProviders]);

  const listData = useMemo(
    () =>
      transformToOptions(
        lifeProviders || noneLifeProviders,
        "provider_name",
        "id"
      ),
    [lifeProviders, noneLifeProviders]
  );
  return (
    <SelectField
      control={control}
      name={name}
      options={listData}
      defaultSelectedKeys={
        defaultOption !== undefined &&
        listData &&
        listData[defaultOption]?.value
          ? listData[defaultOption]?.value
          : undefined
      }
      label={label}
      isRequired={isRequired}
      placeholder={placeholder}
    />
  );
}
