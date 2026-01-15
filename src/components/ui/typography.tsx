import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { forwardRefWithAs } from "~/utils/render";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
// ----------------------------------------------------------------------

/**
 * A utility function to generate typography variants using the `cva` library.
 *
 * This function provides a set of predefined typography styles that can be applied
 * to various text elements in a React component. The styles are categorized into
 * different variants and colors, allowing for consistent and reusable typography
 * across the application.
 *
 * ### Variants
 * - `h2`: Medium font, 3rem size, 3.5rem line-height, slight negative tracking. // size: 3rem = 48px line-height: 3.5rem = 56px
 * - `h3`: Medium font, 2.5rem size, 3rem line-height, slight negative tracking. // size: 2.5rem = 40px line-height: 3rem = 48px
 * - `h4`: Medium font, 2rem size, 2.5rem line-height, slight negative tracking.// size: 2rem = 32px line-height: 2.5rem = 40px
 * - `h5`: Medium font, 1.5rem size, 1.75rem line-height. // size: 1.5rem = 24px line-height: 1.75rem = 28px
 * - `subheadline`: Light font, extra-large size. //  size: 1.25rem = 20px line-height: 1.5rem = 24px
 * - `hairline1`: Medium font, 0.75rem size, 1.25rem line-height, positive tracking. // size: 0.75rem = 12px line-height: 1.25rem = 20px
 * - `body2b`: Bold font, 0.875rem size, 1.5rem line-height. // size: 0.875rem = 14px line-height: 1.5rem = 24px
 * - `body2m`: Medium font, 0.875rem size, 1.5rem line-height. // size: 0.875rem = 14px line-height: 1.5rem = 24px
 * - `body2r`: Normal font, 0.875rem size, 1.5rem line-height. // size: 0.875rem = 14px line-height: 1.5rem = 24px
 * - `body`: Normal font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `paragraphl`: Light font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `paragraph`: Normal font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `paragraphb`: Bold font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `paragraphm`: Medium font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `div`: Normal font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `smallsm`: Semibold font, 0.625rem size, 0.75rem line-height. // size: 0.625rem = 10px line-height: 0.75rem = 12px
 * - `small`: Normal font, 0.625rem size, 0.75rem line-height. // size: 0.625rem = 10px line-height: 0.75rem = 12px
 * - `captionr`: Normal font, 0.75rem size, 1rem line-height. // size: 0.75rem = 12px line-height: 1rem = 16px
 * - `captionsm`: Semibold font, 0.75rem size, 1rem line-height. // size: 0.75rem = 12px line-height: 1rem = 16px
 * - `base2sm`: Semibold font, 0.875rem size, 1.25rem line-height. // size: 0.875rem = 14px line-height: 1.25rem = 20px
 * - `base2r`: Normal font, 0.875rem size, 1.25rem line-height. // size: 0.875rem = 14px line-height: 1.25rem = 20px
 * - `base2m`: Medium font, 0.875rem size, 1.25rem line-height. // size: 0.875rem = 14px line-height: 1.25rem = 20px
 * - `basem`: Medium font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `baser`: Normal font, 1rem size, 1.5rem line-height. // size: 1rem = 16px line-height: 1.5rem = 24px
 * - `title`: Medium font, 1.25rem size, 1.5rem line-height. // size: 1.25rem = 20px line-height: 1.5rem = 24px
 *
 * ### Colors
 * - `primary`: Neutral black text color.
 * - `secondary`: Neutral white text color.
 * - `lime`: Lime color from CSS variable.
 * - `black50`: Black color from CSS variable.
 * - `orange`: Orange color from CSS variable.
 * - `success`: Success color from CSS variable.
 * - `gray`: Gray color with hex value #353535.
 * - `red`: Red color with hex value #F00.
 * - `warning`: Orange color from CSS variable.
 *
 * ### Default Variants
 * - `variant`: `body`
 * - `color`: `primary`
 */
const typographyVariants = cva("leading-snug", {
  variants: {
    variant: {
      h2: "font-medium text-[3rem]/[3.5rem] -tracking-[0.02rem]",
      h3: "font-medium text-[2.5rem]/[3rem] -tracking-[0.02rem]",
      h4: "font-medium text-[2rem]/[2.5rem] -tracking-[0.02rem]",
      h5: "font-medium text-[1.5rem]/[1.75rem] ",
      subheadline: "text-xl font-light",
      hairline1: "font-medium text-[0.75rem]/[1.25rem] tracking-[0.05rem]",
      body2b: "font-bold text-[0.875rem]/[1.5rem]",
      body2m: "font-medium text-[0.875rem]/[1.5rem]",
      body2r: "font-normal text-[0.875rem]/[1.5rem]",
      body: "font-normal text-[1rem]/[1.5rem]",
      paragraphl: "font-light text-[1rem]/[1.5rem]",
      paragraph: "font-normal text-[1rem]/[1.5rem]",
      paragraphb: "font-bold text-[1rem]/[1.5rem]",
      paragraphm: "font-medium text-[1rem]/[1.5rem]",
      div: "font-normal text-[1rem]/[1.5rem]",
      smallsm: "font-semibold text-[0.625rem]/[0.75rem] ",
      small: "font-normal text-[0.625rem]/[0.75rem]",
      captionr: "font-normal text-[0.75rem]/[1rem]",
      captionsm: "font-semibold text-[0.75rem]/[1rem]",
      base2sm: "font-semibold text-[0.875rem]/[1.25rem]",
      base2r: "font-normal text-[0.875rem]/[1.25rem]",
      base2m: "font-medium text-[0.875rem]/[1.25rem]",
      basem: "font-medium text-[1rem]/[1.5rem]",
      baser: "font-normal text-[1rem]/[1.5rem]",
      title: "font-medium text-[1.25rem]/[1.5rem]",
    },
    color: {
      primary: "text-neutral-black",
      secondary: "text-neutral-white",
      lime: "text-[var(--color-lime)]",
      black50: "!text-[var(--black-500)]",
      black30: "!text-content2",
      black20: "!text-[var(--black-200)]",
      black10: "!text-[var(--black-100)]",
      orange: "!text-[var(--orange)]",
      success: "!text-[var(--success)]",
      gray: "text-[#353535]",
      red: "text-[#F00]",
      warning: "text-[var(--orange)]",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
  },
});

const defaultVariantMapping: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  string
> = {
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  subheadline: "span",
  hairline1: "span",
  body2b: "span",
  body2m: "span",
  body2r: "span",
  body: "span",
  smallsm: "span",
  small: "span",
  captionr: "span",
  captionsm: "span",
  base2sm: "span",
  base2r: "span",
  base2m: "span",
  basem: "span",
  baser: "span",
  title: "h1",
  paragraphl: "p",
  paragraph: "p",
  paragraphm: "p",
  paragraphb: "p",
  div: "div",
};

interface TypographyProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "color">,
    VariantProps<typeof typographyVariants> {
  content?: string;
}

export const Typography = forwardRefWithAs<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "b" | "em" | "div",
  TypographyProps
>((props, ref) => {
  const {
    variant = "body",
    color,
    children,
    as,
    className,
    content,
    ...rest
  } = props;

  const Tag = as ?? defaultVariantMapping[variant ?? "body"];
  if (content) {
    const cleanHTML = DOMPurify.sanitize(content);
    return (
      <Tag
        ref={ref}
        className={cn(typographyVariants({ variant, color }), className)}
      >
        {parse(cleanHTML)}
      </Tag>
    );
  }
  return (
    <Tag
      ref={ref}
      className={cn(typographyVariants({ variant, color }), className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});
