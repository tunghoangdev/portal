import { ROLES } from '~/constant';
import type { AddressKeys } from '~/types/form-field';
import { format, isValid, parseISO } from 'date-fns';
import {
	CalendarDate,
	getLocalTimeZone,
	parseAbsolute,
	parseDate,
	parseZonedDateTime,
	ZonedDateTime,
} from '@internationalized/date';
import { uid } from 'uid';

// Local Storage Keys
export const LOCAL_STORAGE_USER_DATA_KEY = 'userData';
export const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
export const LOCAL_STORAGE_COMPANY_INFO_KEY = 'companyInfo';
export const LOCAL_STORAGE_SECRET_KEY = 'secretKey';
export const LOCAL_STORAGE_CODE_KEY = 'codeKey';
export const LOCAL_STORAGE_SHOW_NOTICES_KEY = 'showNotices';

export const serializeListData = (query: any) => {
	const list =
		query?.content?.list || query?.content?.detail || query?.content || [];

	return list.map((item: any, index: number) => ({
		...item,
		no: index + 1,
		uuid: uid(),
	}));
};
export const testValidPhone = (value: string) => {
	return /^(0(3|5|7|8|9)[0-9]{8})$/.test(value);
};
export const roleFromCode = (code: string) => {
	const codeValue = String(code);
	if (codeValue && codeValue.length === 15 && codeValue.startsWith('1')) {
		return ROLES.STAFF;
	}
	if (codeValue?.startsWith('0') || codeValue.startsWith('+84')) {
		return ROLES.AGENT;
	}
	return ROLES.AGENT;
};
export const getFullAddress = (
	addressData: Record<string, any>,
	keys?: AddressKeys,
): string => {
	const {
		provinceKey = 'province_name',
		districtKey = 'district_name',
		wardKey = 'commune_name',
		streetKey = 'street_address',
	} = keys || {};

	const parts: string[] = [];
	if (addressData[streetKey]) {
		parts.push(addressData[streetKey]);
	}
	if (addressData[wardKey]) {
		parts.push(addressData[wardKey]);
	}
	if (addressData[districtKey]) {
		parts.push(addressData[districtKey]);
	}
	if (addressData[provinceKey]) {
		parts.push(addressData[provinceKey]);
	}
	return parts.filter(Boolean).join(', ');
};

export const typeRoleFromCode = (code: any) => {
	const role = roleFromCode(code);
	if (role === ROLES.STAFF) {
		return 1;
	}
	return 0;
};
export const getCodeKey = (code: any) => {
	const arr = String(code).split('-');
	return arr?.[0];
};

export const calcTotalPage = (total: number, limit: number) => {
	return Math.ceil(total / limit);
};
/**
 * Kiểm tra xem một giá trị có phải là một đối tượng Date hợp lệ không.
 * @param value Giá trị cần kiểm tra.
 * @returns true nếu là Date object hợp lệ, ngược lại false.
 */
function isDateObject(value: any): value is Date {
	return value instanceof Date && isValid(value);
}

/**
 * Duyệt qua một đối tượng và định dạng lại các đối tượng Date thành chuỗi theo định dạng mong muốn.
 * Hàm này xử lý các đối tượng lồng nhau và mảng chứa đối tượng.
 * @param obj Đối tượng cần định dạng.
 * @param dateFormat Chuỗi định dạng cho ngày tháng (ví dụ: 'yyyy-MM-dd', 'yyyy-MM-ddTHH:mm:ss.SSSZ').
 * @returns Đối tượng mới với các Date object đã được định dạng thành chuỗi.
 */
