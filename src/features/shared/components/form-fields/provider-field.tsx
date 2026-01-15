import { Control, FieldValues, Path } from "react-hook-form";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions } from "~/hooks";
import { useMemo } from "react";
import { AutocompleteField } from "./auto-complete-field";
import { useCrud } from "~/hooks/use-crud-v2";
interface ProviderFieldProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  control: Control<any>;
  defaultOption?: number;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  basePath?: string;
  storeName?: string;
  isDisabled?: boolean;
}

export function ProviderField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  label,
  isRequired,
  placeholder,
  basePath,
  isDisabled,
}: ProviderFieldProps<TFormValues>) {
  const { getAll } = useCrud(
    [basePath || API_ENDPOINTS.dic.lifeProvider],
    { endpoint: "" },
    { enabled: true }
  );
  const { data: lifeProviders, isFetching }: any = getAll();

  const listData = useMemo(
    () => transformToOptions(lifeProviders, "provider_name", "id"),
    [lifeProviders]
  );

  return (
    <AutocompleteField
      name={name}
      control={control}
      label={label}
      options={listData}
      isRequired={isRequired}
      defaultOption={defaultOption}
      placeholder={isFetching ? "Đang tải" : placeholder}
      isDisabled={isDisabled}
    />
  );
}
