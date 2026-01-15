import { getFullFtpUrl } from '~/lib/auth';
import { Tooltip } from '@heroui/react';
import { Icons } from '~/components/icons';
import { getBadgeStyle, LevelCell } from './level-cell';
import { Stack, Typography, MyImage, cloudinaryUrl } from '~/components/ui';
import { cn } from '~/lib/utils';
interface UserCellProps {
  data: any;
  nameKey?: string;
  phoneKey?: string;
  avatarKey?: string;
  levelIdKey?: string;
  levelCodeKey?: string;
  isCheckIdNumber?: boolean;
  showLevel?: boolean;
  hideAvatar?: boolean;
  isLocked?: boolean;
  allChild?: number;
}

const UserCell = ({
  data,
  nameKey = 'agent_name',
  phoneKey = 'agent_phone',
  avatarKey = 'agent_avatar',
  levelCodeKey = 'agent_level_code',
  levelIdKey = 'id_agent_level',
  isCheckIdNumber = false,
  showLevel,
  hideAvatar,
  isLocked,
  allChild,
}: UserCellProps) => {
  const { id_number } = data || {};
  const phone = data?.[phoneKey];
  const name = data?.[nameKey];
  const avatar = data?.[avatarKey];
  const hasCCCD = isCheckIdNumber ? !!id_number : true;
  const isFinan = nameKey === 'finan_name';
  if (!name) return null;
  return (
    <div className="flex items-center gap-2">
      <Stack alignItems={'center'} className="gap-1">
        {!hideAvatar ? (
          <div className="rounded-full bg-default-200 overflow-hidden size-8 relative">
            <MyImage
              src={getFullFtpUrl('avatar', avatar || '')}
              alt={name}
              // fill
              // className="object-cover"
              width={32}
              height={32}
            />
          </div>
        ) : null}

        <div className="flex flex-col">
          <Typography
            variant="body2m"
            className={cn(
              `font-semibold text-[11px] md:text-xs whitespace-normal ${
                !hasCCCD && !isFinan ? 'text-secondary' : 'text-gray-600'
              } ${isLocked && 'text-danger'}`
            )}
          >
            {name}
          </Typography>
          <Typography
            variant="body2r"
            className={cn('text-[10px] md:text-xs text-gray-600')}
          >
            {phone}
            {allChild !== undefined && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
                {allChild}
              </span>
            )}
          </Typography>
        </div>
      </Stack>
      {!isFinan && showLevel && (
        <LevelCell
          data={data}
          levelIdKey={levelIdKey || 'id_agent_level'}
          levelCodeKey={levelCodeKey || 'agent_level_code'}
        />
      )}
      {!hasCCCD && !isFinan && (
        <Tooltip
          content={
            (<div className="px-0.5 py-0.5">
              <span className="text-xs text-red-600 font-medium">
                Thành viên chưa cập nhật CCCD
              </span>
            </div>) as any
          }
          radius="sm"
        >
          <Icons.octagonAlert className="w-5 h-5 text-red-500 animate-pulse cursor-pointer" />
        </Tooltip>
      )}
    </div>
  );
};
UserCell.displayName = 'UserCell';

const UserRevoCell = (h: any, { model, props }: any) => {
  const {
    nameKey = 'agent_name',
    phoneKey = 'agent_phone',
    avatarKey = 'agent_avatar',
    levelIdKey = 'id_agent_level',
    levelCodeKey = 'agent_level_code',
    showLevel,
    hideAvatar,
    isLocked,
    isCheckIdNumber,
    allChildKey = 'allChild',
  } = props || {};

  if (!model) return null;

  const name = model?.[nameKey];
  const phone = model?.[phoneKey];
  const avatar = model?.[avatarKey];
  const levelId = model?.[levelIdKey];
  const levelCode = model?.[levelCodeKey];
  const allChild = model?.[allChildKey] || 0;
  const id_number = model?.id_number;
  const hasCCCD = isCheckIdNumber ? !!id_number : true;

  if (!name) return null;
  const badgeStyle = getBadgeStyle(levelId);
  return h('div', { class: 'flex items-center gap-1 py-1 w-full' }, [
    // Avatar
    !hideAvatar
      ? h(
          'div',
          {
            class:
              'rounded-full bg-default-200 overflow-hidden size-7.5 relative',
          },
          [
            h('img', {
              // src: getFullFtpUrl('avatar', avatar || ''),
              src: cloudinaryUrl(getFullFtpUrl('avatar', avatar || ''), {
                w: 32,
                q: 90,
              }),
              class: 'size-7.5 rounded-full object-cover',
            }),
          ]
        )
      : null,

    // Name + Phone
    h('div', { class: 'flex flex-col min-w-0' }, [
      // Name
      h(
        'div',
        {
          class: `font-semibold text-[11px] md:text-xs truncate whitespace-normal ${
            !hasCCCD
              ? 'text-secondary'
              : isLocked
              ? 'text-danger'
              : 'text-gray-700'
          }`,
          title: name,
        },
        name
      ),
      // Phone + allChild count
      h(
        'div',
        {
          class: 'text-[10px] md:text-xs text-gray-600 flex items-center gap-1',
        },
        [
          phone,
          allChild
            ? h(
                'span',
                {
                  class:
                    'ml-1 px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-medium',
                },
                allChild
              )
            : null,
        ]
      ),
    ]),

    // Level Badge
    showLevel && levelCode
      ? h(
          'span',
          {
            class: `inline-flex items-center px-1 md:px-1.5 rounded-full text-[9px] md:text-[11px] font-semibold text-white ${badgeStyle}`,
          },
          levelCode
        )
      : null,

    // Tooltip alert (hover CCCD thiếu)
    !hasCCCD
      ? h(
          'div',
          {
            class: 'relative group',
          },
          [
            h('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              class:
                'w-4 h-4 text-red-500 animate-pulse cursor-pointer group-hover:text-red-700',
              innerHTML:
                '<path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 12a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 12 14zm1-7h-2v5h2V7z" />',
            }),
            h(
              'div',
              {
                class:
                  'absolute hidden group-hover:block bg-white border border-red-200 shadow-md p-1 rounded text-xs text-red-600 -top-7 left-0 whitespace-nowrap z-50',
              },
              'Thành viên chưa cập nhật CCCD'
            ),
          ]
        )
      : null,
  ]);
};
export { UserCell, UserRevoCell };
