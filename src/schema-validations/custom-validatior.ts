import type { FieldValues } from 'react-hook-form';
import z, { ZodSchema, type ZodObject } from 'zod';
import type { FormFieldConfig } from '~/types/form-field';
import { now, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import {
	convertToDateTimeValue,
	convertToDateValue,
	formatDateParts,
	toZonedDate,
	toZonedDateTime,
	validateDateAndAge,
} from '~/utils/util';
import { parse } from 'date-fns';
const PHONE_PATTERN = /^(0(3|5|7|8|9)[0-9]{8})$/;
// /^((09|03|07|08|05)+([0-9]{8})\b)$|^((\+84|84|0)+([1-9]{1})+([0-9]{8})\b)$/;
interface ValidateNumberOptions {
	label?: string; // Nhãn của trường, dùng cho thông báo lỗi
	allowZero?: boolean; // Cho phép giá trị 0 (mặc định là true)
	isNumberBank?: boolean; // Cho phép giá trị 0 (mặc định là true)
	nullable?: boolean; // Cho phép giá trị null/undefined sau khi chuyển đổi
	min?: number; // Giá trị tối thiểu (ngoại trừ 0 nếu allowZero là false)
	max?: number; // Giá trị tối đa
	int?: boolean; // Yêu cầu số nguyên
	customMessage?: {
		required?: string;
		invalid?: string;
		min?: string;
		max?: string;
		int?: string;
		zeroNotAllowed?: string;
	};
}

type SuperRefineFunction<T extends ZodObject<any, any, any, any>> = (
	data: z.infer<T>, // Dữ liệu của schema
	ctx: z.RefinementCtx, // Context để thêm lỗi
) => void;
/* ---------------------------------------------------
 * Helper Validations
 * -------------------------------------------------- */

export const validatePhone = (label: string) => {
	return z
		.string({
			required_error: `${label} không được để trống`,
		})
		.nonempty(`${label} không được để trống`)
		.refine((value) => {
			return PHONE_PATTERN.test(value);
		}, `${label} không đúng định dạng`);
};

export const validatePhoneOrCode = (label: string) => {
	const codePhoneNumberPattern = /^(\d{4})$/;
	// const codePhoneNumberPattern =
	// /^(\d{4}-)?((09|03|07|08|05)\d{8}|(\+84|84|0)[1-9]\d{8})$/;
	// Kết hợp hai regex trên thành một
	const combinedPattern = new RegExp(
		`^(${PHONE_PATTERN.source}|${codePhoneNumberPattern.source})$`,
	);

	return z
		.string({
			required_error: `${label} không được để trống`,
		})
		.nonempty(`${label} không được để trống`)
		.refine(
			(value) => combinedPattern.test(value),
			`${label} không đúng định dạng. Vui lòng nhập theo định dạng: SĐT hoặc mã code 4 chữ số.`,
		);
};

/**
 * Tạo một Zod schema để validate các trường số từ input HTML type="number" (nhận string).
 * Xử lý dấu phẩy phân cách hàng nghìn, chuyển đổi sang số và áp dụng các quy tắc validation.
 *
 * @param options Tùy chọn validation cho số: label, allowZero, nullable, min, max, int, customMessage.
 * @returns Zod schema đã được cấu hình.
 */
export const validateNumber = (options?: ValidateNumberOptions) => {
	const {
		label = 'Giá trị', // Nhãn mặc định
		allowZero = true,
		nullable = false,
		min,
		max,
		int,
		customMessage = {},
	} = options || {};

	// Bước 1: Parse từ string và loại bỏ dấu phẩy, chuyển đổi thành số.
	// Nếu giá trị rỗng, coi là undefined để Zod có thể xử lý nullable/optional.
	let stringSchema = z
		.string({
			required_error: customMessage.required || `Bạn chưa nhập ${label}.`,
			invalid_type_error: customMessage.required || `${label} không hợp lệ.`,
		})
		.refine((val) => val.trim() !== '', {
			message: customMessage.required || `Bạn chưa nhập ${label}.`,
		})
		.transform((val) => {
			// Loại bỏ dấu phẩy phân cách hàng nghìn
			const cleanedVal = val.replaceAll(',', '');
			const num = Number.parseFloat(cleanedVal);
			// Trả về undefined nếu không phải số hợp lệ
			return Number.isNaN(num) ? undefined : num;
		});

	// Bước 2: Định nghĩa schema cho kiểu number sau khi transform
	let numberSchema = z.number({
		invalid_type_error: customMessage.invalid || `${label} không hợp lệ.`,
	});

	// Áp dụng các validation số tùy chỉnh
	if (!allowZero) {
		// Nếu không cho phép 0, giá trị phải lớn hơn 0
		numberSchema = numberSchema.gt(
			0,
			customMessage.zeroNotAllowed || `${label} phải lớn hơn 0.`,
		);
	} else {
		// Nếu cho phép 0, giá trị phải không âm (>= 0)
		numberSchema = numberSchema.nonnegative(
			customMessage.invalid || `${label} không hợp lệ.`,
		);
	}

	if (min !== undefined) {
		numberSchema = numberSchema.min(
			min,
			customMessage.min || `${label} tối thiểu là ${min}.`,
		);
	}
	if (max !== undefined) {
		numberSchema = numberSchema.max(
			max,
			customMessage.max || `${label} tối đa là ${max}.`,
		);
	}
	if (int) {
		numberSchema = numberSchema.int(
			customMessage.int || `${label} phải là số nguyên.`,
		);
	}

	// Bước 3: Kết hợp stringSchema và numberSchema bằng pipe
	let finalSchema = stringSchema.pipe(numberSchema);

	// Bước 4: Xử lý nullable nếu được yêu cầu
	if (nullable) {
		return finalSchema.nullable(); // Trả về schema cho phép null hoặc undefined sau khi transform
	}

	return finalSchema;
};

export const validatePercent = (label: string, allowZero = true) =>
	z
		.string({
			required_error: `Bạn chưa nhập ${label}`,
		})
		.nonempty(`Bạn chưa nhập ${label}`)
		.refine((value: any) => {
			const numericValue = value.replaceAll(',', '');
			if (allowZero)
				return (
					!Number.isNaN(numericValue) &&
					numericValue >= 0 &&
					numericValue <= 100
				);
			return (
				!Number.isNaN(numericValue) && numericValue > 0 && numericValue <= 100
			);
		}, `${label} không hợp lệ`);

export const selectOptionSchema = z.object({
	value: z.union([z.string().min(1), z.number().min(1)]),
	label: z.string().min(1),
});

export const validateDateTransform = (label: string, options?: any) => {
	return z
		.any()
		.nullable()
		.transform((value, ctx) => {
			if (!value) {
				// ctx.addIssue({
				//   code: z.ZodIssueCode.custom,
				//   message: `${label} không được để trống.`,
				// });
				return '';
			}

			const zdt = toZonedDate(value);
			if (!zdt === null && options?.isRequired) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${label} không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm.`,
				});
				return z.NEVER;
			}
			return zdt;
		})
		.superRefine((date, ctx) => {
			if (date === null && options?.isRequired) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${label} không được để trống.`,
				});
				return;
			}
			if (date) {
				const nowInTimeZone = now(getLocalTimeZone());
				if (options?.isFeatured) {
					if (date.compare(nowInTimeZone) < 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} phải lớn hơn hoặc bằng ngày hiện tại.`,
						});
					}
				}
				if (options?.isBefore) {
					if (date.compare(nowInTimeZone) > 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} phải nhỏ hơn hoặc bằng ngày hiện tại.`,
						});
					}
				}
				if (options?.isBirthday) {
					// Tính toán ngày cách đây 18 năm
					const eighteenYearsAgo = new CalendarDate(
						nowInTimeZone.year - 18,
						nowInTimeZone.month,
						nowInTimeZone.day,
					);

					// So sánh ngày nhập vào với ngày cách đây 18 năm
					// Nếu ngày nhập vào lớn hơn hoặc bằng ngày cách đây 18 năm, nghĩa là người dùng chưa đủ 18 tuổi
					if (date.compare(eighteenYearsAgo) > 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Tuổi phải là 18 tuổi trở lên.',
						});
					}
				}
				if (options?.morethan) {
					const { morethan } = options;
					// const startDate = date?.[morethan];
					console.log('morethan', morethan);
					console.log('ctx', ctx);
					console.log('date', date);

					if (date.compare(options?.morethan) < 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} phải lớn hơn hoặc bằng ngày ${options?.morethan}.`,
						});
					}
				}
			}
		})
		.transform((val) => {
			if (!val) {
				return '';
			}
			const { year, month, day } = val;
			return `${String(day).padStart(2, '0')}/${String(month).padStart(
				2,
				'0',
			)}/${year}`;
		});
};

export const validateDateTimeTransform = (label: string, options?: any) => {
	return z
		.any()
		.nullable()
		.transform((value, ctx) => {
			const zdt = toZonedDateTime(value);
			if (zdt === null) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${label} không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm, giờ, phút.`,
				});
				return z.NEVER;
			}
			return zdt;
		})
		.superRefine((date, ctx) => {
			if (date === null) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `${label} không được để trống.`,
				});
				return;
			}
			if (options?.isFeatured) {
				const nowInTimeZone = now(date.timeZone);
				if (date < nowInTimeZone) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `${label} phải lớn hơn hoặc bằng ngày hiện tại.`,
					});
				}
			}
		})
		.transform((val) => {
			if (val === null) {
				return null;
			}
			const { year, month, day, hour, minute } = val;
			return `${String(day).padStart(2, '0')}/${String(month).padStart(
				2,
				'0',
			)}/${year} ${String(hour).padStart(2, '0')}:${String(minute).padStart(
				2,
				'0',
			)}`;
		});
};

