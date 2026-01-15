import { cn } from '~/lib/utils';
import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface StepperItemProps {
  title?: string;
  desc?: string;
  className?: string;
  icon?: ReactNode | string;
  classNames?: {
    wrapper?: string;
    title?: string;
    desc?: string;
    line?: string;
    base?: string;
    icon?: string;
    innerWrapper?: string;
    iconWrapper?: string;
  };
  active?: boolean;
  completed?: boolean;
  activeColor?: string;
  activeBgColor?: string;
  completedColor?: string;
  completedBgColor?: string;
}

const StepperItem = forwardRef<
  HTMLDivElement,
  StepperItemProps & HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      children,
      icon,
      title,
      desc,
      classNames,
      active = false,
      completed = false,
      activeColor,
      completedColor,
      activeBgColor,
      completedBgColor,
      ...props
    },
    ref
  ) => {
    const Comp = 'div';

    return (
      <Comp
        className={cn(
          'md:shrink md:basis-0 flex-1 group flex gap-x-2 md:block',
          className,
          classNames?.base,
          active && 'active',
          completed && 'completed'
        )}
        data-active={active}
        data-done={completed}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            'min-w-7 min-h-7 flex flex-col items-center md:w-full md:inline-flex md:flex-wrap md:flex-row text-xs align-middle',
            classNames?.innerWrapper
          )}
        >
          <div
            className={cn(
              'flex flex-col icon-wrapper',
              classNames?.iconWrapper
            )}
            data-slot="icon-wrapper"
          >
            <span
              className={cn(
                'icon size-7 flex justify-center items-center shrink-0 font-medium text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white',

                classNames?.icon
              )}
              data-slot="icon"
            >
              {icon}
            </span>

            <div className="grow md:grow-0 md:mt-3 pb-5" data-slot="wrapper">
              {title && (
                <span
                  className={cn(
                    'block title text-sm font-medium text-gray-800 dark:text-white',
                    classNames?.title
                  )}
                  data-slot="title"
                >
                  {title}
                </span>
              )}
              {desc && (
                <p
                  className={cn('desc text-sm text-gray-500', classNames?.desc)}
                  data-slot="desc"
                >
                  {desc}
                </p>
              )}
            </div>
          </div>
          <div
            className={cn(
              'mt-2 w-px h-full md:mt-0 md:ms-2 md:w-full md:h-px md:flex-1 group-last:hidden',
              classNames?.line
            )}
            data-slot="line"
          />
        </div>

        {children}
      </Comp>
    );
  }
);

interface StepperProps {
  className?: string;
}

const Stepper = forwardRef<
  HTMLDivElement,
  StepperProps & HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const Comp = 'div';
  return (
    <Comp
      className={cn('relative flex flex-col md:flex-row gap-2', `${className}`)}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
});
StepperItem.displayName = 'StepperItem';
Stepper.displayName = 'Stepper';
export { Stepper, StepperItem };
