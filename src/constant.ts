import env from "./utils/env";

export const API_BASE_URL = env.API_URL;
export const UPLOAD_IMAGE_BASE_URL = process.env.VITE_UPLOAD_IMAGE || "";
export const UPLOAD_DOC_BASE_URL = process.env.VITE_UPLOAD_DOCUMENT || "";
export const USER_DATA = "user_data";
export const TOKEN = "token";
export const HIDE_NOTIFICATION = "hideNotification";

export const PERMISSION_BUTTON_IDS = {
  CREATE: 1,
  DELETE: 2,
  UPDATE: 3,
  IMPORT: 4,
  EXPORT: 5,
  EXPORT_EXCEL: 5,
  EXPORT_EXCEL_AGENT: 44,
  LOCK: 6,
  TOGGLE_SETTING: 7,
  VIEW_HISTORY: 8,
  VIEW_DOCUMENT: 9,
  VIEW_DETAIL: 10,
  VIEW_IMAGE: 11,
  APPOINT: 12,
  APPROVE_MEMBER: 13,
  LOCK_UNLOCK_RECRUITMENT_LINK: 14,
  RESET_PASSWORD: 15,
  ACTIVE: 16,
  UPLOAD_IMAGE: 17,
  HIDE_SHOW: 18,
  APPROVE_CONTRACT: 19,
  CANCEL_APPROVE_CONTRACT: 20,
  ALLOCATE_BONUS: 21,
  RETURN_CONTRACT: 22,
  TVTC_ACTIVITY: 23,
  LOCK_UNLOCK_DUPLICATE: 24,
  LOCK_UNLOCK_ACCESS: 25,
  PERSONAL_BUSINESS: 26,
  MANAGE_APPOINTMENT: 27,
  MANAGE_BRANCH_TRANSFER: 28,
  ORDER: 29,
  POLICY_CONFIGURATION: 30,
  UPDATE_STATUS: 31,
  PERMISSION_FORM: 32,
  REMOVE_PERMISSION_FORM: 33,
  PERMISSION_BUTTON: 34,
  REMOVE_PERMISSION_BUTTON: 35,
  PURCHASE_VOLUME: 36,
  FINANCIAL_ACTIVITY: 37,
  LEVEL_UP_APPROVE: 38,
  LOCK_COMMISSION_PERIOD: 39,
  ADD_CONTRACT: 41,
  RECRUITMENT_LINK: 42,
  SALE_NONELIFE: 43,
  DOWLOAD_E_CONTRACT: 40,
  RESTORE_CONTRACT: 47,
  CANCEL_CONTRACT: 46,
  RESIGN_CONTRACT: 45,
  SAMTEK_PERMISSION_FORM: 12,
  SAMTEK_REMOVE_PERMISSION_FORM: 13,
  SAMTEK_PERMISSION_BUTTON: 14,
  SAMTEK_REMOVE_PERMISSION_BUTTON: 15,
  SAMTEK_CONFIG_LEVEL: 16,
  SAMTEK_RESET_PASSWORD: 11,
};

export const BRAND_LOGO = "/images/logo_remove_bg.png";

export const BRAND_SLOGUN_LOGO = "/images/wow_logo_square.png";

export const BRAND_LOGO_ICON = "/images/logo-icon.png";

export const AVATAR_DEFAULT = "/images/avatar_default.jpg";

export const NOTI_LEVEL = "/images/noti_level.svg";

