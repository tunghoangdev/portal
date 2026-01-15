import type { PressEvent } from "@heroui/react";
import { Icons } from "../icons";
import { Button } from "./button";
import type { MouseEventHandler, ReactNode } from "react";
interface ActionButtonProps {
	action: "edit" | "delete" | "view" | "add";
	onPress?: (event: PressEvent) => void;
	className?: string;
	isOnlyIcon?: boolean;
	label?: string;
	children?: ReactNode;
}
export default function ActionButton({
	action,
	onPress,
	className,
	isOnlyIcon,
	label,
	children,
}: ActionButtonProps) {
	let icon: ReactNode;
	let title: string;
	let color: any;
	switch (action) {
		case "edit":
			icon = <Icons.edit size={16} />;
			color = "primary";
			title = "Chỉnh sửa";
			break;
		case "delete":
			icon = <Icons.trash size={16} />;
			color = "danger";
			title = "Xóa";
			break;
		case "view":
			icon = <Icons.eye size={16} />;
			color = "default";
			title = "Xem chi tiết";
			break;
		case "add":
			icon = <Icons.add size={18} />;
			color = "primary";
			title = "Thêm mới";
			break;
		default:
			throw new Error(`Unknown action: ${action}`);
	}

	return (
		<Button
			color={color}
			onPress={onPress}
			startContent={icon && !isOnlyIcon ? icon : undefined}
			className={className}
			variant="solid"
			size="sm"
			radius="sm"
		>
			{children || (icon && isOnlyIcon) ? icon : label || title}
		</Button>
	);
}
