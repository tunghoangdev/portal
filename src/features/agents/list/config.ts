import { MENU_SETTINGS } from '@/configs/menu';
import URLS from '@/configs/urls';
import { CRUD_ACTIONS, MORE_ACTIONS, PERMISSION_BUTTON_IDS } from '@/constant';

export const QUERY = {
	list: URLS.staff.agents.list.list,
	create: URLS.staff.agents.list.create,
	update: URLS.staff.agents.list.update,
	delete: URLS.staff.agents.list.delete,
	logList: URLS.staff.agents.list.logList,
	approve: URLS.staff.agents.list.approve,
	resetPassword: URLS.staff.agents.list.resetPassword,
	lock: URLS.staff.agents.list.lock,
	refLock: URLS.staff.agents.list.refLock,
	openDuplicate: URLS.staff.agents.list.openDuplicate,
	setBusiness: URLS.staff.agents.list.setBusiness,
	assignLevel: {
		list: URLS.staff.agents.list.assignLevel.list,
		create: URLS.staff.agents.list.assignLevel.create,
		update: URLS.staff.agents.list.assignLevel.update,
		delete: URLS.staff.agents.list.assignLevel.delete,
		approve: URLS.staff.agents.list.assignLevel.approve,
		cancel: URLS.staff.agents.list.assignLevel.cancel,
	},
	changeManager: {
		list: URLS.staff.agents.list.changeManager.list,
		create: URLS.staff.agents.list.changeManager.create,
		update: URLS.staff.agents.list.changeManager.update,
		delete: URLS.staff.agents.list.changeManager.delete,
		approve: URLS.staff.agents.list.changeManager.approve,
		cancel: URLS.staff.agents.list.changeManager.cancel,
	},

	commissionGeneral: URLS.agent.dashboard.commissionGeneral,
	commissionGeneralDetail: URLS.agent.dashboard.commissionGeneralDetail,
	commissionGeneralChart: URLS.agent.dashboard.commissionGeneralChart,
	levelUpProcess: URLS.agent.dashboard.levelUpProcess,
	listChildLevelUp: URLS.agent.dashboard.listChildLevelUp,
	listChildByStatus: URLS.agent.dashboard.listChildByStatus,
	newAgentWeek: URLS.agent.dashboard.newAgentWeek,
	newAgentMonth: URLS.agent.dashboard.newAgentMonth,
	topAgentList: URLS.agent.dashboard.topAgentList,
	agentMonthChart: URLS.agent.dashboard.agentMonthChart,
	listChildByLevel: URLS.agent.dashboard.listChildByLevel,
	agentLevelMax: URLS.agent.dashboard.agentLevelMax,
};

export const ID_FORM = MENU_SETTINGS.staff.agents.list.idForm;

export const MAIN_LABEL = 'thành viên';

export const SELECTOR_KEY = 'agent_name';

export const COLUMN_PINNING = {
	left: ['agent_name'],
	right: [],
};

export const SETTINGS = ['export', 'search', 'create', 'dateFilter'];

