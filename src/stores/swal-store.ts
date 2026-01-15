import { create } from 'zustand';
import Swal, {
	type SweetAlertIcon,
	type SweetAlertPosition,
	type SweetAlertResult,
} from 'sweetalert2';

// Mixin dùng chung cho alert/confirm
const BaseSwal = Swal.mixin({
	customClass: {
		confirmButton: 'swal2-confirm-button',
		cancelButton: 'swal2-cancel-button',
	},
	buttonsStyling: false,
	// confirmButtonColor: "#2563eb",
	// cancelButtonColor: "#d1d5db",
	// background: "#fff",
});

// Mixin riêng cho Toast
const ToastSwal = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar: true,
	customClass: {
		popup: 'swal2-toast',
	},
});

type AlertOptions = {
	title: string;
	text?: string;
	html?: string;
	icon?: SweetAlertIcon;
	customClass?: any;
	confirmButtonText?: string;
	cancelButtonText?: string;
	showCancelButton?: boolean;
	allowOutsideClick?: boolean;
	timer?: number;
};

type ToastOptions = {
	title: string;
	icon?: SweetAlertIcon;
	position?: SweetAlertPosition;
	timer?: number;
};

type SwalStore = {
	alert: (options: AlertOptions) => Promise<SweetAlertResult>;
	confirm: (options: AlertOptions) => Promise<SweetAlertResult>;
	toast: (options: ToastOptions) => void;
	loading: (title?: string) => void;
	close: () => void;
};

export const useSwalStore = create<SwalStore>((set, get) => ({
	alert: ({
		title,
		text,
		icon = 'info',
		confirmButtonText = 'OK',
		allowOutsideClick = true,
		timer,
	}) => {
		return BaseSwal.fire({
			title,
			text,
			icon,
			confirmButtonText,
			allowOutsideClick,
			timer,
		});
	},

	confirm: async ({
		title,
		html,
		text,
		icon = 'warning',
		confirmButtonText = 'Xác nhận',
		cancelButtonText = 'Hủy',
		showCancelButton = true,
		allowOutsideClick = false,
		customClass,
	}) => {
		return await BaseSwal.fire({
			title,
			html,
			text: html ? undefined : text,
			icon,
			confirmButtonText,
			cancelButtonText,
			showCancelButton,
			allowOutsideClick,
		});
	},

	toast: ({ title, icon = 'success', position = 'top-end', timer = 3000 }) => {
		ToastSwal.fire({
			title,
			icon,
			position,
			timer,
		});
	},

	loading: (title = 'Đang xử lý...') => {
		BaseSwal.fire({
			title,
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			},
		});
	},

	close: () => {
		Swal.close();
	},
}));