export const CRUD_ACTIONS = {
  // Các hành động CRUD cơ bản
  ADD: "add",
  ACTIVE: "active",
  EDIT: "edit",
  DELETE: "delete",
  VIEW: "view",
  UPDATE_ACK: "updateAck",
  DETAIL: "detail",
  // Các hành động từ MORE_ACTIONS và các hành động khác
  LOG: "log",
  ORDER_HISTORY: "order-history",
  CONFIG_POLICY: "config_policy",
  CONFIG_LEVEL: "config_level",
  UPLOAD_IMAGE: "upload-image",
  PERMISSION_FORM: "permission-form",
  REMOVE_PERMISSION_FORM: "remove-permission-form",
  PERMISSION_BUTTON: "permission-button",
  REMOVE_PERMISSION_BUTTON: "remove-permission-button",
  COMMISON_LIST: "commission-list",
  REVOCATION_CONTRACT: "revocation-contract",
  STOP_FINANCIAL: "stop-financial",
  CHANGE_STATUS: "change-status",
  DOWLOAD_E_CONTRACT: "download-e-contract",
  RESIGN_CONTRACT: "resign-contract",
  APPROVE: "approve",
  APPROVE_CONTRACT: "approveContract",
  CANCEL_APPROVE_CONTRACT: "cancelApproveContract",
  LOCK: "lock",
  UNLOCK: "unlock",
  SALE_LIFE: "salesLife",
  DOWLOAD_CERTIFICATE: "download-certificate",
  SALE_NONELIFE: "salesNoneLife",
  SALE_ABROAD: "salesAbroad",
  EXPORT: "export",
  EXPORT_EXCEL: "export-excel",
  EXPORT_EXCEL_AGENT: "export-excel-agent",
  RESET_PASSWORD: "resetPassword",
  ORDER: "order",
  APPROVE_AGENT: "approveAgent",
  UNLOCK_ACCESS: "unlockAccess",
  LOCK_ACCESS: "lockAccess",
  RESTORE_CONTRACT: "restore",
  CANCEL_CONTRACT: "cancelContract",

  // Các hành động từ MORE_ACTIONS được thêm vào
  CANCEL_APPROVE: "cancelApprove",
  LOCK_REFERRAL_LINK: "lockReferralLink",
  UNLOCK_REFERRAL_LINK: "unlockReferralLink",
  OPEN_DUPLICATE: "openDuplicate",
  CLOSE_DUPLICATE: "closeDuplicate",
  SET_BUSINESS: "setBussiness",
  SET_PERSONAL: "setPersonal",
  ASSIGN_LEVEL: "assignLevel",
  CHANGE_MANAGER: "changeManager",
  RECRUITMENT_LINK: "recruitmentLink",
  LOCK_RECRUITMENT_LINK: "lockRecruitmentLink",
  UNLOCK_RECRUITMENT_LINK: "unlockRecruitmentLink",
  VIEW_CONTRACT_DETAIL: "viewContractDetail",
  VIEW_CONTRACT_COMMISSION: "viewContractCommission",
  RETURN_CONTRACT: "returnContract",
  UPDATE_CONTRACT_STATUS: "updateContractStatus",
  VIEW_DETAIL_CUSTOMER: "viewDetailCustomer",
  CANCEL_APPROVE_AGENT: "cancelApproveAgent",
  ACTIVE_FINANCIAL: "activeFinancial",
  DEACTIVE_FINANCIAL: "deactiveFinancial",
  LEVEL_UP_APPROVE: "levelUpApprove",
  LOCK_COMMISSION_PERIOD: "lockCommissionPeriod",
  UNLOCK_COMMISSION_PERIOD: "unLockCommissionPeriod",
  //  CÁC HÀNH ĐỘNG CỦA MORE_ACTIONS
  DELETE_ASSIGN_LEVEL: "deleteAssignLevel",
  CANCEL_ASSIGN_LEVEL: "cancelAssignLevel",
  DELETE_CHANGE_MANAGER: "deleteChangeManager",
  CANCEL_CHANGE_MANAGER: "cancelChangeManager",
  APPROVE_ASSIGN_LEVEL: "approveAssignLevel",
  APPROVE_CHANGE_MANAGER: "approveChangeManager",
  ADD_CONTRACT: "addContract",

  SAMTEK_PERMISSION_FORM: "samtek-permission-form",
  SAMTEK_REMOVE_PERMISSION_FORM: "samtek-remove-permission-form",
  SAMTEK_PERMISSION_BUTTON: "samtek-permission-button",
  SAMTEK_REMOVE_PERMISSION_BUTTON: "samtek-remove-permission-button",
  SAMTEK_CONFIG_LEVEL: "samtek-config-level",
  SAMTEK_RESET_PASSWORD: "samtek-reset-password",
} as const;