export const EXTRA_ACTIONS = [
	{
		id: CRUD_ACTIONS.EDIT,
		title: 'Cập nhật',
		icon: 'edit',
		// isHidden: (row: any) => row.id_agent_status > 1,
	},
	// {
	// 	id: CRUD_ACTIONS.DELETE,
	// 	title: 'Xóa',
	// 	icon: 'trash',
	// 	isHidden: (row: any) => row?.id_agent_status > 1,
	// },
	{
		id: CRUD_ACTIONS.APPROVE_AGENT,
		title: 'Duyệt thành viên',
		icon: 'circleCheck',
		url: 'approve',
		permission: PERMISSION_BUTTON_IDS.APPROVE_MEMBER,
		isHidden: (row: any) => {
			return row?.id_agent_status === 2;
		},
	},
	{
		id: CRUD_ACTIONS.APPROVE_AGENT,
		title: 'Hủy duyệt thành viên',
		icon: 'closeCircle',
		permission: PERMISSION_BUTTON_IDS.APPROVE_MEMBER,
		url: 'approve',
		isHidden: (row: any) => row?.id_agent_status !== 2,
	},
	{
		id: CRUD_ACTIONS.RESET_PASSWORD,
		title: 'Đặt lại mật khẩu',
		icon: 'lock',
		url: 'resetPasswordAgent',
		permission: PERMISSION_BUTTON_IDS.RESET_PASSWORD,
		callbackName: 'onResetPassword',
	},
	{
		id: CRUD_ACTIONS.LOCK_ACCESS,
		title: 'Khóa truy cập',
		icon: 'lock',
		permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_ACCESS,
		isHidden: (row: any) => row?.is_lock,
		url: 'lock',
	},
	{
		id: CRUD_ACTIONS.UNLOCK_ACCESS,
		title: 'Mở khóa truy cập',
		icon: 'unlock',
		permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_ACCESS,
		isHidden: (row: any) => !row?.is_lock,
		url: 'lock',
	},
	{
		id: CRUD_ACTIONS.LOCK_REFERRAL_LINK,
		title: 'Khóa tuyển dụng',
		icon: 'lock',
		permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK,
		url: 'refLock',
		isHidden: (row: any) => !row?.is_open,
	},
	{
		id: CRUD_ACTIONS.UNLOCK_REFERRAL_LINK,
		title: 'Mở khóa tuyển dụng',
		icon: 'unlock',
		permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK,
		url: 'refLock',
		isHidden: (row: any) => row?.is_open,
	},
	// {
	// 	id: CRUD_ACTIONS.OPEN_DUPLICATE,
	// 	title: 'Cho phép Mở trùng TV',
	// 	icon: 'copy',
	// 	url: 'openDuplicate',
	// 	permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_DUPLICATE,
	// 	isHidden: (row: any) => row?.is_duplicate,
	// },
	// {
	// 	id: CRUD_ACTIONS.CLOSE_DUPLICATE,
	// 	title: 'Không phép Mở trùng TV',
	// 	url: 'openDuplicate',
	// 	icon: 'close',
	// 	permission: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_DUPLICATE,
	// 	isHidden: (row: any) => !row?.is_duplicate,
	// },
	{
		id: CRUD_ACTIONS.SET_BUSINESS,
		title: 'Kích hoạt doanh nghiệp',
		icon: 'briefcaseBusiness',
		url: 'setBussiness',
		permission: PERMISSION_BUTTON_IDS.PERSONAL_BUSINESS,
		isHidden: (row: any) => row?.is_business,
	},
	{
		id: CRUD_ACTIONS.SET_PERSONAL,
		title: 'Kích hoạt cá nhân',
		icon: 'userRounded',
		url: 'setBussiness',
		permission: PERMISSION_BUTTON_IDS.PERSONAL_BUSINESS,
		isHidden: (row: any) => !row?.is_business,
	},

	{
		id: CRUD_ACTIONS.ASSIGN_LEVEL,
		title: 'Quản lý bổ nhiệm',
		icon: 'usersRounded',
		permission: PERMISSION_BUTTON_IDS.MANAGE_APPOINTMENT,
	},
	{
		id: CRUD_ACTIONS.CHANGE_MANAGER,
		title: 'Quản lý chuyển nhánh',
		icon: 'gitBranch',
		permission: PERMISSION_BUTTON_IDS.MANAGE_BRANCH_TRANSFER,
	},
	{
		id: CRUD_ACTIONS.RECRUITMENT_LINK,
		title: 'Link tuyển dụng',
		icon: 'link',
	},
	{
		id: CRUD_ACTIONS.EXPORT_EXCEL_AGENT,
		title: 'Xuất hệ thống',
		icon: 'file',
		// isHidden: (row: any) => row.id_agent_status > 1,
	},
];