export function formatDatesInObject<T extends object>(
	obj: T,
	dateFormat = 'yyyy-MM-ddTHH:mm:ss.SSSZ',
): T {
	if (obj === null || typeof obj !== 'object') {
		return obj; // Trả về nguyên giá trị nếu không phải object
	}
	if (Array.isArray(obj)) {
		return obj.map((item) => formatDatesInObject(item, dateFormat)) as T;
	}
	const newObj: { [key: string]: any } = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value: any = obj[key as keyof T];
			if (isDateObject(value)) {
				newObj[key] = format(value, dateFormat);
			} else if (typeof value === 'object' && value !== null) {
				newObj[key] = formatDatesInObject(value, dateFormat);
			} else {
				newObj[key] = value;
			}
		}
	}
	return newObj as T;
}

/**
 * Kiểm tra xem một giá trị có phải là một chuỗi ngày tháng ISO 8601 hợp lệ không.
 * @param value Giá trị cần kiểm tra.
 * @returns true nếu là chuỗi ISO 8601 hợp lệ, ngược lại false.
 */
function isISOString(value: any): boolean {
	if (typeof value === 'string' && value.length > 0) {
		const parsed = parseISO(value);
		return isValid(parsed);
	}
	return false;
}

/**
 * Duyệt qua một đối tượng và chuyển đổi các chuỗi ngày tháng ISO 8601 thành đối tượng Date.
 * Hàm này xử lý các đối tượng lồng nhau và mảng chứa đối tượng.
 * @param obj Đối tượng cần chuyển đổi.
 * @returns Đối tượng mới với các chuỗi ngày tháng đã được chuyển đổi thành Date object.
 */
export function convertDateStringsToDates<T extends object>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => convertDateStringsToDates(item)) as T;
	}

	const newObj: { [key: string]: any } = {};

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value: any = obj[key as keyof T];
			if (isISOString(value)) {
				const dateObject = parseISO(value);
				const yyyyMmDdString = format(dateObject, 'yyyy-MM-dd');
				newObj[key] = parseDate(yyyyMmDdString);
			} else if (typeof value === 'object' && value !== null) {
				newObj[key] = convertDateStringsToDates(value);
			} else {
				newObj[key] = value;
			}
		}
	}

	return newObj as T;
}

export function convertToDateValue(date: any): CalendarDate | undefined {
	if (typeof date === 'string' && isISOString(date)) {
		const dateObject = parseISO(date);
		const yyyyMmDdString = format(dateObject, 'yyyy-MM-dd');
		return parseDate(yyyyMmDdString);
	}
	return date;
}

export const toZonedDateTime = (value: any): ZonedDateTime | null => {
	if (value instanceof ZonedDateTime) {
		return value;
	}
	if (typeof value === 'string') {
		try {
			if (isISOString(value)) {
				const dateObject = parseISO(value);
				return parseAbsolute(dateObject.toISOString(), getLocalTimeZone());
			}
			return parseAbsolute(value, getLocalTimeZone());
		} catch (e) {
			console.warn('Failed to parse string to ZonedDateTime:', value, e);
			return null;
		}
	}
	if (
		typeof value === 'object' &&
		value !== null &&
		'year' in value &&
		'month' in value &&
		'day' in value &&
		'hour' in value &&
		'minute' in value
	) {
		try {
			const {
				year,
				month,
				day,
				hour = 0,
				minute = 0,
				second = 0,
				millisecond = 0,
				timeZone = getLocalTimeZone(),
			} = value;
			return new ZonedDateTime(
				year,
				month,
				day,
				timeZone,
				0,
				hour,
				minute,
				second,
				millisecond,
			);
		} catch (e) {
			console.warn(
				'Failed to reconstruct ZonedDateTime from object:',
				value,
				e,
			);
			return null;
		}
	}
	return null;
};

