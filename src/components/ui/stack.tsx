import { cn } from "~/lib/utils";
import type {
  BreakPointKey,
  Direction,
  FlexOptions,
  Responsive,
  SxProps,
} from "~/types/css-type";
import {
  Children,
  Fragment,
  type ReactNode,
  forwardRef,
  type HTMLAttributes,
} from "react";

const formatDirection = (val: string) =>
  val && `flex-${val?.replace("column", "col")}`;
interface StackProps extends HTMLAttributes<HTMLDivElement>, FlexOptions {
  direction?: Responsive<Direction>;
  divider?: ReactNode;
  spacing?: number | string;
  sx?: SxProps;
}
const justifyContentMap: Record<string, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  stretch: "justify-stretch",
};

const alignItemsMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
};

const alignSelfMap: Record<string, string> = {
  auto: "self-auto",
  start: "self-start",
  end: "self-end",
  center: "self-center",
  stretch: "self-stretch",
  baseline: "self-baseline",
};

function convertFlexOptionsToTailwind(options: FlexOptions): string {
  const breakpoints: BreakPointKey[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
  let classes: string[] = [];
  function processResponsive<T>(
    value: Responsive<T> | undefined | any,
    map: Record<string, string>
  ) {
    if (!value) return;
    if (typeof value === "string") {
      classes.push(map[value]);
    } else if (typeof value === "object") {
      for (const bp of breakpoints) {
        if (value[bp]) {
          ["xs", "sm"].includes(bp)
            ? classes.push(map[value[bp] as string])
            : classes.push(`${bp}:${map[value[bp] as string]}`);
        }
      }
    } else {
      classes.push(map[value]);
    }
  }

  processResponsive(options.justifyContent, justifyContentMap);
  processResponsive(options.alignItems, alignItemsMap);
  processResponsive(options.alignSelf, alignSelfMap);

  return classes.join(" ");
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction,
      divider,
      spacing,
      children,
      alignItems,
      alignSelf,
      justifyContent,
      sx,
      ...rest
    },
    ref
  ) => {
    const breakpoints: BreakPointKey[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
    const responsiveDirection =
      typeof direction === "object"
        ? breakpoints
            .filter((bp) => direction[bp])
            .map((bp) =>
              ["xs", "sm"].includes(bp)
                ? formatDirection(direction?.[bp] as string)
                : `${bp}:${formatDirection(direction?.[bp] as string)}`
            )
            .join(" ")
        : formatDirection(direction || "");

    return (
      <div
        className={cn(
          "flex",
          spacing &&
            `gap-${typeof spacing === "number" ? spacing * 2 : spacing}`,
          responsiveDirection,
          convertFlexOptionsToTailwind({
            alignItems,
            alignSelf,
            justifyContent,
          }),

          className
        )}
        ref={ref}
        {...rest}
      >
        {divider
          ? Children.toArray(children).map((child, index: number, arr) => (
              <Fragment key={index}>
                {child}
                {index < arr.length - 1 && divider}
              </Fragment>
            ))
          : children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

export { Stack };