export const validateDateTimeAndTransform = (label: string, options?: any) => {
	return z
		.union([
			z
				// .object({
				//   hour: z
				//     .number()
				//     .int()
				//     .min(0)
				//     .max(23, `Giờ của ${label} không hợp lệ`),
				//   minute: z
				//     .number()
				//     .int()
				//     .min(0)
				//     .max(59, `Phút của ${label} không hợp lệ`),
				//   day: z
				//     .number()
				//     .int()
				//     .min(1)
				//     .max(31, `Ngày của ${label} không hợp lệ`),
				//   month: z
				//     .number()
				//     .int()
				//     .min(1)
				//     .max(12, `Tháng của ${label} không hợp lệ`),
				//   year: z.number().int().min(1900, `Năm của ${label} không hợp lệ`),
				// })
				.string()
				.datetime()
				.transform((val, ctx) => {
					//   const { year, month, day, hour, minute } = val;
					//   const parsedDate = new Date(year, month - 1, day, hour, minute); // month is 0-indexed
					//   // Kiểm tra ngày tháng năm giờ phút hợp lệ
					//   if (
					//     parsedDate.getFullYear() !== year ||
					//     parsedDate.getMonth() !== month - 1 ||
					//     parsedDate.getDate() !== day ||
					//     parsedDate.getHours() !== hour ||
					//     parsedDate.getMinutes() !== minute
					//   ) {
					//     ctx.addIssue({
					//       code: z.ZodIssueCode.custom,
					//       message: `${label} không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm, giờ, phút.`,
					//     });
					//     return z.NEVER;
					//   }
					//   const now = new Date();
					//   if (parsedDate < now) {
					//     ctx.addIssue({
					//       code: z.ZodIssueCode.custom,
					//       message: `${label} không hợp lệ. Vui lòng nhập thời gian lớn hơn hoặc bằng thời gian hiện tại.`,
					//     });
					//     return z.NEVER;
					//   }
					//   return `${String(day).padStart(2, "0")}/${String(month).padStart(
					//     2,
					//     "0"
					//   )}/${year} ${String(hour).padStart(2, "0")}:${String(minute).padStart(
					//     2,
					//     "0"
					//   )}`;
				}),
			z
				.string({
					required_error: `Bạn chưa nhập ${label}`,
					invalid_type_error: `${label} không hợp lệ`,
				})
				.datetime()
				.transform((str, ctx) => {
					const dateTimeParts = convertToDateTimeValue(str);
					if (!dateTimeParts) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} không hợp lệ. Định dạng phải là HH:MM DD/MM/YYYY.`,
						});
						return z.NEVER;
					}

					const { year, month, day, hour, minute } = dateTimeParts;
					const parsedDate = new Date(year, month - 1, day, hour, minute);
					if (
						parsedDate.getFullYear() !== year ||
						parsedDate.getMonth() !== month - 1 ||
						parsedDate.getDate() !== day ||
						parsedDate.getHours() !== hour ||
						parsedDate.getMinutes() !== minute
					) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} không hợp lệ. Vui lòng kiểm tra lại ngày, tháng, năm, giờ, phút.`,
						});
						return z.NEVER;
					}
					const now = new Date();
					if (parsedDate < now) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} không hợp lệ. Vui lòng nhập thời gian lớn hơn hoặc bằng thời gian hiện tại.`,
						});
						return z.NEVER;
					}

					return `${String(hour).padStart(2, '0')}:${String(minute).padStart(
						2,
						'0',
					)} ${String(day).padStart(2, '0')}/${String(month).padStart(
						2,
						'0',
					)}/${year}`;
				}),
		])
		.nullable();
};
export const validateBirthdayAndTransform = (label: string) => {
	return z
		.union([
			z
				.string({
					required_error: `Vui lòng nhập ${label}`,
					invalid_type_error: `${label} không hợp lệ`,
				})
				.nullable()
				.transform((str, ctx) => {
					// Nếu là null, undefined, hoặc chuỗi rỗng thì bỏ qua validation nếu không bắt buộc
					if (!str || str.trim() === '') {
						return null;
					}
					const dateParts = convertToDateValue(str);
					if (!dateParts) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `${label} không hợp lệ. Vui lòng nhập định dạng DD/MM/YYYY.`,
						});
						return z.NEVER;
					}

					const { year, month, day } = dateParts;
					const errorMessage = validateDateAndAge(year, month, day, label);
					if (errorMessage) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: errorMessage,
						});
						return z.NEVER;
					}
					return formatDateParts(year, month, day);
				}),
			z
				.object({
					year: z
						.number({ invalid_type_error: `Năm của ${label} không hợp lệ` })
						.int()
						.min(1900, `Năm của ${label} không hợp lệ`),
					month: z
						.number({ invalid_type_error: `Tháng của ${label} không hợp lệ` })
						.int()
						.min(1)
						.max(12, `Tháng của ${label} không hợp lệ`),
					day: z
						.number({ invalid_type_error: `Ngày của ${label} không hợp lệ` })
						.int()
						.min(1)
						.max(31, `Ngày của ${label} không hợp lệ`),
				})
				.nullable() // Cho phép object là null nếu cần
				.transform((val, ctx) => {
					if (!val) {
						return null; // Trả về null nếu giá trị là null
					}

					const { year, month, day } = val;

					// Thực hiện validation ngày và tuổi
					const errorMessage = validateDateAndAge(year, month, day, label);
					if (errorMessage) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: errorMessage,
						});
						return z.NEVER;
					}

					// Trả về chuỗi ngày đã được chuẩn hóa (DD/MM/YYYY)
					return formatDateParts(year, month, day);
				}),
		])
		.nullable(); // Cho phép giá trị là null hoặc undefined nếu trường đó là tùy chọn
	// .or(z.literal('')) // Hoặc cho phép chuỗi rỗng nếu input có thể trống
	// .transform((val) => {
	// 	if (typeof val === 'string' && val.trim() === '') {
	// 		return null;
	// 	}
	// 	return val;
	// });
};

export const validateDate = (label: string) => {
	return z
		.object({
			year: z.number().int().min(1900, 'Năm không hợp lệ'),
			month: z.number().int().min(1).max(12, 'Tháng không hợp lệ'),
			day: z.number().int().min(1).max(31, 'Ngày không hợp lệ'),
		})
		.nullable()
		.transform((val) => {
			if (!val) {
				return null;
			}
			const { year, month, day } = val;
			const formattedMonth = String(month).padStart(2, '0');
			const formattedDay = String(day).padStart(2, '0');
			return `${formattedDay}/${formattedMonth}/${year}`;
		});
	// .string({
	// 	required_error: `Bạn chưa nhập ${label}`,
	// })
	// .nonempty(`Bạn chưa nhập ${label}`)
	// .refine((value) => {
	// 	if (!value) return true;
	// 	return isValid(new Date(value));
	// }, `${label} không hợp lệ`)
	// .refine((value) => {
	// 	if (!value) return true;
	// 	return isValid(new Date(value));
	// }, 'Năm phải lớn hơn 1900')
	// .refine((value) => {
	// 	if (!value) return true;
	// 	return isValid(new Date(value));
	// }, `${label} không được lớn hơn ngày hiện tại`);
};

export const validateBirthday = (label: string) => {
	return z
		.object({
			year: z.number().int().min(1900, 'Năm không hợp lệ'),
			month: z.number().int().min(1).max(12, 'Tháng không hợp lệ'),
			day: z.number().int().min(1).max(31, 'Ngày không hợp lệ'),
		})
		.nullable()
		.transform((val) => {
			if (!val) {
				return null;
			}
			const { year, month, day } = val;
			const formattedMonth = String(month).padStart(2, '0');
			const formattedDay = String(day).padStart(2, '0');
			return `${formattedDay}/${formattedMonth}/${year}`;
		})
		.refine((val) => val !== null && val !== '', {
			message: 'Tuổi hợp lệ từ 18 tuổi',
			path: ['birthday'],
		})
		.refine(
			(dateString) => {
				if (!dateString) return false;
				const [day, month, year] = dateString.split('/').map(Number);
				const birthDate = new Date(year, month - 1, day);
				const today = new Date();
				const currentYear = today.getFullYear();
				const currentMonth = today.getMonth();
				const currentDay = today.getDay();
				let age = currentYear - birthDate.getFullYear();
				if (
					currentMonth < birthDate.getMonth() ||
					(currentMonth === birthDate.getMonth() &&
						currentDay < birthDate.getDate())
				) {
					age--;
				}

				return age >= 18;
			},
			{
				message: 'Tuổi hợp lệ từ 18 tuổi',
				path: ['birthday'],
			},
		);

	// .refine(
	// 	(value) => {
	// 		const currentYear = new Date().getFullYear();
	// 		const birthYear = value?.getFullYear() || 0;
	// 		return currentYear - birthYear >= 18;
	// 	},
	// 	{
	// 		message: 'Tuổi hợp lệ từ 18 tuổi',
	// 	},
	// )
	// .transform((val) => {
	// 	console.log('val', val);
	// 	return val;
	// });
};

export const validateIdNumber = (label: string) => {
	return z
		.string({
			required_error: `Bạn chưa nhập ${label}`,
			invalid_type_error: `${label} không hợp lệ`,
		})
		.refine((value: any) => {
			if (!value) return true;
			// Số CCCD phải có 12 ký tự
			if (value.length !== 12) return false;
			// Số CCCD phải là số
			if (Number.isNaN(value)) return false;
			// Số CCCD phải bắt đầu bằng 1 số từ 0-9
			if (!/^[0-9]/.test(value)) return false;
			return true;
		}, `${label} không đúng định dạng`);
};
export const validateAmount = (label: string) => {
	return z.preprocess(
		(value) => {
			if (typeof value !== 'string') return value;
			let cleaned = value.replace(/,/g, '');
			return cleaned === '' ? undefined : Number.parseFloat(cleaned);
		},
		z
			.number({
				invalid_type_error: `${label} không đúng định dạng.`,
				required_error: `${label} không được trống.`,
			})
			.min(1, { message: `${label} phải lớn hơn 0.` }),
	);
};

interface CustomOptions<T> {
	extraSchema?: z.ZodObject<any, any, any, T>;
	superRefine?: SuperRefineFunction<z.ZodObject<any, any, any, T>>;
}
// Hàm chuyển đổi formFields thành Zod Schema
export function generateZodSchema<T extends FieldValues>(
	fieldsConfig: FormFieldConfig[],
	options?: CustomOptions<T>,
): z.ZodObject<any, any, any, T> {
	const schemaShape: Record<string, z.ZodTypeAny> = {};
	const { extraSchema, superRefine } = options || {};
	const comparisonRules: any[] = [];
	fieldsConfig.forEach((field) => {
		let zodType: z.ZodTypeAny;
		const errorMessage = `${field.label} không được trống`;
		// --- Xử lý Field Array ---
		if (field.type === 'array' && field.subFields) {
			// Bước 3: Định nghĩa schema cho các phần tử mảng
			const arrayItemSchema = generateZodSchema(field.subFields, options); // Gọi đệ quy để tạo schema cho item
			zodType = z.array(arrayItemSchema) as z.ZodArray<any>;
			if (field.isRequired) {
				zodType = (zodType as z.ZodArray<any>).min(
					1,
					`${field.label} không được để trống`,
				);
			} else {
				// Nếu không bắt buộc: cho phép mảng rỗng
				zodType = zodType.optional();
			}
			// zodType = z
			// 	.array(arrayItemSchema)
			// 	.min(1, `${field.label} không được để trống`); // Đảm bảo mảng có ít nhất 1 phần tử
			// // Nếu mảng không bắt buộc, có thể thêm .optional()
			// if (!field.isRequired) {
			// 	zodType = zodType.optional();
			// }
		} else {
			// --- Logic hiện tại cho các loại trường khác ---
			switch (field?.type) {
				case 'text':
				case 'select':
					zodType = z.string({
						required_error: errorMessage,
						invalid_type_error: `${field.label} không hợp lệ`,
					});
					// .nonempty(errorMessage);

					if (field.isNumber) {
						zodType = validateNumber({
							label: field.label,
							allowZero: field.allowZero,
							min: field.minValue,
							max: field.maxValue,
						});
					}
					if (field.minLength) {
						zodType = (zodType as z.ZodString).min(
							field.minLength,
							`Vui lòng nhập ít nhất ${field.minLength} ký tự`,
						);
					}
					if (field.maxLength) {
						zodType = (zodType as z.ZodString).max(
							field.maxLength,
							`Vui lòng nhập tối đa ${field.maxLength} ký tự`,
						);
					}
					if (field.isEmail) {
						zodType = z
							.string({
								required_error: `${field.label} không được để trống`,
							})
							.email('Email không hợp lệ');
					}
					if (field.isPhone) {
						zodType = validatePhone(field.label);
					}
					if (field.isCCCD) {
						zodType = validateIdNumber(field.label);
					}

					if (field.isPercent) {
						zodType = validatePercent(field.label);
					}
					if (field.isUrl) {
						zodType = z
							.string({
								required_error: `${field.label} không được để trống`,
							})
							.url('Url không hợp lệ');
					}
					break;
				case 'number':
					zodType = validateNumber({
						label: field.label,
						allowZero: field.allowZero,
						min: field.minValue,
						max: field.maxValue,
						customMessage: { zeroNotAllowed: 'Giá trị phải lớn hơn 0' },
					});
					if (field.isCCCD) {
						zodType = validateIdNumber(field.label);
					}
					break;
				case 'date':
					zodType = validateDateTransform(field.label, {
						isFeatured: field?.isFeatured || field?.isAfter || false,
						isBefore: field?.isBefore || false,
						isRequired: field.isRequired,
						isBirthday: field.isBirthday,
					});
					break;
				case 'datetime':
					zodType = validateDateTimeTransform(field.label, field);
					break;
				case 'checkbox':
					zodType = z.boolean({
						required_error: `${field.label} không được để trống`,
						invalid_type_error: `${field.label} không hợp lệ`,
					});
					break;
				case 'hidden':
					zodType = z.string().optional();
					break;
				default:
					if (field.isAmount) {
						zodType = validateAmount(field.label);
					} else {
						zodType = z.any();
					}
					break;
			}

			if (field.isRequired && !field.isRequiredWhen) {
				// Xử lý isRequired cho các loại trường thông thường
				zodType = zodType.refine((val) => {
					if (typeof val === 'string') {
						return val.trim().length > 0;
					}
					if (typeof val === 'number') {
						return !Number.isNaN(val) && val !== null;
					}
					if (typeof val === 'boolean') {
						return val !== null;
					}
					return val !== undefined && val !== null;
				}, errorMessage);
			} else if (typeof field.isRequiredWhen === 'function') {
				// Logic này có thể cần được làm rõ hơn cho isRequiredWhen với field array
				// zodType = zodType.superRefine((val, ctx) => {
				//   if (field.isRequiredWhen(val)) {
				// 	ctx.addIssue({
				// 	  code: z.ZodIssueCode.custom,
				// 	  message: errorMessage,
				// 	})
				//   }
				// });
			} else {
				zodType = zodType.optional().nullable();
			}
			if (field.compare) {
				comparisonRules.push({
					fieldName: field.name,
					compareWith: field.compare,
					label: field.label,
					labelCompare: fieldsConfig.find((f) => f.name === field.compare)
						?.label,
				});
			}
		}

		schemaShape[field.name] = zodType;
	});

	let finalSchema: any = z.object(schemaShape) as z.ZodObject<any, any, any, T>;

	if (superRefine) {
		finalSchema = finalSchema.superRefine(
			superRefine,
		) as unknown as z.ZodObject<any, any, any, T>;
	}
	if (extraSchema) {
		return finalSchema.merge(extraSchema) as z.ZodObject<any, any, any, T>;
	}
	// 3. Áp dụng superRefine cho toàn bộ Object Schema
	finalSchema = finalSchema.superRefine((data: any, ctx: any) => {
		comparisonRules.forEach((rule) => {
			const currentValue = data[rule.fieldName];
			const compareValue = data[rule.compareWith];
			const startDate = parse(compareValue, 'dd/MM/yyyy', new Date());
			const endDate = parse(currentValue, 'dd/MM/yyyy', new Date());
			if (startDate && endDate) {
				if (startDate > endDate) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,

						path: [rule.fieldName],
						message: `${rule.label} phải lớn hơn hoặc bằng ngày ${rule.labelCompare}.`,
					});
				}
			}
		});
	});

	return finalSchema;
}

export function generateDefaultValues<T extends FieldValues>(
	fieldsConfig: FormFieldConfig[],
): T {
	const defaultValues: Record<string, any> = {};
	fieldsConfig.forEach((field) => {
		// Nếu defaultValue được định nghĩa trong cấu hình field, sử dụng nó
		// Nếu không, hãy cung cấp một giá trị mặc định dựa trên loại trường
		if (field.defaultValue !== undefined) {
			defaultValues[field.name] = field.defaultValue;
		} else {
			// Cung cấp các giá trị mặc định hợp lý cho các loại trường khác nhau
			switch (field.type) {
				case 'text':
				case 'select':
					defaultValues[field.name] = ''; // Chuỗi rỗng cho text/select
					break;
				case 'number':
					defaultValues[field.name] = undefined; // undefined hoặc null cho số
					break;
				case 'checkbox':
					defaultValues[field.name] = false; // false cho checkbox
					break;
				case 'array':
					// Kiểm tra và khởi tạo giá trị cho các trường con
					if (field.subFields) {
						const subDefaultValues = generateDefaultValues(field.subFields);
						defaultValues[field.name] = [subDefaultValues]; // Khởi tạo với một đối tượng con mặc định
					} else {
						defaultValues[field.name] = [];
					}
					break;
				default:
					defaultValues[field.name] = undefined; // Mặc định là undefined
					break;
			}
		}
	});
	return defaultValues as T;
}

/**
 * Chuyển đổi tất cả các giá trị số trong một đối tượng form data thành chuỗi.
 * Hữu ích khi defaultValues là số nhưng Zod schema bắt đầu với z.string().transform().
 *
 * @param data Đối tượng form data ban đầu.
 * @returns Đối tượng form data với các giá trị số đã được chuyển đổi thành chuỗi.
 */
export function normalizeFormDataForForm<T extends FieldValues>(data: T): T {
	const normalizedData: Partial<T> = {};

	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const value = data[key];
			if (typeof value === 'number' || typeof value === 'bigint') {
				normalizedData[key] = String(value) as T[Extract<keyof T, string>];
			} else if (
				typeof value === 'object' &&
				value !== null &&
				!Array.isArray(value)
			) {
				// Xử lý đệ quy cho các đối tượng lồng nhau (nếu form của bạn có)
				normalizedData[key] = normalizeFormDataForForm(value) as T[Extract<
					keyof T,
					string
				>];
			} else {
				normalizedData[key] = value;
			}
		}
	}

	return normalizedData as T;
}