export const CRUD_ACTION_TO_PERMISSION = {
  [CRUD_ACTIONS.ADD]: PERMISSION_BUTTON_IDS.CREATE,
  [CRUD_ACTIONS.ACTIVE]: PERMISSION_BUTTON_IDS.ACTIVE,
  [CRUD_ACTIONS.UPLOAD_IMAGE]: PERMISSION_BUTTON_IDS.UPLOAD_IMAGE,
  [CRUD_ACTIONS.PERMISSION_FORM]: PERMISSION_BUTTON_IDS.PERMISSION_FORM,
  [CRUD_ACTIONS.REMOVE_PERMISSION_FORM]:
    PERMISSION_BUTTON_IDS.REMOVE_PERMISSION_FORM,
  [CRUD_ACTIONS.PERMISSION_BUTTON]: PERMISSION_BUTTON_IDS.PERMISSION_BUTTON,
  [CRUD_ACTIONS.REMOVE_PERMISSION_BUTTON]:
    PERMISSION_BUTTON_IDS.REMOVE_PERMISSION_BUTTON,
  [CRUD_ACTIONS.EDIT]: PERMISSION_BUTTON_IDS.UPDATE,
  [CRUD_ACTIONS.DELETE]: PERMISSION_BUTTON_IDS.DELETE,
  [CRUD_ACTIONS.VIEW]: PERMISSION_BUTTON_IDS.VIEW_DETAIL,
  [CRUD_ACTIONS.UPDATE_ACK]: PERMISSION_BUTTON_IDS.VIEW_DETAIL,
  [CRUD_ACTIONS.DETAIL]: PERMISSION_BUTTON_IDS.VIEW_DETAIL,
  [CRUD_ACTIONS.LOG]: PERMISSION_BUTTON_IDS.VIEW_HISTORY,
  [CRUD_ACTIONS.ORDER_HISTORY]: PERMISSION_BUTTON_IDS.PURCHASE_VOLUME,
  [CRUD_ACTIONS.CONFIG_POLICY]: PERMISSION_BUTTON_IDS.POLICY_CONFIGURATION,
  [CRUD_ACTIONS.COMMISON_LIST]: PERMISSION_BUTTON_IDS.ALLOCATE_BONUS,
  [CRUD_ACTIONS.REVOCATION_CONTRACT]: PERMISSION_BUTTON_IDS.RETURN_CONTRACT,
  [CRUD_ACTIONS.STOP_FINANCIAL]: PERMISSION_BUTTON_IDS.FINANCIAL_ACTIVITY,
  [CRUD_ACTIONS.CHANGE_STATUS]: PERMISSION_BUTTON_IDS.FINANCIAL_ACTIVITY,
  [CRUD_ACTIONS.APPROVE]: PERMISSION_BUTTON_IDS.APPROVE_CONTRACT,
  [CRUD_ACTIONS.LOCK]: PERMISSION_BUTTON_IDS.LOCK,
  // [CRUD_ACTIONS.SALE_LIFE]: PERMISSION_BUTTON_IDS.PURCHASE_VOLUME,
  // [CRUD_ACTIONS.SALE_NONELIFE]: PERMISSION_BUTTON_IDS.SALE_NONELIFE,
  [CRUD_ACTIONS.EXPORT]: PERMISSION_BUTTON_IDS.EXPORT,
  [CRUD_ACTIONS.EXPORT_EXCEL]: PERMISSION_BUTTON_IDS.EXPORT_EXCEL,
  [CRUD_ACTIONS.EXPORT_EXCEL_AGENT]: PERMISSION_BUTTON_IDS.EXPORT_EXCEL_AGENT,
  [CRUD_ACTIONS.RESET_PASSWORD]: PERMISSION_BUTTON_IDS.RESET_PASSWORD,
  [CRUD_ACTIONS.ORDER]: PERMISSION_BUTTON_IDS.ORDER,
  [CRUD_ACTIONS.APPROVE_AGENT]: PERMISSION_BUTTON_IDS.APPROVE_MEMBER,
  [CRUD_ACTIONS.UNLOCK_ACCESS]: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_ACCESS,
  [CRUD_ACTIONS.LOCK_ACCESS]: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_ACCESS,

  // Các permission cho các hành động mới được thêm vào
  [CRUD_ACTIONS.CANCEL_APPROVE]: PERMISSION_BUTTON_IDS.APPROVE_MEMBER, // Cần định nghĩa ID này
  [CRUD_ACTIONS.LOCK_REFERRAL_LINK]:
    PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK, // Cần định nghĩa ID này
  [CRUD_ACTIONS.UNLOCK_REFERRAL_LINK]:
    PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK, // Cần định nghĩa ID này
  [CRUD_ACTIONS.OPEN_DUPLICATE]: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_DUPLICATE, // Cần định nghĩa ID này
  [CRUD_ACTIONS.CLOSE_DUPLICATE]: PERMISSION_BUTTON_IDS.LOCK_UNLOCK_DUPLICATE, // Cần định nghĩa ID này
  [CRUD_ACTIONS.SET_BUSINESS]: PERMISSION_BUTTON_IDS.PERSONAL_BUSINESS, // Cần định nghĩa ID này
  [CRUD_ACTIONS.SET_PERSONAL]: PERMISSION_BUTTON_IDS.PERSONAL_BUSINESS, // Cần định nghĩa ID này
  [CRUD_ACTIONS.ASSIGN_LEVEL]: PERMISSION_BUTTON_IDS.MANAGE_APPOINTMENT, // Cần định nghĩa ID này
  [CRUD_ACTIONS.CHANGE_MANAGER]: PERMISSION_BUTTON_IDS.MANAGE_BRANCH_TRANSFER,
  [CRUD_ACTIONS.LOCK_RECRUITMENT_LINK]:
    PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK, // Cần định nghĩa ID này
  [CRUD_ACTIONS.UNLOCK_RECRUITMENT_LINK]:
    PERMISSION_BUTTON_IDS.LOCK_UNLOCK_RECRUITMENT_LINK, // Cần định nghĩa ID này
  [CRUD_ACTIONS.VIEW_CONTRACT_DETAIL]: PERMISSION_BUTTON_IDS.VIEW_DETAIL, // Cần định nghĩa ID này
  [CRUD_ACTIONS.VIEW_CONTRACT_COMMISSION]: PERMISSION_BUTTON_IDS.VIEW_DETAIL, // Cần định nghĩa ID này
  [CRUD_ACTIONS.RETURN_CONTRACT]: PERMISSION_BUTTON_IDS.RETURN_CONTRACT,
  [CRUD_ACTIONS.UPDATE_CONTRACT_STATUS]: PERMISSION_BUTTON_IDS.UPDATE_STATUS, // Có thể dùng lại ID UPDATE_STATUS
  [CRUD_ACTIONS.CANCEL_APPROVE_AGENT]: PERMISSION_BUTTON_IDS.APPROVE_MEMBER, // Cần định nghĩa ID này
  [CRUD_ACTIONS.ACTIVE_FINANCIAL]: PERMISSION_BUTTON_IDS.FINANCIAL_ACTIVITY,
  [CRUD_ACTIONS.DEACTIVE_FINANCIAL]: PERMISSION_BUTTON_IDS.FINANCIAL_ACTIVITY,
  [CRUD_ACTIONS.LEVEL_UP_APPROVE]: PERMISSION_BUTTON_IDS.LEVEL_UP_APPROVE, // Cần định nghĩa ID này
  [CRUD_ACTIONS.LOCK_COMMISSION_PERIOD]:
    PERMISSION_BUTTON_IDS.LOCK_COMMISSION_PERIOD, // Cần định nghĩa ID này
  [CRUD_ACTIONS.UNLOCK_COMMISSION_PERIOD]:
    PERMISSION_BUTTON_IDS.LOCK_COMMISSION_PERIOD, // Cần định nghĩa ID này

  // Hành động DETAIL không cần permission vì thường là public
  [CRUD_ACTIONS.RECRUITMENT_LINK]: PERMISSION_BUTTON_IDS.RECRUITMENT_LINK,
  [CRUD_ACTIONS.APPROVE_CONTRACT]: PERMISSION_BUTTON_IDS.APPROVE_CONTRACT,
  [CRUD_ACTIONS.CANCEL_APPROVE_CONTRACT]:
    PERMISSION_BUTTON_IDS.CANCEL_APPROVE_CONTRACT,
  [CRUD_ACTIONS.ADD_CONTRACT]: PERMISSION_BUTTON_IDS.ADD_CONTRACT,
  [CRUD_ACTIONS.DOWLOAD_E_CONTRACT]: PERMISSION_BUTTON_IDS.DOWLOAD_E_CONTRACT,
  [CRUD_ACTIONS.RESTORE_CONTRACT]: PERMISSION_BUTTON_IDS.RESTORE_CONTRACT,
  [CRUD_ACTIONS.CANCEL_CONTRACT]: PERMISSION_BUTTON_IDS.CANCEL_CONTRACT,
  [CRUD_ACTIONS.RESIGN_CONTRACT]: PERMISSION_BUTTON_IDS.RESIGN_CONTRACT,
  [CRUD_ACTIONS.SAMTEK_PERMISSION_BUTTON]:
    PERMISSION_BUTTON_IDS.SAMTEK_PERMISSION_BUTTON,
  [CRUD_ACTIONS.SAMTEK_REMOVE_PERMISSION_BUTTON]:
    PERMISSION_BUTTON_IDS.SAMTEK_REMOVE_PERMISSION_BUTTON,
  [CRUD_ACTIONS.SAMTEK_PERMISSION_FORM]:
    PERMISSION_BUTTON_IDS.SAMTEK_PERMISSION_FORM,
  [CRUD_ACTIONS.SAMTEK_REMOVE_PERMISSION_FORM]:
    PERMISSION_BUTTON_IDS.SAMTEK_REMOVE_PERMISSION_FORM,
  [CRUD_ACTIONS.SAMTEK_CONFIG_LEVEL]: PERMISSION_BUTTON_IDS.SAMTEK_CONFIG_LEVEL,
  [CRUD_ACTIONS.SAMTEK_RESET_PASSWORD]:
    PERMISSION_BUTTON_IDS.SAMTEK_RESET_PASSWORD,
} as const;

