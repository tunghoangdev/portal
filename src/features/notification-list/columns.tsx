import type { BaseColumnOptions } from '~/types/data-table-type';
import {
  FileDowloadCell,
  HotCell,
  ImageCell,
  PermissionCell,
  ShowHideCell,
} from '~/features/shared/components/cells';

export const columns: BaseColumnOptions<any>[] = [
  {
    title: 'Tên tài liệu',
    key: 'announcement_name',
    render: (row) => (
      <HotCell isHot={row.is_hot} value={row.announcement_name} />
    ),
    width: 250,
  },

  {
    title: 'Hình ảnh',
    key: 'announcement_image',
    render: (row) => (
      <ImageCell fileName={row.announcement_image} folderPath={'notify'} />
    ),
  },
  {
    title: 'Link tài liệu',
    key: 'announcement_file',
    render: (row) => (
      <FileDowloadCell
        fileName={row.announcement_file}
        label={'Xem tài liệu'}
      />
    ),
  },
  {
    title: 'Nổi bật',
    key: 'is_hot',
    align: 'center',
    render: (row) => <HotCell isHot={row.is_hot} />,
    width: 100,
  },
  {
    title: 'Ẩn thông báo',
    key: 'is_hide',
    align: 'center',
    render: (row) => <ShowHideCell isShow={!row.is_hide} />,
    width: 140,
  },
  {
    title: 'Quyền xem',
    key: 'permission_doc',
    render: (row) => <PermissionCell row={row} />,
    width: 350,
    hiddenExport: true,
  },
  {
		title: 'Quyền xem',
		key: 'permission_doc_name',
		exportable: true,
		exportTitle: 'Quyền xem',
	},
  {
    title: 'Ngày khởi tạo',
    key: 'created_date',
    align: 'center',
    type: 'date',
    width: 120,
  },
];
