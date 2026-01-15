
import { cn } from '~/lib/utils';

// import { useLoadingStore } from '~/stores';

export default function Loading() {
	return (
		<div className={cn('overlay-loading-datatable')}>
			<div className="main">
				<div className="b">
					<div />
					<div />
					<div />
					<div />
					<div />
				</div>
			</div>
		</div>
	);
	// const { variant, progress } = useLoadingStore();

	// if (variant === 'none') return null;

	// if (variant === 'global' || variant === 'page') {
	// 	return (
	// 		<>
	// 			{/* Thanh progress bar trên cùng */}
	// 			<div className="fixed top-0 left-0 w-full h-1 z-[99999] bg-white/20">
	// 				<div
	// 					className="h-full bg-blue-500 transition-all duration-300"
	// 					style={{ width: `${progress}%` }}
	// 				/>
	// 			</div>

	// 			<div className="fixed inset-0 z-[99998] bg-black/50 flex items-center justify-center">
	// 				<div className="relative flex items-center justify-center w-24 h-24">
	// 					<svg
	// 						className="animate-spin -ml-1 mr-3 h-20 w-20 text-white"
	// 						xmlns="http://www.w3.org/2000/svg"
	// 						fill="none"
	// 						viewBox="0 0 24 24"
	// 					>
	// 						<circle
	// 							className="opacity-25"
	// 							cx="12"
	// 							cy="12"
	// 							r="10"
	// 							stroke="currentColor"
	// 							strokeWidth="4"
	// 						/>
	// 						<path
	// 							className="opacity-75"
	// 							fill="currentColor"
	// 							d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
	// 						/>
	// 					</svg>
	// 					<span className="absolute text-white text-lg font-semibold select-none">
	// 						{Math.floor(progress)}%
	// 					</span>
	// 				</div>
	// 			</div>
	// 		</>
	// 	);
	// }
}
