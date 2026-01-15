export const LoadingDots = () => {
	return (
		<div className="flex space-x-2 justify-center items-center p-4">
			<span className="sr-only">Đang tải...</span>
			<div className="flex space-x-1.5">
				<div className="w-2.5 h-2.5 bg-secondary rounded-full animate-loading-dot-custom" />
				<div
					className="w-2.5 h-2.5 bg-secondary rounded-full animate-loading-dot-custom"
					style={{ animationDelay: '0.1s' }}
				/>
				<div
					className="w-2.5 h-2.5 bg-secondary rounded-full animate-loading-dot-custom"
					style={{ animationDelay: '0.2s' }}
				/>
			</div>
		</div>
	);
};