export const toZonedDate = (value: any): CalendarDate | null => {
	if (value instanceof CalendarDate) {
		return value;
	}
	if (typeof value === 'string') {
		try {
			if (isISOString(value)) {
				const dateObject = parseISO(value);
				const zonedDateTime = parseAbsolute(
					dateObject.toISOString(),
					getLocalTimeZone(),
				);
				return new CalendarDate(
					zonedDateTime.year,
					zonedDateTime.month,
					zonedDateTime.day,
				);
			}
			return parseDate(value);
		} catch (e) {
			console.warn('Failed to parse string to ZonedDateTime:', value, e);
			return null;
		}
	}
	if (
		typeof value === 'object' &&
		value !== null &&
		'year' in value &&
		'month' in value &&
		'day' in value
	) {
		try {
			const { year, month, day } = value;
			return new CalendarDate(year, month, day);
		} catch (e) {
			console.warn('Failed to reconstruct CalendarDate from object:', value, e);
			return null;
		}
	}
	return null;
};

export function convertToDateTimeToValue(
	date: any,
): CalendarDate | ZonedDateTime | undefined {
	if (date instanceof ZonedDateTime) {
		return date;
	}
	if (date instanceof CalendarDate) {
		return parseZonedDateTime(
			`${date.toString()}T00:00:00${getLocalTimeZone()}`,
		);
	}

	if (typeof date === 'string' && isISOString(date)) {
		const dateObject = parseISO(date);
		return parseAbsolute(dateObject.toISOString(), getLocalTimeZone());
	}
	return date;
}

export function convertToDateTimeValue(dateTimeString: string) {
	if (isISOString(dateTimeString)) {
		const dateTime = convertToDateTimeToValue(dateTimeString);
		if (dateTime) {
			return { ...dateTime };
		}
	}
	const parts = dateTimeString.split(' '); // Tách "HH:MM" và "DD/MM/YYYY"
	if (parts.length === 2) {
		const [timePart, datePart] = parts;
		const timeSubParts = timePart.split(':');
		const dateSubParts = datePart.split('/');

		if (timeSubParts.length === 2 && dateSubParts.length === 3) {
			const hour = Number.parseInt(timeSubParts[0], 10);
			const minute = Number.parseInt(timeSubParts[1], 10);
			const day = Number.parseInt(dateSubParts[0], 10);
			const month = Number.parseInt(dateSubParts[1], 10);
			const year = Number.parseInt(dateSubParts[2], 10);

			if (
				!Number.isNaN(day) &&
				!Number.isNaN(month) &&
				!Number.isNaN(year) &&
				!Number.isNaN(hour) &&
				!isNaN(minute)
			) {
				return { year, month, day, hour, minute };
			}
		}
	}
	return undefined;
}

/**
 * Duyệt qua một đối tượng và định dạng lại các đối tượng Date thành chuỗi 'dd/MM/yyyy'.
 * Hàm này xử lý các đối tượng lồng nhau và mảng chứa đối tượng.
 * @param obj Đối tượng cần định dạng.
 * @returns Đối tượng mới với các Date object đã được định dạng thành chuỗi 'dd/MM/yyyy'.
 */
export function formatDatesToDDMMYYYY<T extends object>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj; // Return as is if not an object
	}

	if (Array.isArray(obj)) {
		// If it's an array, map over its elements and recurse
		return obj.map((item) => formatDatesToDDMMYYYY(item)) as T;
	}

	const newObj: { [key: string]: any } = {};

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key as keyof T];

			if (value instanceof Date && isValid(value)) {
				// If it's a valid Date object, format it to 'dd/MM/yyyy'
				newObj[key] = format(value, 'dd/MM/yyyy');
			} else if (typeof value === 'object' && value !== null) {
				// If it's a non-null object, recurse to handle nested properties
				newObj[key] = formatDatesToDDMMYYYY(value);
			} else {
				// Keep the value as is if it's not a Date object and not an object
				newObj[key] = value;
			}
		}
	}

	return newObj as T;
}
/**
 * Duyệt qua một đối tượng và chuyển đổi các chuỗi ngày tháng ISO 8601 thành chuỗi 'dd/MM/yyyy'.
 * Hàm này xử lý các đối tượng lồng nhau và mảng chứa đối tượng.
 * @param obj Đối tượng cần chuyển đổi.
 * @returns Đối tượng mới với các chuỗi ngày tháng đã được định dạng thành 'dd/MM/yyyy'.
 */
