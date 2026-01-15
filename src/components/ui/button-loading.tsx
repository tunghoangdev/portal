
import { Button, ButtonProps } from '@heroui/react';
import { Stack } from '~/components/ui';
import { LoadingDots } from '~/components/loading';

type InputProps = ButtonProps & {
  label: string;
  loading: boolean;
};

export default function ButtonLoading({
  label,
  loading,
  color,
  ...rest
}: InputProps) {
  return (
    <Button
      isLoading={loading}
      className="btn-action my-7 text-white bg-[var(--green)] text-[20px] h-14"
      color={color || 'success'}
      radius="none"
      spinner={
        <Stack
          className="text-white gap-x-2"
          justifyContent="center"
          alignItems="center"
        >
          Đang xử lý <LoadingDots />
        </Stack>
      }
      spinnerPlacement="end"
      {...rest}
    >
      {loading ? '' : label}
    </Button>
  );
}
