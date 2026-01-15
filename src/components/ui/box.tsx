import { cn } from '~/lib/utils';
import { parseSx } from '~/utils';
import { ElementType, forwardRef, HTMLAttributes } from 'react';
interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
  sx?: Record<string, any>;
}
const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ as: Component = 'div', className, sx, ...props }, ref) => {
    return (
      <Component className={cn(parseSx(sx), className)} ref={ref} {...props} />
    );
  }
);

Box.displayName = 'Box';
export { Box };
