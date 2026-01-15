import { addHours, format, isAfter, isFuture, subHours } from 'date-fns';
import { vi } from 'date-fns/locale'; // Import locale tiếng Việt
export const formatDateTimeVN = (date: string, fm = 'dd/MM/yyyy HH:mm:ss') =>
	date ? format(new Date(date), fm) : '';
export const formatDate = (date: string, fm = 'dd/MM/yyyy') =>
	date ? format(new Date(date), fm) : '';
export const formatTime = (date: string, fm = 'HH:mm:ss') =>
	date ? format(new Date(date), fm) : '';
export const formatCurrency = (value: any): string => {
	if (value == null || Number.isNaN(value)) return '';
	return Number(value).toLocaleString('vi-VN', {
		style: 'currency',
		currency: 'VND',
		minimumFractionDigits: 0,
	});
};

export const formatNumber = (value: any): string => {
	if (value == null || Number.isNaN(value)) return '';
	return Number(value).toLocaleString('vi');
};
/**
 * Định dạng ngày tháng sang "Thứ N, ngày DD.MM.YYYY" nếu ngày đó chưa tới hạn.
 * Nếu ngày đã qua, có thể trả về một định dạng khác hoặc chuỗi rỗng/null.
 *
 * @param {Date | string | number} dateValue Giá trị ngày tháng đầu vào.
 * @returns {string | null} Chuỗi ngày tháng đã định dạng hoặc null nếu đã qua hạn.
 */
export const formatFutureDate = (dateValue: any) => {
	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) {
		console.warn('Invalid date value provided:', dateValue);
		return null; // Trả về null hoặc một giá trị mặc định nếu ngày không hợp lệ
	}

	if (isFuture(date)) {
		// Định dạng ngày tháng: EEEE là tên đầy đủ của thứ, dd.MM.yyyy là ngày.tháng.năm
		// Sử dụng locale 'vi' để có tên thứ bằng tiếng Việt
		return format(date, "EEEE, 'ngày' dd.MM.yyyy", { locale: vi });
	}
	// Nếu ngày đã qua, bạn có thể trả về null, chuỗi rỗng, hoặc định dạng khác
	return null;
};
/**
 * Kiểm tra trạng thái của một sự kiện: "Đang diễn ra" hoặc "Đã hết hạn".
 *
 * @param {Date | string | number} startDateValue Giá trị ngày tháng bắt đầu của sự kiện.
 * @returns {{status: string, formattedDate: string | null}} Đối tượng chứa trạng thái và ngày định dạng.
 */
export const getEventStatus = (
	startDateValue: Date | string | number,
	showText?: boolean,
) => {
	const startDate = new Date(startDateValue);
	const now = new Date();
	if (Number.isNaN(startDate.getTime())) {
		console.warn('Lỗi ngày tháng đầu vào:', startDateValue);
		return { status: 'Lỗi ngày', formattedDate: null, color: 'danger' };
	}
	const startThreshold = subHours(startDate, 2);
	const endThreshold = addHours(startDate, 2);
	const formattedStartDate = format(startDate, 'EEEE,HH:mm,dd.MM.yyyy', {
		locale: vi,
	});
	// if (!showText) {
	// 	return {
	// 		status: 'Sắp diễn ra',
	// 		formattedDate: formattedStartDate,
	// 	};
	// }
	if (isAfter(now, endThreshold)) {
		return { status: 'Đã kết thúc', formattedDate: formattedStartDate, color: 'danger' };
	}
	if (isAfter(now, startDate)) {
		return { status: 'Đang diễn ra', formattedDate: formattedStartDate, color: 'success' };
	}
	if (isAfter(now, startThreshold)) {
		return { status: 'Sắp bắt đầu', formattedDate: formattedStartDate, color: 'secondary' };
	}
	return {
		status: 'Sắp diễn ra',
		formattedDate: formattedStartDate,
	};
};
