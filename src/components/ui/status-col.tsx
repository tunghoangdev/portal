import { Chip, cn } from "@heroui/react";
import React, { type ReactNode } from "react";
import { Icons } from "../icons";
interface StatusColumnProps {
  id: number;
  name: string;
  selector?: string;
  className?: string;
}
const statusVariants: any = {
  1: {
    color: "text-warning-600 border-warning-600",
    icon: (
      <Icons.loader size={12} strokeWidth={1} className="text-warning-600" />
    ),
  },
  2: {
    color: "text-success border-success",
    icon: (
      <Icons.circleCheck
        size={14}
        className="text-success fill-success stroke-white"
      />
    ),
  },
  3: {
    color: "text-info border-info",
    icon: <Icons.circleHelp size={12} strokeWidth={1} className="text-info" />,
  },
  4: {
    color: "text-info border-info",
    icon: <Icons.circleHelp size={12} strokeWidth={1} className="text-info" />,
  },
};
export default function StatusColumn({
  id,
  name,
  className,
}: StatusColumnProps) {
  return (
    <Chip
      size="sm"
      radius="md"
      className={cn(
        "text-xs border font-semibold text-[#737373]",
        // statusVariants?.[id]?.color,
        className
      )}
      variant="bordered"
      startContent={statusVariants?.[id]?.icon}
    >
      {name}
    </Chip>
  );
}
