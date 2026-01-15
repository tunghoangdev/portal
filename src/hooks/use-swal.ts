import { useSwalStore } from "~/stores";
import type { SweetAlertPosition } from "sweetalert2";

export const useSwal = () => {
	const toastFn = useSwalStore((s: any) => s.toast);
	const alert = useSwalStore((s: any) => s.alert);
	const confirm = useSwalStore((s: any) => s.confirm);
	const loading = useSwalStore((s: any) => s.loading);
	const close = useSwalStore((s: any) => s.close);

	const toast = {
		success: (title: string, position?: SweetAlertPosition, timer?: number) =>
			toastFn({ title, icon: "success", position, timer }),
		error: (title: string, position?: SweetAlertPosition, timer?: number) =>
			toastFn({ title, icon: "error", position, timer }),
		info: (title: string, position?: SweetAlertPosition, timer?: number) =>
			toastFn({ title, icon: "info", position, timer }),
		warning: (title: string, position?: SweetAlertPosition, timer?: number) =>
			toastFn({ title, icon: "warning", position, timer }),
		custom: toastFn,
	};

	return { alert, confirm, toast, loading, close };
};
