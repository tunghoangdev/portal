import { cn } from "~/lib/utils";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Button } from "./button";
import { Icons } from "../icons";
type TableProps = ComponentProps<"table"> & {
  className?: string;
  classNames?: {
    container?: string;
    table?: string;
  };
  showButtonSroll?: boolean;
};
function Table({
  className,
  classNames,
  showButtonSroll,
  ...props
}: TableProps) {
  //   const scrollContainerRef = useRef<HTMLDivElement>(null);
  //   const [canScrollLeft, setCanScrollLeft] = useState(false);
  //   const [canScrollRight, setCanScrollRight] = useState(false);

  //   const checkScroll = useCallback(() => {
  //     if (scrollContainerRef.current) {
  //       const { scrollWidth, clientWidth, scrollLeft } =
  //         scrollContainerRef.current;
  //       setCanScrollLeft(scrollLeft > 0);
  //       setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  //     }
  //   }, []);

  //   const scrollTable = useCallback((direction: "left" | "right") => {
  //     if (scrollContainerRef.current) {
  //       const scrollAmount = scrollContainerRef.current.clientWidth / 2;
  //       if (direction === "left") {
  //         scrollContainerRef.current.scrollBy({
  //           left: -scrollAmount,
  //           behavior: "smooth",
  //         });
  //       } else {
  //         scrollContainerRef.current.scrollBy({
  //           left: scrollAmount,
  //           behavior: "smooth",
  //         });
  //       }
  //     }
  //   }, []);

  //   useEffect(() => {
  //     const container = scrollContainerRef.current;
  //     if (container && showButtonSroll) {
  //       checkScroll();
  //       container.addEventListener("scroll", checkScroll);
  //       window.addEventListener("resize", checkScroll);
  //       return () => {
  //         container.removeEventListener("scroll", checkScroll);
  //         window.removeEventListener("resize", checkScroll);
  //       };
  //     }
  //   }, [checkScroll, showButtonSroll]);

  return (
    <>
      {/* {canScrollLeft && showButtonSroll && (
				<Button
					className="scroll-button left-0 pl-1.5"
					onClick={() => scrollTable('left')}
					aria-label="Scroll left"
				>
					<Icons.arrowLeft />
				</Button>
			)} */}
      <div
        data-slot="table-container"
        className={cn("relative w-full overflow-x-auto", classNames?.container)}
        // ref={scrollContainerRef}
      >
        <table
          data-slot="table"
          className={cn(
            "w-full caption-bottom text-sm",
            className,
            classNames?.table
          )}
          {...props}
        />
      </div>
      {/* 
			{canScrollRight && showButtonSroll && (
				<Button
					className="scroll-button pr-1.5 absolute right-0 top-1/2 z-500"
					onPress={() => scrollTable('right')}
					aria-label="Scroll right"
				>
					<Icons.chevronRight />
				</Button>
			)} */}
    </>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-primary-50 data-[state=selected]:bg-default-300 border-b border-default-300 transition-colors",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        " text-default-700 h-8 md:h-10 px-2.5 text-left align-middle font-semibold whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] border-b-2 border-default-300",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-1 md:p-2.5 align-middle !whitespace-normal !overflow-visible [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
