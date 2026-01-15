import {
  DateRangePickerProps,
  RadioGroup,
  Radio,
  ButtonGroup,
  Button,
  cn,
  DateRangePicker,
} from "@heroui/react";
import {
  startOfWeek,
  startOfMonth,
  getLocalTimeZone,
  today,
  endOfWeek,
  endOfMonth,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { useState } from "react";
interface Props extends DateRangePickerProps {}
export default function DateRangePickerCustom(props: Props) {
  const { onChange, value, variant, ...rest } = props;
  const { locale } = useLocale();
  const [selected, setSelected] = useState("");
  const now = today(getLocalTimeZone());
  const prevWeek = {
    start: startOfWeek(now.subtract({ weeks: 1 }), locale),
    end: endOfWeek(now.subtract({ weeks: 1 }), locale),
  };

  const prevMonth = {
    start: startOfMonth(now.subtract({ months: 1 })),
    end: endOfMonth(now.subtract({ months: 1 })),
  };

  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
            "cursor-pointer rounded-full border-2 border-default-200/60",
            "data-[selected=true]:border-primary"
          ),
          label: "text-tiny text-default-500",
          labelWrapper: "px-1 m-0",
          wrapper: "hidden",
        }}
      >
        {children}
      </Radio>
    );
  };

  return (
    <DateRangePicker
      variant={variant || "bordered"}
      CalendarBottomContent={
        <RadioGroup
          aria-label="Date precision"
          classNames={{
            base: "w-full pb-2",
            wrapper: " py-2.5 px-3 gap-1 flex-nowrap ",
          }}
          orientation="horizontal"
          value={selected}
          onValueChange={(value) => {
            if (onChange) {
              onChange({
                start: today(getLocalTimeZone()).subtract({ days: +value }),
                end: today(getLocalTimeZone()),
              });
            }
            setSelected(value);
          }}
        >
          <CustomRadio value="1">Ngày trước</CustomRadio>
          <CustomRadio value="2">2 ngày trước</CustomRadio>
          <CustomRadio value="3">3 ngày trước</CustomRadio>
          <CustomRadio value="7">7 ngày trước</CustomRadio>
          <CustomRadio value="14">14 ngày trước</CustomRadio>
        </RadioGroup>
      }
      CalendarTopContent={
        <ButtonGroup
          fullWidth
          className="px-3 pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
          radius="full"
          size="sm"
          variant="bordered"
        >
          <Button
            onPress={() => {
              if (onChange) {
                onChange({
                  start: now,
                  end: now,
                });
              }
            }}
          >
            Hôm nay
          </Button>
          <Button
            onPress={() => {
              if (onChange) {
                onChange(prevWeek);
              }
            }}
          >
            Tuần này
          </Button>
          <Button
            onPress={() => {
              if (onChange) {
                onChange(prevMonth);
              }
            }}
          >
            Tháng trước
          </Button>
        </ButtonGroup>
      }
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
