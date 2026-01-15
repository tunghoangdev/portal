import { Icons } from "~/components/icons";
import { Button } from "~/components/ui";
import { UserCell } from "~/features/shared/components/cells";
import { cn } from "~/lib/utils";

export const TreeNode = ({ node, level, onExpand, onClickNode }: any) => {
  const handleExpandClick = (e: any) => {
    e.stopPropagation();
    onExpand(node);
  };

  const handleNodeClick = (e: any) => {
    e.stopPropagation();
    onClickNode?.(node);
  };

  return (
    <div className="relative select-none flex flex-col gap-y-2.5">
      {/* --- Đường nối từ node cha đến node hiện tại --- */}
      {level > 0 && (
        <span
          className="absolute left-[12px] top-0 bottom-0 border-l border-gray-300"
          style={{
            height: "100%",
          }}
        />
      )}

      {/* --- Nội dung node --- */}
      <div
        className={cn(
          "flex gap-x-2.5 items-center p-2 rounded-md transition-colors duration-200 hover:bg-gray-50 cursor-pointer relative",
          node.isLoading && "opacity-50"
        )}
        style={{ paddingLeft: level === 0 ? 0 : 40 }}
      >
        {/* Đường ngang nối node này với line dọc */}
        {level > 0 && (
          <span
            className={cn(
              "absolute left-[12px] top-1/2 w-6 border-t border-gray-300 -translate-y-1/2"
            )}
          />
        )}

        {/* Icon expand/collapse */}
        {node.is_has_child ? (
          <Button
            isIconOnly
            // onClick={handleExpandClick}
            className="size-4 min-w-0 w-auto min-h-0 h-auto px-0"
            radius="full"
            variant="light"
            disableRipple
          >
            <Icons.chevronRight
              size={18}
              className={cn(
                "text-secondary transition-transform",
                node.isExpanded ? "rotate-90" : ""
              )}
            />
          </Button>
        ) : (
          <div className="size-4 flex items-center justify-center">
            <Icons.circle size={10} className="text-default-600" />
          </div>
        )}

        {/* Avatar + info */}
        <div
          className="flex items-center cursor-pointer"
          // onClick={handleNodeClick}
          onClick={handleExpandClick}
        >
          <UserCell
            data={node}
            nameKey="agent_name"
            avatarKey="agent_avatar"
            levelIdKey="id_agent_level"
            levelCodeKey="agent_level_code"
            showLevel
            isLocked={node.is_lock}
            allChild={node.child_all || 0}
          />
        </div>
      </div>

      {/* --- Render children --- */}
      {node.isExpanded && node.children?.length > 0 && (
        <div className="relative pl-6">
          {node.children.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onExpand={onExpand}
              onClickNode={onClickNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
