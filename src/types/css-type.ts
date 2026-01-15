import type {
	UseInfiniteQueryOptions,
	UseQueryOptions,
} from "@tanstack/react-query";
import type { CSSProperties } from "react";
export type UseQueryOptionsType = Omit<
	UseQueryOptions,
	"queryKey" | "queryFn"
> & {};
export type SxProps = CSSProperties & {
	[key: string]: CSSProperties | string | number | undefined;
};
export type UseInfiniteQueryOptionsType = Omit<
	UseInfiniteQueryOptions,
	"queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
> & {};
export type BreakPointKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type Responsive<T> = T | Partial<Record<BreakPointKey, T>>;
export type Direction =
	| "col-reverse"
	| "column"
	| "row-reverse"
	| "row"
	| "inherit"
	| "col";
export type FlexOptions = {
	justifyContent?:
		| Responsive<"start" | "end" | "center" | "between" | "around" | "stretch">
		| "start"
		| "end"
		| "center"
		| "between"
		| "around"
		| "stretch";
	alignItems?:
		| Responsive<"start" | "end" | "center" | "stretch">
		| "start"
		| "end"
		| "center"
		| "stretch";
	alignSelf?:
		| Responsive<"auto" | "start" | "end" | "center" | "stretch" | "baseline">
		| "auto"
		| "start"
		| "end"
		| "center"
		| "stretch"
		| "baseline";
};