export const EXCLUDE_ACTIONS = [
  CRUD_ACTIONS.DETAIL,
  // CRUD_ACTIONS.VIEW,
  CRUD_ACTIONS.DELETE_ASSIGN_LEVEL,
  CRUD_ACTIONS.CANCEL_ASSIGN_LEVEL,
  CRUD_ACTIONS.DELETE_CHANGE_MANAGER,
  CRUD_ACTIONS.CANCEL_CHANGE_MANAGER,
  CRUD_ACTIONS.APPROVE_ASSIGN_LEVEL,
  CRUD_ACTIONS.APPROVE_CHANGE_MANAGER,
];
export enum MORE_ACTIONS {
  RESET_PASSWORD = "resetPassword",
  CANCEL_APPROVE = "cancelApprove",
  LOCK_REFERRAL_LINK = "lockReferralLink",
  UNLOCK_REFERRAL_LINK = "unlockReferralLink",
  OPEN_DUPLICATE = "openDuplicate",
  CLOSE_DUPLICATE = "closeDuplicate",
  SET_BUSINESS = "setBussiness",
  SET_PERSONAL = "setPersonal",
  ASSIGN_LEVEL = "assignLevel",
  CHANGE_MANAGER = "changeManager",
  RECRUITMENT_LINK = "recruitmentLink",
  CONFIG_POLICY = "configPolicy",
  VIEW_CONTRACT_DETAIL = "viewContractDetail",
  VIEW_CONTRACT_COMMISSION = "viewContractCommission",
  RETURN_CONTRACT = "returnContract",
  UPDATE_CONTRACT_STATUS = "updateContractStatus",
  VIEW_DETAIL = "viewDetail",
  VIEW_DETAIL_CUSTOMER = "viewDetailCustomer",
  APPROVE_AGENT = "approveAgent",
  CANCEL_APPROVE_AGENT = "cancelApproveAgent",
  ACTIVE_FINANCIAL = "activeFinancial",
  DEACTIVE_FINANCIAL = "deactiveFinancial",
  LEVEL_UP_APPROVE = "levelUpApprove",
  LOCK_COMMISSION_PERIOD = "lockCommissionPeriod",
  UNLOCK_COMMISSION_PERIOD = "unLockCommissionPeriod",
  LOCK_ACCESS = "lockAccess",
  UNLOCK_ACCESS = "unlockAccess",
}

