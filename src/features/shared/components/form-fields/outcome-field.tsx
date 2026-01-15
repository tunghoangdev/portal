import {
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { type InputProps } from "~/components/ui";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { transformToOptions } from "~/hooks";
import { AutocompleteField } from "./auto-complete-field";
import { useCrud } from "~/hooks/use-crud-v2";

interface FieldProps<TFormValues extends FieldValues>
  extends Omit<InputProps, "name" | "ref"> {
  name: Path<TFormValues>;
  control: Control<TFormValues>;
  formMethods?: UseFormReturn<TFormValues>;
  defaultOption?: number;
  label?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export function OutcomeField<TFormValues extends FieldValues>({
  name,
  control,
  defaultOption,
  label,
  isRequired,
  isDisabled,
  placeholder,
}: FieldProps<TFormValues>) {
  const parentName = useWatch({
    control,
    name: "outcome_name_parent" as any,
  });
  // const { incomeList } = useCommon();
  const { getAll } = useCrud(
    [API_ENDPOINTS.dic.outcome, parentName],
    {
      endpoint: "",
      outcome_name_parent: parentName,
      // data: { income_name_parent: parentName },
    },
    {
      enabled: !!parentName,
    }
  );
  const { data, isFetching }: any = getAll();
  const listData = transformToOptions(data || [], "outcome_name");
  return (
    <AutocompleteField
      name={name}
      control={control}
      label={label}
      options={listData}
      isRequired={isRequired}
      placeholder={isFetching ? "Đang tải" : placeholder}
      defaultSelectedKey={
        defaultOption !== undefined &&
        listData &&
        listData[defaultOption]?.value
          ? listData[defaultOption]?.value
          : undefined
      }
      isDisabled={isDisabled}
    />
    // <SelectField
    //   control={control}
    //   name={name}
    //   options={listData}
    //   defaultSelectedKeys={
    //     defaultOption !== undefined &&
    //     listData &&
    //     listData[defaultOption]?.value
    //       ? listData[defaultOption]?.value
    //       : undefined
    //   }
    //   label={label}
    //   isRequired={isRequired}
    //   placeholder={isFetching ? "Đang tải..." : placeholder}
    // />
  );
}
