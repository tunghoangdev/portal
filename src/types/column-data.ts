import type { JSX, ReactNode } from "react";

export type ColumnData = {
	name: string;
	selector: string;
	cell?: (row: any) => ReactNode | string | JSX.Element;
};