export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
  STAFF: "staff",
  SAMTEK: "samtek",
};

export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
};

export const DEFAULLT_PAGE_SIZE = 100;

export const DEFAULT_PARAMS = {
  info: "",
  page_num: 1,
  page_size: DEFAULLT_PAGE_SIZE,
};

export const ERROR_CODES: Record<string, string> = {
  "1": "Token không hợp lệ",
  "2": "Truy cập không hợp lệ",
  "3": "Cấu trúc dữ liệu không hợp lệ",
  "4": "Dữ liệu đã được tham chiếu, không thể thực hiện được, vui lòng kiểm tra lại",
  "5": "Không tìm thấy dữ liệu này trong hệ thống, vui lòng kiểm tra lại",
  "6": "Dữ liệu không đúng định dạng, vui lòng kiểm tra lại",
  "7": "Dữ liệu quá lớn so với cấu hình hệ thống, vui lòng kiểm tra lại",
  "8": "Đăng nhập thất bại, vui lòng kiểm tra lại",
  "9": "Email này đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "10": "Số CCCD đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "11": "Mã số thuế đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "12": "Số điện thoại đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "13": "Số tài khoản ngân hàng đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "14": "Không thể cập nhật thông tin vào tài khoản admin, vui lòng kiểm tra lại",
  "15": "Dữ liệu này đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "16": "Dữ liệu này đã bị khóa, vui lòng kiểm tra lại",
  "17": "Bạn không có quyền, vui lòng kiểm tra lại",
  "18": "Bạn không có quyền truy cập, vui lòng liên hệ với quản trị viên",
  "19": "Bạn không có quyền thao tác, vui lòng liên hệ với quản trị viên",
  "20": "Mật khẩu mới giống mật khẩu hiện tại, vui lòng kiểm tra lại",
  "21": "Mật khẩu cũ không đúng, vui lòng kiểm tra lại",
  "22": "Ngày sinh chưa hợp lệ vì dưới 18 tuổi, vui lòng kiểm tra lại",
  "23": "Thời gian nhập vào lớn hơn thời gian thực tế hiện tại, vui lòng kiểm tra lại",
  "24": "Link tuyển dụng đã bị khóa, vui lòng kiểm tra lại",
  "25": "Khởi tạo mã đăng nhập lỗi, vui lòng kiểm tra lại",
  "26": "Mã OTP không tìm thấy trong hệ thống, vui lòng kiểm tra lại",
  "27": "Mã OTP hết hạn, vui lòng kiểm tra lại",
  "28": "Số nhập vào hiện tại không hợp lệ (phải lớn hơn 0), vui lòng kiểm tra lại",
  "29": "Số hợp đồng này đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "30": "Số giấy yêu cầu đã tồn tại trong hệ thống, vui lòng kiểm tra lại",
  "31": "Kỳ tính thưởng đã khóa, vui lòng kiểm tra lại",
  "32": "Chưa đủ điều kiện để phát hành hợp đồng điện tử",
};

export const TOOLBAR_ACTION_TYPES: any = {
  ADD: "add",
  BULK_EDIT: "bulk-edit",
  BULK_DELETE: "bulk-delete",
  EXPORT_EXCEL: "export-excel",
  EXPORT_PDF: "export-pdf",
  SEARCH: "search",
  ENTER: "enter",
};

export const ACTION_EXPORT_EXCELS = ["export-excel", "export-excel-agent"];
