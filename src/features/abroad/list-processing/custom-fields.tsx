import { NumberField } from "~/features/shared/components/form-fields";
import { useWatch } from "react-hook-form";

export const FeeField = (props: any) => {
  const { control, name } = props;
  const productFieldName = name.replace(".fee", ".id_abroad_product");

  const productId = useWatch({
    control,
    name: productFieldName,
  });

  const isDisabled = !!productId || props.isDisabled;

  return <NumberField {...props} isDisabled={isDisabled} />;
};
