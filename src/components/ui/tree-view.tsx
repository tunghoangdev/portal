import React, { useState, useCallback, useMemo, FC } from 'react';

/**
 * Reusable TreeView component
 * - Single-file React component (TypeScript)
 * - Uses Tailwind classes for quick styling (no external icons required)
 * - Supports controlled or uncontrolled open state
 * - Supports custom icons and custom node renderer
 *
 * Usage:
 * <TreeView
 *   data={treeData}
 *   defaultOpenKeys={["1"]}
 *   onToggle={(key, open) => console.log(key, open)}
 *   multiOpen={true}
 *   renderLabel={(node) => <span>{node.label}</span>}
 * />
 */

// -----------------------------
// Types
// -----------------------------
type TreeNode = {
	id: string;
	label: React.ReactNode;
	children?: TreeNode[];
	icon?: React.ReactNode; // optional per-node icon
	disabled?: boolean;
};

export type TreeViewProps = {
	data: TreeNode[]; // root nodes
	className?: string;
	defaultOpenKeys?: string[]; // for uncontrolled
	openKeys?: string[]; // for controlled
	onToggle?: (id: string, open: boolean) => void;
	multiOpen?: boolean; // allow multiple nodes open at same level
	renderLabel?: (node: TreeNode) => React.ReactNode; // custom label renderer
	renderIcon?: (node: TreeNode, open: boolean) => React.ReactNode; // default icon renderer
	indent?: number; // px indent per level
};

// -----------------------------
// Default Icons (SVGs)
// -----------------------------
const CaretRight: React.FC<{ className?: string }> = ({ className }) => (
	<svg
		className={`w-4 h-4 transform ${className || ''}`}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M7 5L13 10L7 15V5Z" fill="currentColor" />
	</svg>
);

const FileIcon: FC = () => (
	<svg
		className="w-4 h-4"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14 3H6C4.895 3 4 3.895 4 5V19C4 20.105 4.895 21 6 21H18C19.105 21 20 20.105 20 19V9L14 3Z"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

// -----------------------------
// Utility to flatten tree keys for performance
// -----------------------------
const collectAllKeys = (nodes: TreeNode[]) => {
	const keys: string[] = [];
	const walk = (arr?: TreeNode[]) => {
		if (!arr) return;
		for (const n of arr) {
			keys.push(n.id);
			if (n.children) walk(n.children);
		}
	};
	walk(nodes);
	return keys;
};

// -----------------------------
// TreeView Component
// -----------------------------
export const TreeView2: FC<TreeViewProps> = ({
	data,
	className = '',
	defaultOpenKeys = [],
	openKeys,
	onToggle,
	multiOpen = true,
	renderLabel,
	renderIcon,
	indent = 12,
}) => {
	// uncontrolled state when openKeys is not provided
	const isControlled = openKeys !== undefined;
	const [internalOpen, setInternalOpen] = useState<Record<string, boolean>>(
		() => {
			const map: Record<string, boolean> = {};
			for (const k of defaultOpenKeys) map[k] = true;
			return map;
		},
	);

	const allKeys = useMemo(() => collectAllKeys(data), [data]);

	const isOpen = useCallback(
		(id: string) => {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			if (isControlled) return openKeys!.includes(id);
			return !!internalOpen[id];
		},
		[isControlled, openKeys, internalOpen],
	);

	const toggle = useCallback(
		(id: string) => {
			const currentlyOpen = isOpen(id);
			const nextOpen = !currentlyOpen;

			if (isControlled) {
				onToggle?.(id, nextOpen);
				return;
			}

			setInternalOpen((prev) => {
				// If multiOpen is false, we close other siblings at same level.
				if (!multiOpen && nextOpen) {
					// We will keep only this key open and preserve other opens that are descendants
					const next: Record<string, boolean> = {};
					next[id] = true;
					return next;
				}
				return { ...prev, [id]: nextOpen };
			});

			onToggle?.(id, nextOpen);
		},
		[isOpen, isControlled, onToggle, multiOpen],
	);

	// Default icon renderer
	const defaultRenderIcon = useCallback((node: TreeNode, open: boolean) => {
		if (node.children && node.children.length > 0) {
			return <CaretRight className={open ? 'rotate-90' : 'rotate-0'} />;
		}
		return <FileIcon />;
	}, []);

	// Recursive node render
	const Node: React.FC<{ node: TreeNode; level: number }> = ({
		node,
		level,
	}) => {
		const open = isOpen(node.id);

		return (
			<div>
				<div
					className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-100 cursor-pointer select-none ${node.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}`}
					role="treeitem"
					aria-expanded={
						node.children && node.children.length > 0 ? open : undefined
					}
					onClick={() => !node.disabled && toggle(node.id)}
					style={{ paddingLeft: level * indent }}
				>
					<div className="flex items-center justify-center w-5 h-5">
						{renderIcon
							? renderIcon(node, open)
							: defaultRenderIcon(node, open)}
					</div>

					<div className="flex-1 text-sm">
						{renderLabel ? renderLabel(node) : node.label}
					</div>
				</div>

				{node.children && node.children.length > 0 && (
					<div
						className={`ml-0 overflow-hidden ${open ? 'block' : 'hidden'}`}
						// biome-ignore lint/a11y/useSemanticElements: <explanation>
						role="group"
					>
						{node.children.map((child) => (
							<Node key={child.id} node={child} level={level + 1} />
						))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div
			className={`w-full ${className}`}
			role="tree"
			aria-multiselectable={multiOpen}
		>
			{data.map((node) => (
				<Node key={node.id} node={node} level={0} />
			))}
		</div>
	);
};

// -----------------------------
// Example usage (copy into your app):
// -----------------------------
/*
import TreeView, { TreeNode } from './TreeView'

const treeData: TreeNode[] = [
  {
    id: '1',
    label: 'Fruits',
    children: [
      { id: '1-1', label: 'Apple' },
      { id: '1-2', label: 'Orange' },
      { id: '1-3', label: 'Banana' },
    ],
  },
  {
    id: '2',
    label: 'Vegetables',
    children: [
      { id: '2-1', label: 'Carrot' },
      {
        id: '2-2',
        label: 'Leafy',
        children: [
          { id: '2-2-1', label: 'Lettuce' },
          { id: '2-2-2', label: 'Spinach' },
        ],
      },
    ],
  },
]

function App() {
  return (
    <div className="p-4">
      <TreeView data={treeData} defaultOpenKeys={["1"]} />
    </div>
  )
}
*/
