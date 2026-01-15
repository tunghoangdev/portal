import { cn } from "~/lib/utils";
interface Iprops {
    className?: string;
    company?: string;
}
export const CompanyName = ({ className, company }: Iprops) => {
	return <div>
        	<span className={cn("text-3xl text-secondary font-bold whitespace-nowrap inline-flex items-center", className)}>
					{company?.slice(0, 1)?.toUpperCase() || ''}
					<span
						className={cn(
							`text-primary font-semibold inline-block overflow-hidden align-middle ml-1
                            transition-all duration-300 ease-in-out
                            group-data-[state=collapsed]:opacity-0
                            group-data-[state=collapsed]:max-w-0
                            group-data-[state=expanded]:opacity-100
                            group-data-[state=expanded]:max-w-[300px]`,
						)}
					>
						{company?.slice(1) || ''}
					</span>
					{/* <span className="font-bold text-secondary inline-flex group-data-[state=expanded]:ml-2">
						T
					</span> */}
				</span>
    </div>
};