import { Card, CardBody, CardHeader } from "@/components/ui";
import { Radio, RadioGroup } from "@heroui/react";
const FormAccess = ({ isEdit, isAccessForm, handleAccessForm }: any) => {
  return (
    <>
      <Card
        className="mb-4 mt-2"
        radius="sm"
        shadow="none"
        classNames={{
          base: "bg-default/20",
          header: "text-sm font-semibold text-black py-2.5",
        }}
      >
        <CardHeader>Quyền truy cập</CardHeader>
        <CardBody>
          <RadioGroup
            name="permission-access"
            // color="primary"
            isDisabled={!isEdit}
            value={isAccessForm ? "allow" : "deny"}
            orientation="horizontal"
            onChange={() => isEdit && handleAccessForm(!isAccessForm)}
            // label="Quyền truy cập"
          >
            <Radio value="allow" size="sm">
              Được truy cập
            </Radio>
            <Radio value="deny" size="sm">
              Không được truy cập
            </Radio>
          </RadioGroup>
        </CardBody>
      </Card>
    </>
  );
};

export default FormAccess;
