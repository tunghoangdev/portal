import { cn } from '~/lib/utils';

interface LogoTextProps {
	className?: string;
}
export const LogoText = ({ className }: LogoTextProps) => {
	return (
		<span
			className={cn(
				'text-4xl text-primary font-semibold whitespace-nowrap inline-flex items-center mx-auto',
				className,
			)}
		>
			Portal
			<span className="font-bold text-secondary inline-flex group-data-[state=expanded]:ml-2">
				X
			</span>
		</span>
	);
};
