import { hIcon, Icons, IconStatic } from '~/components/icons';
import { Stack, Typography } from '~/components/ui';

type IProps = {
  value?: string;
  isHot: boolean;
};
const HotCell = ({ value, isHot }: IProps) => (
  <Stack alignItems={'center'} className="gap-2">
    <Typography variant={'body2r'}>{value}</Typography>
    {isHot && <Icons.star size={12} className="text-warning fill-warning" />}
  </Stack>
);
HotCell.displayName = 'HotCell';

const HotRevoCell = (h: any, { props }: any) => {
  const value = props?.value;
  const isHot = props?.isHot;

  return h(
    'div',
    {
      class: 'flex items-center gap-2',
    },
    [
      h(
        'span',
        {
          class: 'text-xs text-default-700 whitespace-normal line-clamp-2',
        },
        value ?? ''
      ),
      isHot
        ? hIcon(IconStatic.star, {
            size: 12,
            className: 'text-warning fill-warning',
          })
        : null,
    ]
  );
};
export { HotCell, HotRevoCell };
