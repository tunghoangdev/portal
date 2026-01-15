import { getFullFtpUrl } from '~/lib/auth';
import { Link, MyImage } from '~/components/ui';
const ImageCell = ({
  fileName = '',
  folderPath = 'notify',
  label = 'Xem hình',
  showLabel = false,
}) => {
  if (!fileName) return null;
  const url = getFullFtpUrl(folderPath, fileName);
  return (
    <Link
      href={url}
      target="_blank"
      rel="noreferrer"
      className="cursor-pointer"
    >
      {showLabel ? (
        <span className="text-xs text-primary">{label}</span>
      ) : (
        <div className="w-10 h-10 bg-[#EDB506] rounded-lg flex items-center justify-center relative overflow-hidden">
          <MyImage src={url} alt="image" className="object-cover" fill />
        </div>
      )}

      {/* <img
        src={url}
        alt="image"
        className="w-10 h-10 object-cover rounded-lg"
      /> */}
    </Link>
  );
};
ImageCell.displayName = 'ImageCell';

const ImageRevoCell = (h: any, { props }: any) => {
  const {
    fileName = '',
    folderPath = 'notify',
    label = 'Xem hình',
    showLabel = false,
  } = props || {};

  if (!fileName) return null;

  const url = getFullFtpUrl(folderPath, fileName);

  return h(
    'a',
    {
      href: url,
      target: '_blank',
      rel: 'noreferrer',
      class: 'cursor-pointer',
    },
    showLabel
      ? h('span', { class: 'text-xs text-primary' }, label)
      : h(
          'div',
          {
            class:
              'size-10 bg-[#EDB506] rounded-lg flex items-center justify-center relative overflow-hidden',
          },
          [
            h('img', {
              src: url,
              alt: 'image',
              class: 'object-cover absolute inset-0 w-full h-full',
            }),
          ]
        )
  );
};

export { ImageCell, ImageRevoCell };
