import { Icons } from '~/components/icons';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Tooltip,
} from '@heroui/react';
import React, { useEffect, useMemo, useState } from 'react';

export function ColumnVisibilityToggle({ columns }: { columns: any[] }) {
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([]));
	const toggleableColumns = useMemo(
		() => columns.filter((col) => col.getCanHide?.()),
		[columns],
	);

	useEffect(() => {
		setSelectedKeys(
			new Set(
				toggleableColumns
					.filter((col) => col.getIsVisible())
					.map((col) => col.id),
			),
		);
	}, [toggleableColumns]);
	const handleSelectionChange = (keys: Set<string>) => {
		toggleableColumns.forEach((col) => {
			col.toggleVisibility(keys.has(col.id));
		});
		setSelectedKeys(keys);
	};
	const getTriggerLabel = () => {
		return (
			<Tooltip content="Chọn cột hiển thị">
				<Icons.columns3Cog size={16} />
			</Tooltip>
		);
	};
	return (
		<Dropdown>
			<DropdownTrigger>
				<Icons.columns3Cog size={18} />
				{/* <Tooltip content="Chọn cột hiển thị">
					<Icons.columns3Cog size={16} />
				</Tooltip> */}
			</DropdownTrigger>
			<DropdownMenu
				disallowEmptySelection
				aria-label="Chọn cột hiển thị"
				closeOnSelect={false}
				selectedKeys={selectedKeys}
				selectionMode="multiple"
				variant="flat"
				onSelectionChange={(keys: any) => handleSelectionChange(keys)}
			>
				{toggleableColumns.map((col: any) => (
					<DropdownItem key={col.id}>
						{col.columnDef.header as string}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
