
import { cn } from '~/lib/utils';
import { useEffect, useState } from 'react';
import { Icons } from '../icons';
import { useCommon } from '~/hooks';
import { useCommonStore } from '~/stores';

const TreeNode = ({ node, onNodeClick, allNodesOpen, idForm }: any) => {
	const [isOpen, setIsOpen] = useState(allNodesOpen || false);
	const hasChildren = node.children && node.children.length > 0;
	const { selectedFormId } = useCommon();
	const { setData } = useCommonStore();
	// Sử dụng useEffect để cập nhật trạng thái isOpen khi allNodesOpen thay đổi
	useEffect(() => {
		// Chỉ cập nhật nếu allNodesOpen không phải là undefined (tức là khi nút Mở/Đóng tất cả được click)
		if (allNodesOpen !== undefined) {
			setIsOpen(allNodesOpen);
		}
	}, [allNodesOpen]);
	// useEffect để cập nhật trạng thái mở khi selectedFormId thay đổi
	// Điều này giúp đảm bảo khi một node con được chọn, các node cha của nó cũng được mở ra.
	useEffect(() => {
		if (selectedFormId && node.children) {
			// Chỉ áp dụng cho các node có con (thư mục)
			const isParentOfSelected = node.children.some((child: any) => {
				// Kiểm tra xem node hiện tại có phải là cha của node được chọn không
				return (
					child.id === selectedFormId ||
					(child.children && checkChildrenForSelected(child, selectedFormId))
				);
			});
			if (isParentOfSelected) {
				setIsOpen(true);
			}
		}
	}, [selectedFormId, node.children]);

	const checkChildrenForSelected = (currentNode: any, targetId: string) => {
		if (!currentNode.children) return false;
		return currentNode.children.some((child: any) => {
			return (
				child.id === targetId ||
				(child.children && checkChildrenForSelected(child, targetId))
			);
		});
	};

	const toggleOpen = (event: any) => {
		// Ngăn chặn sự kiện nổi bọt lên parent element
		event.stopPropagation();
		// Chỉ thay đổi trạng thái khi allNodesOpen không được gán (nghĩa là không phải từ nút Mở/Đóng tất cả)
		// Hoặc nếu allNodesOpen đang true/false nhưng người dùng muốn tự điều khiển
		if (hasChildren) {
			// Chỉ mở/đóng nếu có children
			setIsOpen((prev: boolean) => !prev);
		}
	};

	const handleNameClick = (event: any) => {
		event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền
		if (onNodeClick) {
			if (!hasChildren) {
				setData('selectedFormId', node?.id);
				onNodeClick(node);
			}
		}
	};
	return (
		<div className="ml-4">
			<div
				className={cn('flex items-center py-1', {
					'border-l border-gray-300 relative before:absolute before:w-2 before:h-px before:left-0 before:bg-gray-300 pl-3.5':
						!hasChildren,
				})}
			>
				{hasChildren && (
					<span
						className="text-black mr-2 cursor-pointer text-xs border bg-white"
						onClick={toggleOpen}
					>
						{isOpen ? (
							<Icons.remove size={14} strokeWidth={1} />
						) : (
							<Icons.add size={14} strokeWidth={1} />
						)}
					</span>
				)}
				<span
					className={`${
						hasChildren ? 'font-bold' : 'font-medium'
					} text-gray-800 cursor-pointer hover:text-blue-600 flex-grow text-xs ${
						selectedFormId && selectedFormId === node.id && !hasChildren
							? 'text-[13px] !text-blue-600 font-semibold'
							: ''
					}`}
					onClick={hasChildren ? toggleOpen : handleNameClick}
				>
					{node.name}
				</span>
			</div>
			{isOpen && hasChildren && (
				<div className="pl-4 border-l border-gray-300">
					{node.children.map((childNode: any) => (
						<TreeNode
							key={childNode.id}
							node={childNode}
							onNodeClick={onNodeClick}
							allNodesOpen={allNodesOpen}
						/>
					))}
				</div>
			)}
		</div>
	);
};
const TreeView = ({ data, onNodeClick, expandAll, idForm, className }: any) => {
	const [allNodesOpen, setAllNodesOpen] = useState(expandAll || false);

	const toggleAllNodes = (open: any) => {
		setAllNodesOpen(open);
	};
	return (
		<div className={className}>
			{/* <div className="flex justify-between mb-4 space-x-2">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={() => toggleAllNodes(true)}
        >
          Mở tất cả
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={() => toggleAllNodes(false)}
        >
          Đóng tất cả
        </button>
      </div> */}
			{data.map((node: any) => (
				<TreeNode
					key={node.id}
					node={node}
					onNodeClick={onNodeClick}
					allNodesOpen={allNodesOpen}
					idForm={idForm}
				/>
			))}
		</div>
	);
};
export { TreeView, TreeNode };
