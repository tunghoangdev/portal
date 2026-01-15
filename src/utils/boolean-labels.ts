interface BooleanLabelMap {
	[key: string]: {
		true: string;
		false: string;
	};
}

export const BOOLEAN_LABELS: BooleanLabelMap = {
	is_active: {
		true: 'Hoạt động',
		false: 'Ngừng hoạt động',
	},
	is_approved: {
		true: 'Đã duyệt',
		false: 'Chưa duyệt',
	},
	is_deleted: {
		true: 'Đã xóa',
		false: 'Còn hiệu lực',
	},
	is_lock: {
		true: 'Đã khóa',
		false: 'Đang mở',
	},
	is_open: {
		false: 'Đã khóa',
		true: 'Đang mở',
	},
	is_duplicate: {
		true: 'Đã khóa',
		false: 'Đang mở',
	},
	is_business: {
		true: 'Doanh nghiệp',
		false: 'Cá nhân',
	},
	is_company: {
		true: 'Doanh nghiệp',
		false: 'Cá nhân',
	},
	is_agent: {
		true: 'Có',
		false: 'Không',
	},
	is_system: {
		true: 'Có',
		false: 'Không',
	},
	is_hide: {
		true: 'Ẩn',
		false: 'Hiển thị',
	},
	is_hot: {
		true: 'Nổi bật',
		false: ' ',
	},
	is_start: {
		true: 'Đang hoạt động',
		false: 'Đã kết thúc',
	},
	is_pass: {
		true: 'Đã đủ điều kiện',
		false: 'Chưa đủ điều kiện',
	},
	is_main: {
		true: 'Sản phẩm chính',
		false: ' ',
	},
	is_staff: {
		true: 'Nhân viên',
		false: 'Thành viên',
	},
};
