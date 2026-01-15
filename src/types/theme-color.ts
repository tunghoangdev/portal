import type { BaseColors, ColorScale } from '@heroui/react';
export type ThemeColors = BaseColors & {
	default: ColorScale;
	primary: ColorScale;
	secondary: ColorScale;
	success: ColorScale;
	warning: ColorScale;
	danger: ColorScale;
	info: ColorScale;
};
