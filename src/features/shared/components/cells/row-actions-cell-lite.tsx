import { hIcon, IconStatic } from "~/components/icons";
import { useRowActionsDropdown } from "~/hooks";
export const RowActionRevoCell = (h: any, { model, props }: any) => {
  return h(
    "div",
    {
      class: "flex items-center justify-center h-full relative w-full",
    },
    [
      h(
        "button",
        {
          class:
            "mx-auto p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-center text-lg font-semibold text-gray-500 dark:text-gray-400",
          onclick: (e: MouseEvent) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            useRowActionsDropdown
              .getState()
              .openDropdown(
                { x: rect.right - 50, y: rect.bottom - 40 },
                model,
                {
                  actions: props.actions,
                  customActions: props.customActions,
                  onAction: props.onAction,
                }
              );
          },
        },
        hIcon(IconStatic.more_vertical, {
          size: 20,
          className: "text-secondary",
        })
      ),
    ]
  );
};