export function convertAndFormatDate<T extends object>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => convertAndFormatDate(item)) as T;
	}
	const newObj: { [key: string]: any } = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value: any = obj[key as keyof T];
			if (isISOString(value)) {
				// Chuyển đổi từ ISO string sang Date object, rồi định dạng sang 'dd/MM/yyyy'
				const dateObject = parseISO(value);
				newObj[key] = format(dateObject, 'dd/MM/yyyy');
			} else if (typeof value === 'object' && value !== null) {
				// Nếu là object, đệ quy để xử lý các thuộc tính lồng nhau
				newObj[key] = convertAndFormatDate(value);
			} else {
				// Giữ nguyên giá trị
				newObj[key] = value;
			}
		}
	}
	return newObj as T;
}

// Hàm mới: Kiểm tra tính hợp lệ của ngày và tuổi
// Sẽ trả về một string lỗi nếu có, hoặc undefined nếu hợp lệ
export const validateDateAndAge = (
	year: number,
	month: number,
	day: number,
	label: string,
): string | undefined => {
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		return `${label} không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm.`;
	}

	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth(); // 0-indexed
	const currentDay = today.getDate(); // 1-indexed

	let age = currentYear - date.getFullYear();
	if (
		currentMonth < date.getMonth() ||
		(currentMonth === date.getMonth() && currentDay < date.getDate())
	) {
		age--;
	}

	if (age < 18) {
		return 'Tuổi hợp lệ từ 18 tuổi.';
	}

	return undefined; // Không có lỗi
};

// Hàm này có thể giúp định dạng lại ngày về DD/MM/YYYY nếu cần
export const formatDateParts = (
	year: number,
	month: number,
	day: number,
): string => {
	const formattedDay = String(day).padStart(2, '0');
	const formattedMonth = String(month).padStart(2, '0');
	return `${formattedDay}/${formattedMonth}/${year}`;
};

/**
 * Replaces all occurrences of a substring with another substring within the input string.
 * This function is safe to use with null or undefined input strings.
 *
 * @param str The input string in which to perform the replacement. If null or undefined, the function will return an empty string.
 * @param from The substring to find and replace in `str`. This is a literal string (not a regex).
 * @param to The substring to use as a replacement for all occurrences of `from`.
 * @returns A new string with all occurrences of `from` replaced by `to`. Returns an empty string if `str` is null or undefined.
 */
export const parseString = (
	str: string | null | undefined,
	from: string,
	to: string,
): string => {
	if (str === null || str === undefined || typeof str !== 'string')
		return str ?? '';
	return str?.replaceAll(from, to) ?? '';
};

export const downloadFileObject = (
	base64String: string,
	filename: string,
	type?: string,
) => {
	let linkSource = '';
	if (base64String.startsWith('JVB')) {
		linkSource = `data:application/pdf;base64,${base64String}`;
	} else if (base64String.startsWith('data:application/pdf;base64')) {
		linkSource = base64String;
	}
	if (type === 'link') return linkSource;
	const downloadLink = document.createElement('a');
	downloadLink.href = linkSource;
	downloadLink.download = filename;
	downloadLink.click();
};

export const caluclateGrowth = (current: number, last: number) => {
	if (last === 0) {
		if (current > 0) {
			return {
				grow: true,
				percent: 100,
			};
		}
		return {
			grow: false,
			percent: 0,
		};
	}

	const rawPercent = ((current - last) / last) * 100;

	const growthRate = Math.round(rawPercent * 100) / 100;
	return {
		grow: growthRate > 0,
		percent: growthRate,
	};
};
export const toUnaccentedLower = (str: any) => {
	return (
		str
			.normalize('NFD')
			// biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D')
			.toLowerCase()
			.trim()
	);
};
