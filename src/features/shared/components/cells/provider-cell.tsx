interface Props {
  code: string;
  name: string;
}
const ProviderCell = ({ code, name }: Props) => {
  return (
    <>
      <div className="text-ellipsis font-semibold">{name}</div>
      <div className="text-ellipsis text-muted text-sm">{code}</div>
    </>
  );
};
ProviderCell.displayName = 'ProviderCell';

const ProviderRevoCell = (h: any, { props }: any) => {
  const { code, name } = props || {};
  return h('div', {}, [
    h(
      'div',
      {
        class: 'text-ellipsis font-medium',
      },
      name ?? ''
    ),
    h(
      'div',
      {
        class: 'text-ellipsis text-default-700 text-[11px]',
      },
      code ?? ''
    ),
  ]);
};
export { ProviderCell, ProviderRevoCell };
