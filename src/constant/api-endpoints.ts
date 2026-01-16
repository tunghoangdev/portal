type CrudEndpoints = {
  list: string;
  create?: string;
  update?: string;
  delete?: string;
  get?: string;
  logList?: string;
};

type EndpointConfig = {
  prefix?: string;
  suffix?: string;
};

/**
 * Tạo các endpoint CRUD cơ bản
 */
const createCrudEndpoints = (
  basePath: string,
  config: EndpointConfig = {}
): CrudEndpoints => {
  const { prefix = "", suffix = "" } = config;
  return {
    list: `${prefix}/${basePath}/list${suffix}`,
    create: `${prefix}/${basePath}/create${suffix}`,
    update: `${prefix}/${basePath}/update${suffix}`,
    delete: `${prefix}/${basePath}/delete${suffix}`,
    logList: `${prefix}/${basePath}/log_list${suffix}`,
  };
};

/**
 * Tạo các endpoint dictionary
 */
const createDicEndpoint = (path: string): string => `/${path}/dic`;

/**
 * Tạo các endpoint cơ bản
 */
const createBasicEndpoints = <T extends Record<string, string>>(
  basePath: string,
  endpoints: T
): T => {
  const result: Record<string, string> = {};
  for (const key in endpoints) {
    result[key] = `/${basePath}${endpoints[key]}`;
  }
  return result as T;
};

/**
 * Tạo các endpoint dashboard
 */
const createDashboardEndpoints = (prefix: string) => {
  return {
    commissionGeneral: `${prefix}/dashboard/commission_general`,
    commissionGeneralDetail: `${prefix}/dashboard/commission_general_detail`,
    commissionGeneralChart: `${prefix}/dashboard/commission_general_chart`,
    levelUpProcess: `${prefix}/dashboard/level_up_process`,
    listChildLevelUp: `${prefix}/dashboard/list_child_level_up`,
    listChildByStatus: `${prefix}/dashboard/list_child_by_status`,
    newAgentWeek: `${prefix}/dashboard/new_agent_week`,
    newAgentMonth: `${prefix}/dashboard/new_agent_month`,
    topAgentList: `${prefix}/dashboard/top_agent_list`,
    agentMonthChart: `${prefix}/dashboard/agent_month_chart`,
    listChildByLevel: `${prefix}/dashboard/list_child_by_level`,
    listAgentProvince: `${prefix}/dashboard/agent_province_chart`,
    listAgentBirthday: `${prefix}/dashboard/agent_month_birthday`,
  };
};

