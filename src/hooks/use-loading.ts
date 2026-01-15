import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';
import { useLoadingStore } from '~/stores';

export const useLoading = () => {
	// const location = useLocation(); const pathname = location.pathname;
	// const { setLoading, setProgress, resetLoading } = useLoadingStore();
	// useEffect(() => {
	// 	let interval: NodeJS.Timeout;
	// 	setLoading("page");
	// 	setProgress(10);
	// 	// Giả lập tăng dần phần trăm giống NProgress
	// 	interval = setInterval(() => {
	// 		setProgress((prev: any) => {
	// 			const next = prev + Math.random() * 10;
	// 			return next < 90 ? next : 90;
	// 		});
	// 	}, 200);
	// 	const done = () => {
	// 		clearInterval(interval);
	// 		setProgress(100);
	// 		setTimeout(() => resetLoading(), 500); // Delay cho người dùng thấy 100%
	// 	};
	// 	// Gọi done() sau 800ms (giả lập tải xong)
	// 	const finishTimeout = setTimeout(done, 800);
	// 	return () => {
	// 		clearInterval(interval);
	// 		clearTimeout(finishTimeout);
	// 	};
	// }, [pathname]);
	return {};
};
