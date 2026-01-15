import { cn } from '~/lib/utils';

/**
 * Map cấp độ → class Tailwind
 * Dễ mở rộng và đọc hơn so với switch-case
 */
const LEVEL_BADGE_STYLES: Record<number, string> = {
	1: 'bg-[#0C318C] shadow-sm',
	2: 'bg-[#3180FF] shadow-md',
	3: 'bg-[#FC7E7E] shadow-md',
	4: 'bg-[#C13665] shadow-lg',
	5: 'bg-[#D65C27] shadow-lg',
	6: 'bg-[#FA872A] shadow-xl',
	7: 'bg-[#FC4949] shadow-xl ring-2 ring-orange-300',
	8: 'bg-[#AF2C2C] shadow-2xl ring-2 ring-black-300',
};

export const getBadgeStyle = (id?: number) =>
	LEVEL_BADGE_STYLES[id || 0] || 'bg-blue-500';

interface LevelCellProps {
	data?: any;
	levelIdKey?: string;
	levelCodeKey?: string;
	levelId?: number;
	levelCode?: string;
	className?: string;
}

/**
 * ✅ React component
 */
const LevelCell = ({
	data,
	levelIdKey = 'id_agent_level',
	levelCodeKey = 'agent_level_code',
	levelId,
	levelCode,
	className,
}: LevelCellProps) => {
	const id = levelId ?? data?.[levelIdKey];
	const code = levelCode ?? data?.[levelCodeKey];
	if (!id || !code) return null;

	return (
		<span
			className={cn(
				'inline-flex items-center px-1 md:px-1.5 rounded-full text-[9px] md:text-[11px] font-semibold text-white',
				getBadgeStyle(id),
				className,
			)}
			translate="no"
		>
			{code}
		</span>
	);
};
const PermissionCell = ({ row }: any) => {
	const permissions = row?.permissions;
	if (permissions) return null;
	return (
		<div className="flex gap-2 flex-wrap">
			{row?.permissions?.map((item: any, index: number) => (
				<LevelCell
					data={row}
					levelId={+item.id}
					levelCode={item.level_code}
					key={index}
				/>
			))}
		</div>
	);
};
LevelCell.displayName = 'LevelCell';
PermissionCell.displayName = 'PermissionCell';

const LevelRevoCell = (h: any, { model, props }: any) => {
	const {
		levelIdKey = 'id_agent_level',
		levelCodeKey = 'agent_level_code',
		className,
	} = props || {};

	const id = model?.[levelIdKey];
	const code = model?.[levelCodeKey];
	if (!id || !code) return null;

	return h(
		'span',
		{
			class: `inline-flex items-center px-1 md:px-1.5 rounded-full text-[9px] md:text-[11px] font-semibold text-white ${getBadgeStyle(
				id,
			)} ${className || ''}`,
			translate: 'no',
		},
		code,
	);
};
const PermissionRevoCell = (h: any, { model, props }: any) => {
	const permissions = model?.permissions;
	if (!Array.isArray(permissions) || permissions.length === 0) {
		return null;
	}
	return h(
		'div',
		{
			class: 'flex gap-1 md:gap-x-2 md:gap-y-1 flex-wrap items-center my-1.5',
		},
		permissions.map((item: any) =>
			LevelRevoCell(h, {
				model: {
					[props.levelIdKey || 'id_agent_level']: item.id,
					[props.levelCodeKey || 'agent_level_code']: item.level_code,
				},
				props: {
					...props,
					className: 'mb-[2px]',
				},
			}),
		),
	);
};
export { LevelCell, LevelRevoCell, PermissionCell, PermissionRevoCell };
