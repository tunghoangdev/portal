import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Chip } from '~/components/ui';
import { cn } from '~/lib/utils';
interface StatusColumnProps {
  id: number;
  name: string;
  selector?: string;
  className?: string;
}

const statusVariants: any = {
  1: {
    color: 'text-warning-600 border-warning-600',
    icon: (
      <Icons.loader size={12} strokeWidth={1} className="text-warning-600" />
    ),
  },
  2: {
    color: 'text-success border-success',
    icon: (
      <Icons.circleCheck
        size={14}
        className="text-success fill-success stroke-white"
      />
    ),
  },
  3: {
    color: 'text-danger border-danger',
    icon: <Icons.warning size={12} strokeWidth={1} className="text-danger" />,
  },
};
const StatusAgentCell = ({ id, name, className }: StatusColumnProps) => {
  return (
    <div className="flex w-full h-full items-center">
      <Chip
        size="sm"
        //   radius="md"
        className={cn(
          ' border font-semibold text-[#737373]',
          statusVariants?.[id]?.color,
          className
        )}
        variant="bordered"
        startContent={statusVariants?.[id]?.icon}
        classNames={{
          base: 'py-px md:py-[3px]',
          content: 'text-[10px] md:text-xs leading-[10px] md:leading-[12px]',
        }}
      >
        {name}
      </Chip>
    </div>
  );
};

StatusAgentCell.displayName = 'StatusAgentCell';

const StatusAgentRevoCell = (h: any, { props }: any) => {
  const id = props?.id ?? props?.status_id ?? 0;
  const name = props?.name ?? props?.status_name ?? '';
  const statusVariants: any = {
    1: {
      color: 'text-warning-600 border-warning-600',
      icon: hIcon(IconStatic.loader, {
        size: 12,
        strokeWidth: 1,
        className: 'text-warning-600',
      }),
    },
    2: {
      color: 'text-success border-success',
      icon: hIcon(IconStatic.circleCheck, {
        size: 14,
        className: 'text-success fill-success stroke-white',
      }),
    },
    3: {
      color: 'text-danger border-danger',
      icon: hIcon(IconStatic.warning, {
        size: 12,
        strokeWidth: 1,
        className: 'text-danger',
      }),
    },
  };

  const variant = statusVariants[id] || {
    color: 'text-default-600 border-default-300',
    icon: null,
  };

  return h(
    'div',
    {
      class: 'flex w-full h-full items-center justify-start',
    },
    [
      h(
        'div',
        {
          class: [
            'flex items-center border text-[#737373] rounded-md px-2 py-[2px] md:py-[3px] gap-1 text-[10px] md:text-xs leading-[10px] md:leading-[12px]',
            variant.color,
          ].join(' '),
        },
        [variant.icon, h('span', {}, name || '')]
      ),
    ]
  );
};
export { StatusAgentCell, StatusAgentRevoCell };