export const NORMALIZE_URLS = ["/login", "/register", "/", "/404"];
export const API_ENDPOINTS: Record<string, any> = {
  upload: createBasicEndpoints("system/upload", {
    avatar: "/image_avt",
    imageNotify: "/image_notify",
    file: "/file",
    cccd: "/image_cccd",
  }),
  common: createBasicEndpoints("system", {
    getDateRange: "/reporting_period/get",
    getListPeriod: "/reporting_period/list",
    getListPeriodMonth: "/reporting_period/list_month",
    getCommission: "/assign/commission",
  }),
  dic: {
    bank: createDicEndpoint("bank"),
    issuedPlace: createDicEndpoint("issued_place"),
    province: createDicEndpoint("province"),
    district: createDicEndpoint("district"),
    commune: createDicEndpoint("commune"),
    permission: createDicEndpoint("permission"),
    documentType: createDicEndpoint("document_type"),
    documentTypeInternal: createDicEndpoint("document_internal_type"),
    agentLevel: createDicEndpoint("agent_level"),
    agentLevelAll: createDicEndpoint("agent_level_all"),
    income: createDicEndpoint("income"),
    incomeParent: createDicEndpoint("income_parent"),
    outcome: createDicEndpoint("outcome"),
    outcomeParent: createDicEndpoint("outcome_parent"),
    nonLifeProvider: createDicEndpoint("none_life_provider"),
    nonLifeProductByProvider: createDicEndpoint("none_life_product_provider"),
    lifeProvider: createDicEndpoint("life_provider"),
    lifeProductByProvider: createDicEndpoint("life_product_main"),
    lifeType: createDicEndpoint("life_type"),
    feeTimes: createDicEndpoint("fee_times"),
    lifeFinanByProvider: createDicEndpoint("life_finan"),
    lifeSubProductByMain: createDicEndpoint("life_product_sub"),
    agentStatus: createDicEndpoint("agent_status"),
    contractLifeStatus: createDicEndpoint("life_status"),
    commissionPeriod: createDicEndpoint("commission_period"),
    commissionType: createDicEndpoint("commission_type"),
    optionContract: createDicEndpoint("agent_option"),
    abroadProvider: createDicEndpoint("abroad_provider"),
    abroadProduct: createDicEndpoint("abroad_product"),
    abroadProductByProvider: createDicEndpoint("abroad_product_provider"),
  },
  dashboard: {
    ...createDashboardEndpoints(""),
    agentLevelMax: "/agent_level/max",
    agentLevelUpProcess: "/dashboard/level_up_process",
    lifeContract: "/dashboard/life_contract/mtd_ytd",
    noneLifeContract: "/dashboard/none_life_contract/mtd_ytd",
    abroadContract: "/dashboard/abroad_contract/mtd_ytd",
    generalChart: "/dashboard/xfyp_general_chart",
    newAgentWeek: "/dashboard/new_agent_week",
    newAgentMonth: "/dashboard/new_agent_month",
    topAgentList: "/dashboard/top_agent_list",
    // agent: {
    // 	lifeContract: '/dashboard/life_contract/mtd_ytd',
    // 	noneLifeContract: '/dashboard/none_life_contract/mtd_ytd',
    // 	generalChart: '/dashboard/xfyp_general_chart',
    // 	newAgentWeek: '/dashboard/new_agent_week',
    // 	newAgentMonth: '/dashboard/new_agent_month',
    // 	topAgentList: '/dashboard/top_agent_list',
    // },
  },
  permission: {
    getAccessForm: "/staff/permission_access_form/get",
    checkPermissionButton: "/staff/permission_access_button/action",
  },
  auth: {
    businessCheck: "/business/check",
    businessCheckPhone: "/business/check_phone",
    businessCheckCode: "/business/check_staff_code",
    updatePassword: {
      agent: "/agent/new_password/update",
      staff: "/staff/new_password/update",
    },
    login: {
      agent: "/agent/login",
      staff: "/staff/login",
      financial: "/financial/login",
      sbank: "/supervisor/login",
      customer: "/customer/login",
      root: "/root/staff/login",
    },
    register: {
      agent: "/register",
      checkPhone: "/check_phone",
      checkEmail: "/check_email",
      genOtp: "/gen_otp",
      verifyOtp: "/verify_otp",
    },
    profile: {
      changePassword: "/change_password",
      changeAvatar: "/change_avatar",
      get: "/get",
      update: "/update",
    },
    members: {
      getList: "list",
    },
  },
  customer: {
    search: {
      byPhone: "/customer_phone/search",
    },
  },
  agent: {
    search: {
      byPhone: "/agent_phone/search",
      byParent: "/agent_parent/search",
      byStaffCode: "/staff_code/search",
    },
    changeEmail: "/agent/update_email",
    individual: {
      nonLifeInsurance: {
        list: "/none_life_individual/list",
        customer: "/customer/none_life_individual/list",
      },
      lifeInsurance: {
        list: "/life_individual/list",
        customer: "/customer/life_individual/list",
      },
      abroad: {
        list: "/abroad_individual/list",
        customer: "/customer/abroad_individual/list",
        commission: "/abroad_contract_commission/list",
      },
    },
    commissionTable: {
      list: "/commission_table/list_group",
      export: "/commission_table/export",
      exportPdf: "/commission_table/export_pdf",
    },
    customers: createCrudEndpoints("customer"),
    abroad: {
      detail: {
        list: "/abroad_detail/list",
      },
      processing: {
        processingList: "/abroad_processing/list",
        ...createCrudEndpoints("abroad_contract", { prefix: "" }),
        get: "/abroad_contract/get",
      },
      done: {
        list: "/abroad_done/list",
        commission: "/abroad_contract_commission/list",
      },
    },
    lifeInsurance: {
      detail: {
        list: "/life_detail/list",
      },
      processing: {
        processingList: "/life_processing/list",
        ...createCrudEndpoints("life_contract", { prefix: "" }),
        get: "/life_contract/get",
        updateStatus: "/life_contract_status/update",
        create: "/agent/life_contract/create",
        search: "/agent/life_contract/search",
      },
      done: {
        list: "/life_done/list",
        commission: "/life_contract_commission/list",
      },
      canceled: {
        list: "/life_processing_cancel/list",
        commission: "/life_contract_commission/list",
      },
      feeDue: {
        list: "/life_fee_due/list",
      },
      lostEffective: {
        list: "/life_lost_effective/list",
      },
    },
    nonLifeInsurance: {
      detail: {
        list: "/none_life_detail/list",
      },
      processing: {
        processingList: "/none_life_processing/list",
        ...createCrudEndpoints("none_life_contract", { prefix: "" }),
        get: "/none_life_contract/get",
      },
      done: {
        list: "/none_life_done/list",
        commission: "/none_life_contract_commission/list",
      },
    },
    documents: {
      members: {
        list: "/document/list",
      },
    },
    notifications: {
      list: "/notify_announcemnet/list",
    },
    levelUpReport: {
      list: "/agent_level_up/report",
    },
    promotionHistory: {
      list: "/agent_level_up/log_list",
    },
    dashboard: {
      ...createDashboardEndpoints(""),
      agentLevelMax: "/agent_level/max",
      agentLevelUpProcess: "/agent/dashboard/level_up_process",
    },
    list: "/list",
    levelUp: {
      list: "/agent_level_up/list",
      report: "/agent_level_up/report",
      log: "/agent_level_up/log_list",
    },
    profile: {
      changePassword: "/agent/change_password",
      changeAvatar: "/agent/change_avatar",
      get: "/agent/get",
      update: "/agent/update",
    },
    company: {
      configLevel: {
        list: "/level_up_config/list",
        update: "/level_up_config/update",
        get: "/level_up_config/get",
        log: "/level_up_config/log_list",
      },
      escrow: {
        list: "/escrow/list",
      },
      escrowReport: {
        list: "/escrow_report/list",
      },
      commissionTable: {
        list: "/commission_table/list_group",
      },
      meeting: {
        ...createCrudEndpoints("meeting"),
      },
    },
    program: {
      list: "/program/list",
      update: "/program/edit",
      create: "/program/create",
      get: "/program/get",
      delete: "/program/delete",
      log: "/program/log_list",
    },
    tree: {
      root: "/agent/get",
      child: "/child/direct",
      search: "/agent_phone/search_tree",
      list: "/agent_tree/list",
    },
  },
  staff: {
    system: {
      commission: "/system/assign/commission",
      resetData: "/reset_database",
      genOtp: "/gen_otp",
      verifyOtp: "/verify_otp",
    },
    form: {
      list: "/staff/form/list",
      buttonList: "/staff/form_button/list",
      accessCheck: "/staff/permission_access/check",
      accessUnchecked: "/staff/permission_access/uncheck",
      buttonCheck: "/staff/permission_button/check",
      buttonUncheck: "/staff/permission_button/uncheck",
      checkAll: "/staff/all_form/check",
      unCheckAll: "/staff/all_form/uncheck",
      buttonCheckAll: "/staff/all_button/check",
      buttonUncheckAll: "/staff/all_button/uncheck",
    },
    profile: {
      changePassword: "/staff/change_password",
      changeAvatar: "/staff/change_avatar",
      get: "/staff/get",
    },
    customers: {
      list: "/customer_all/list",
      logList: "/customer_all/log_list",
    },
    agents: {
      ...createCrudEndpoints("agent"),
      approve: "/status_update",
      resetPassword: "/staff/reset_password",
      resetPasswordAgent: "/agent/reset_password",
      lock: "/agent/lock",
      refLock: "/agent_ref/lock",
      listChild: "/agent/list_child",
      total: "/agent/quantity_by_level/list",
      openDuplicate: "/agent/open_duplicate",
      setBussiness: "/agent/set_business",
      loginList: "/agent/login_log/list",
      loginReport: "/agent/login_report/list",
      notLoginReport: "/agent_not_login_report/list",
      assignLevel: {
        list: "/agent/assign_level/list_show_all",
        create: "/agent/assign_level_create",
        update: "/agent/assign_level_update",
        delete: "/agent/assign_level_delete",
        approve: "/assign_level/admin_approved",
        cancel: "/assign_level/admin_cancel",
        level: "/agent/assign_level_list",
      },
      changeManager: {
        list: "/agent/change_manager/list_show_all",
        create: "/agent/change_manager_create",
        update: "/agent/change_manager_update",
        delete: "/agent/change_manager_delete",
        approve: "/change_manager/admin_approved",
        cancel: "/change_manager/admin_cancel",
        change: "/agent/change_manager_list",
      },
      tree: {
        root: "/child/root",
        child: "/child/direct",
        search: "/agent_phone/search_tree",
        list: "/agent_tree/list",
      },
      levelUpReport: {
        list: "/agent_level_up/report",
        approved: "/agent_level_up/approved",
      },
      promotionHistory: {
        list: "/agent_level_up/log_list",
      },
      econtract: {
        ...createCrudEndpoints("agent_econtract"),
        download: "/agent_econtract/download",
        reSingEContract: "/agent_econtract/sign_again",
      },
      optionContract: {
        ...createCrudEndpoints("agent_option_econtract"),
        download: "/agent_option_econtract/download",
        reSingOptionContract: "/agent_option_econtract/sign_again",
      },
      newAgent: {
        list: "/agent/quantity_by_level_month/list",
      },
    },
    tree: {
      root: "/child/root",
      child: "/child/direct",
      search: "/agent_phone/search_tree",
      list: "/agent_tree/list",
    },
    abroad: {
      common: {
        logList: "/abroad_contract/log_list",
      },
      detail: {
        list: "/abroad_detail/list",
      },
      processing: {
        list: "/abroad_processing/list",
        approve: "/staff/abroad_contract_status/update",
        update: "/agent/abroad_contract/update",
        delete: "/agent/abroad_contract/delete",
        get: "/agent/abroad_contract/get",
        create: "/agent/abroad_contract/create",
      },
      done: {
        list: "/abroad_done/list",
        commission: "/abroad_contract_commission/list",
        return: "/abroad_contract_commission/return",
      },
      products: {
        ...createCrudEndpoints("abroad_product"),
        configPolicy: "/abroad_product/config",
      },
      providers: createCrudEndpoints("abroad_provider"),
      profix: {
        list: "/abroad/profix",
        detail: "/abroad/profix_detail",
      },
      profixDetailAll: {
        list: "/abroad/profix_detail_all",
      },
      paidoutList: {
        list: "/abroad_contract/paidout_list",
      },
      paidoutDetail: {
        list: "/abroad_contract/paidout_list_detail",
      },
      commissionList: {
        list: "/abroad_contract/commission_list",
      },
    },
    lifeInsurance: {
      common: {
        logList: "/life_contract/log_list",
      },
      processing: {
        list: "/life_processing/list",
        updateStatus: "/life_contract_status/update",
        create: "/agent/life_contract/create",
        update: "/agent/life_contract/update",
        delete: "/agent/life_contract/delete",
        cancel: "/life_contract/cancel",
      },
      done: {
        list: "/life_done/list",
        commission: "/life_contract_commission/list",
        return: "/life_contract_commission/return",
        cancel: "/life_contract/cancel",
        updateAck: "/life_contract/update_ack",
      },
      canceled: {
        list: "/life_processing_cancel/list",
        commission: "/life_contract_commission/list",
        restore: "/life_contract/restore",
      },
      feeDue: {
        list: "/life_fee_due/list",
      },
      lostEffective: {
        list: "/life_lost_effective/list",
      },
      financial: {
        ...createCrudEndpoints("life_finan"),
        active: "/life_finan/active",
      },
      products: {
        ...createCrudEndpoints("life_product"),
        configPolicy: "/life_product/config",
      },
      providers: createCrudEndpoints("life_provider"),
      paidoutList: {
        list: "/life_contract/paidout_list",
      },
      paidoutDetail: {
        list: "/life_contract/paidout_list_detail",
      },
      commissionList: {
        list: "/life_contract/commission_list",
      },
    },
    nonLifeInsurance: {
      common: {
        logList: "/none_life_contract/log_list",
      },
      processing: {
        list: "/none_life_processing/list",
        approve: "/staff/none_life_contract_status/update",
        update: "/agent/none_life_contract/update",
        delete: "/agent/none_life_contract/delete",
        get: "/agent/none_life_contract/get",
        create: "/agent/none_life_contract/create",
      },
      done: {
        list: "/none_life_done/list",
        commission: "/none_life_contract_commission/list",
        return: "/none_life_contract_commission/return",
      },
      products: {
        ...createCrudEndpoints("none_life_product"),
        configPolicy: "/none_life_product/config",
      },
      providers: createCrudEndpoints("none_life_provider"),
      profix: {
        list: "/none_life/profix",
        detail: "/none_life/profix_detail",
      },
      profixDetailAll: {
        list: "/none_life/profix_detail_all",
      },
      paidoutList: {
        list: "/none_life_contract/paidout_list",
      },
      paidoutDetail: {
        list: "/none_life_contract/paidout_list_detail",
      },
      commissionList: {
        list: "/none_life_contract/commission_list",
      },
    },
    incomeOutcome: {
      cashbookIncome: {
        ...createCrudEndpoints("cashbook_income"),
        lock: "/cashbook_income/lock",
      },
      cashbookOutcome: {
        ...createCrudEndpoints("cashbook_outcome"),
        lock: "/cashbook_outcome/lock",
      },
      cashbookTotal: {
        list: "/cash_book/list",
        statistic: "/cash_book/list_sum",
      },
      cashbookIncomeDeleted: {
        list: "/cashbook_income/list_deleted",
        logList: "/cashbook_income/log_list",
      },
      cashbookOutcomeDeleted: {
        list: "/cashbook_outcome/list_deleted",
        logList: "/cashbook_outcome/log_list",
      },
      income: {
        ...createCrudEndpoints("income"),
        logList: "/income_category/log_list",
      },
      outcome: {
        ...createCrudEndpoints("outcome"),
        logList: "/outcome_category/log_list",
      },
      cashbook: {
        list: "/cash_book_report/list",
      },
    },
    notifications: {
      list: createCrudEndpoints("notify_announcement"),
      featured: {
        get: "/quick_notices/get",
        update: "/quick_notices/update",
        logList: "/quick_notices/log_list",
      },
    },
    documents: {
      members: {
        ...createCrudEndpoints("document"),
        shuffle: "/document/shuffle",
      },
      memberInternal: {
        ...createCrudEndpoints("document_internal"),
        shuffle: "/document_internal/shuffle",
      },
      types: createCrudEndpoints("document_type"),
      typesInternal: createCrudEndpoints("document_internal_type"),
      emailBusiness: {
        ...createCrudEndpoints("agent_mail_internal"),
        logList: "/agent_mail_internal/log_list",
      },
    },
    staffs: {
      list: "/list",
      create: "/create",
      update: "/update",
      delete: "/delete",
      logList: "/log_list",
      logAction: "/log_action/list",
      lockAccess: "/lock_access",
      resetPassword: "/reset_password",
      loginLogs: {
        list: "/login_log/list",
      },
    },
    reports: {
      paidoutList: {
        list: "/all_contract/paidout_list",
      },
      paidoutDetail: {
        list: "/all_contract/paidout_list_detail",
      },
      contractList: "/contract_report/list_all",
    },
    commissionPeriod: {
      commissionPeriodList: {
        list: "/commission_period/list",
        log: "/commission_period/log_list",
        lock: "/commission_period/lock",
      },
    },
    company: {
      configLevel: {
        list: "/level_up_config/list",
        update: "/level_up_config/update",
        get: "/level_up_config/get",
        log: "/level_up_config/log_list",
      },
      escrow: {
        list: "/escrow/list",
        config: "/escrow_config/list",
        updateConfig: "/escrow_config/update",
      },
      esCrowConfig: {
        list: "/escrow_config/list",
        update: "/escrow_config/update",
        get: "/escrow_config/get",
        log: "/escrow_config/log_list",
      },
      escrowReport: {
        list: "/escrow_report/list",
        detail: "/escrow_report/list_detail",
      },
      commissionTable: {
        list: "/commission_table/list_group",
      },
      meeting: {
        ...createCrudEndpoints("meeting"),
      },
    },
    program: {
      list: "/program/list",
      update: "/program/edit",
      create: "/program/create",
      get: "/program/get",
      delete: "/program/delete",
      log: "/program/log_list",
    },
    commissionType: {
      list: "/commission_type/list",
      update: "/commission_type/edit",
      create: "/commission_type/create",
      get: "/commission_type/get",
      delete: "/commission_type/delete",
      log: "/commission_type/log_list",
    },
    commissionManual: {
      list: "/commission_manual/list",
      update: "/commission_manual/update",
      create: "/commission_manual/create",
      get: "/commission_manual/get",
      delete: "/commission_manual/delete",
      log: "/commission_manual/log_list",
    },
    escrowReturn: {
      ...createCrudEndpoints("escrow_return"),
    },
    dashboard: createDashboardEndpoints(""),
    permission: {
      list: "/staff/permission/list",
      update: "/staff/permission/edit",
      create: "/staff/permission/create",
      get: "/staff/permission/get",
      delete: "/staff/permission/delete",
      log: "/staff/permission/log_list",
    },
  },
  samtek: {
    staffs: {
      list: "/staff/list",
      create: "/staff/create",
      update: "/staff/update",
      delete: "/staff/delete",
      logList: "/staff/log_list",
      logAction: "/staff/log_action/list",
      lockAccess: "/staff/lock_access",
      resetPassword: "/staff/reset_password",
      loginLogs: {
        list: "/staff/login_log/list",
      },
    },
    customers: {
      list: "/customer/list",
      create: "/customer/create",
      update: "/customer/update",
      lock: "/customer/lock_access",
      delete: "/customer/delete",
      logList: "/customer/log_list",
      levelList: "/customer/level_list",
      levelGet: "/customer/level_get",
      levelUpdate: "/customer/level_update",
      levelDelete: "/customer/level_delete",
      levelLogList: "/customer/level_log_list",
    },
    permission: {
      list: "/staff/permission/list",
      update: "/staff/permission/edit",
      create: "/staff/permission/create",
      get: "/staff/permission/get",
      delete: "/staff/permission/delete",
      log: "/staff/permission/log_list",
    },
    profile: {
      changePassword: "/staff/change_password",
      changeAvatar: "/staff/change_avatar",
      get: "/staff/get",
      update: "/staff/update",
    },
  },
};
