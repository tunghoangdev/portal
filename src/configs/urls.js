const URLS = {
  upload: {
    avatar: "/system/upload/image_avt",
    imageNotify: "/system/upload/image_notify",
    file: "/system/upload/file",
    cccd: "/system/upload/image_cccd",
  },
  common: {
    getDateRange: "/system/reporting_period/get",
    getListPeriod: "/system/reporting_period/list",
    getListPeriodMonth: "/system/reporting_period/list_month",
  },
  dic: {
    bank: "/bank/dic",
    issuedPlace: "/issued_place/dic",
    province: "/province/dic",
    district: "/district/dic",
    commune: "/commune/dic",
    permission: "/permission/dic",
    documentType: "/document_type/dic",
    documentTypeInternal: "/document_internal_type/dic",
    agentLevel: "/agent_level/dic",
    agentLevelAll: "/agent_level_all/dic",
    income: "/income/dic",
    outcome: "/outcome/dic",
    nonLifeProvider: "/none_life_provider/dic",
    nonLifeProductByProvider: "/none_life_product_provider/dic",
    lifeProvider: "/life_provider/dic",
    lifeProductByProvider: "/life_product_main/dic",
    lifeType: "/life_type/dic",
    feeTimes: "/fee_times/dic",
    lifeFinanByProvider: "/life_finan/dic",
    lifeSubProductByMain: "/life_product_sub/dic",
    agentStatus: "/agent_status/dic",
    contractLifeStatus: "/life_status/dic",
    commissionPeriod: "/commission_period/dic",
  },
  permission: {
    getAccessForm: "/staff/permission_access_form/get",
    checkPermissionButton: "/staff/permission_access_button/action",
  },
  auth: {
    businessCheck: "/business/check",
    businessCheckPhone: "/business/check_phone",
    businessCheckCode: "/business/check_staff_code",
    login: {
      agent: "/agent/login",
      staff: "/staff/login",
      financial: "/financial/login",
      sbank: "/supervisor/login",
      customer: "/customer/login",
    },
    register: {
      agent: "/agent/register",
      checkPhone: "/agent/check_phone",
      checkEmail: "/agent/check_email",
      genOtp: "/agent/gen_otp",
      verifyOtp: "/agent/verify_otp",
    },
  },
  customer: {
    search: {
      byPhone: "/customer_phone/search",
    },
  },
  agent: {
    profile: {
      changePassword: "/agent/change_password",
      changeAvatar: "/agent/change_avatar",
      get: "/agent/get",
      update: "/agent/update",
    },
    search: {
      byPhone: "/agent_phone/search",
      byParent: "/agent_parent/search",
    },
    members: {
      list: "/agent/list",
    },
    individual: {
      nonLifeInsurance: {
        list: "/agent/none_life_individual/list",
        customer: "/customer/none_life_individual/list",
      },
      lifeInsurance: {
        list: "/agent/life_individual/list",
        customer: "/customer/life_individual/list",
      },
    },
    commissionTable: {
      list: "/agent/commission_table/list",
      export: "/agent/commission_table/export",
    },
    customers: {
      list: "/agent/customer/list",
      create: "/agent/customer/create",
      update: "/agent/customer/update",
      delete: "/agent/customer/delete",
    },
    lifeInsurance: {
      detail: {
        list: "/agent/life_detail/list",
      },
      processing: {
        list: "/agent/life_processing/list",
        create: "/agent/life_contract/create",
        update: "/agent/life_contract/update",
        delete: "/agent/life_contract/delete",
        get: "/agent/life_contract/get",
        search: "/agent/life_contract/search",
      },
      done: {
        list: "/agent/life_done/list",
        commission: "/agent/life_contract_commission/list",
      },
      feeDue: {
        list: "/agent/life_fee_due/list",
      },
      lostEffective: {
        list: "/agent/life_lost_effective/list",
      },
    },
    nonLifeInsurance: {
      detail: {
        list: "/agent/none_life_detail/list",
      },
      processing: {
        list: "/agent/none_life_processing/list",
        create: "/agent/none_life_contract/create",
        update: "/agent/none_life_contract/update",
        delete: "/agent/none_life_contract/delete",
        get: "/agent/none_life_contract/get",
      },
      done: {
        list: "/agent/none_life_done/list",
        commission: "/agent/none_life_contract_commission/list",
      },
    },
    documents: {
      list: "/agent/document/list",
    },
    notifications: {
      list: "/agent/notify_announcemnet/list",
    },
    levelUpReport: {
      list: "/agent_level_up/report",
    },
    promotionHistory: {
      list: "/agent_level_up/log_list",
    },
    dashboard: {
      commissionGeneral: "/agent/dashboard/commission_general",
      commissionGeneralDetail: "/agent/dashboard/commission_general_detail",
      commissionGeneralChart: "/agent/dashboard/commission_general_chart",
      levelUpProcess: "/agent/dashboard/level_up_process",
      listChildLevelUp: "/agent/dashboard/list_child_level_up",
      listChildByStatus: "/agent/dashboard/list_child_by_status",
      newAgentWeek: "/agent/dashboard/new_agent_week",
      newAgentMonth: "/agent/dashboard/new_agent_month",
      topAgentList: "/agent/dashboard/top_agent_list",
      agentMonthChart: "/agent/dashboard/agent_month_chart",
      listChildByLevel: "/agent/dashboard/list_child_by_level",
      agentLevelMax: "/agent_level/max",
    },
  },
  staff: {
    system: {
      commission: "/system/assign/commission",
    },
    profile: {
      changePassword: "/staff/change_password",
      changeAvatar: "/staff/change_avatar",
      get: "/staff/get",
    },
    customers: {
      list: "/staff/customer_all/list",
      logList: "/staff/customer_all/log_list",
    },
    agents: {
      list: {
        list: "/staff/agent/list",
        create: "/staff/agent/create",
        update: "/staff/agent/update",
        delete: "/staff/agent/delete",
        logList: "/staff/agent/log_list",
        approve: "/staff/agent/status_update",
        resetPassword: "/staff/agent/reset_password",
        lock: "/staff/agent/lock",
        refLock: "/staff/agent_ref/lock",
        openDuplicate: "/staff/agent/open_duplicate",
        setBusiness: "/staff/agent/set_business",
        assignLevel: {
          list: "/staff/agent/assign_level_list",
          create: "/staff/agent/assign_level_create",
          update: "/staff/agent/assign_level_update",
          delete: "/staff/agent/assign_level_delete",
          approve: "/staff/assign_level/admin_approved",
          cancel: "/staff/assign_level/admin_cancel",
        },
        changeManager: {
          list: "/staff/agent/change_manager_list",
          create: "/staff/agent/change_manager_create",
          update: "/staff/agent/change_manager_update",
          delete: "/staff/agent/change_manager_delete",
          approve: "/staff/change_manager/admin_approved",
          cancel: "/staff/change_manager/admin_cancel",
        },
      },
      tree: {
        root: "/child/root",
        child: "/child/direct",
        search: "/agent_phone/search_tree",
        list: "/staff/agent_tree/list",
      },
      assignLevel: {
        list: "/staff/agent/assign_level/list_show_all",
      },
      changeManager: {
        list: "/staff/agent/change_manager/list_show_all",
      },
      levelUpReport: {
        list: "/staff/agent_level_up/report",
        approved: "/staff/agent_level_up/approved",
      },
      promotionHistory: {
        list: "/staff/agent_level_up/log_list",
      },
    },
    lifeInsurance: {
      common: {
        logList: "/staff/life_contract/log_list",
      },
      processing: {
        list: "/staff/life_processing/list",
        updateStatus: "/staff/life_contract_status/update",
      },
      done: {
        list: "/staff/life_done/list",
        commission: "/staff/life_contract_commission/list",
        return: "/staff/life_contract_commission/return",
      },
      feeDue: {
        list: "/staff/life_fee_due/list",
      },
      lostEffective: {
        list: "/staff/life_lost_effective/list",
      },
      financial: {
        list: "/staff/life_finan/list",
        create: "/staff/life_finan/create",
        update: "/staff/life_finan/update",
        delete: "/staff/life_finan/delete",
        active: "/staff/life_finan/active",
        logList: "/staff/life_finan/log_list",
      },
      products: {
        list: "/staff/life_product/list",
        create: "/staff/life_product/create",
        update: "/staff/life_product/update",
        delete: "/staff/life_product/delete",
        configPolicy: "/staff/life_product/config",
        logList: "/staff/life_product/log_list",
      },
      providers: {
        list: "/staff/life_provider/list",
        create: "/staff/life_provider/create",
        update: "/staff/life_provider/update",
        delete: "/staff/life_provider/delete",
        logList: "/staff/life_provider/log_list",
      },
      paidoutList: {
        list: "/staff/life_contract/paidout_list",
      },
      commissionList: {
        list: "/staff/life_contract/commission_list",
      },
    },
    nonLifeInsurance: {
      common: {
        logList: "/staff/none_life_contract/log_list",
      },
      processing: {
        list: "/staff/none_life_processing/list",
        approve: "/staff/none_life_contract_status/update",
      },
      done: {
        list: "/staff/none_life_done/list",
        commission: "/staff/none_life_contract_commission/list",
        return: "/staff/none_life_contract_commission/return",
      },
      products: {
        list: "/staff/none_life_product/list",
        create: "/staff/none_life_product/create",
        update: "/staff/none_life_product/update",
        delete: "/staff/none_life_product/delete",
        configPolicy: "/staff/none_life_product/config",
        logList: "/staff/none_life_product/log_list",
      },
      providers: {
        list: "/staff/none_life_provider/list",
        create: "/staff/none_life_provider/create",
        update: "/staff/none_life_provider/update",
        delete: "/staff/none_life_provider/delete",
        logList: "/staff/none_life_provider/log_list",
      },
      profix: {
        list: "/staff/none_life/profix",
        detail: "/staff/none_life/profix_detail",
      },
      profixDetailAll: {
        list: "/staff/none_life/profix_detail_all",
      },
      paidoutList: {
        list: "/staff/none_life_contract/paidout_list",
      },
      commissionList: {
        list: "/staff/none_life_contract/commission_list",
      },
    },
    incomeOutcome: {
      cashbookIncome: {
        list: "/staff/cashbook_income/list",
        create: "/staff/cashbook_income/create",
        update: "/staff/cashbook_income/update",
        delete: "/staff/cashbook_income/delete",
        lock: "/staff/cashbook_income/lock",
        logList: "/staff/cashbook_income/log_list",
      },
      cashbookOutcome: {
        list: "/staff/cashbook_outcome/list",
        create: "/staff/cashbook_outcome/create",
        update: "/staff/cashbook_outcome/update",
        delete: "/staff/cashbook_outcome/delete",
        lock: "/staff/cashbook_outcome/lock",
        logList: "/staff/cashbook_outcome/log_list",
      },
      cashbookTotal: {
        list: "/staff/cash_book/list",
        statistic: "/staff/cash_book/list_sum",
      },
      cashbookIncomeDeleted: {
        list: "/staff/cashbook_income/list_deleted",
      },
      cashbookOutcomeDeleted: {
        list: "/staff/cashbook_outcome/list_deleted",
      },
      income: {
        list: "/staff/income/list",
        create: "/staff/income/create",
        update: "/staff/income/update",
        delete: "/staff/income/delete",
        logList: "/staff/income_category/log_list",
      },
      outcome: {
        list: "/staff/outcome/list",
        create: "/staff/outcome/create",
        update: "/staff/outcome/update",
        delete: "/staff/outcome/delete",
        logList: "/staff/outcome_category/log_list",
      },
    },
    notifications: {
      list: {
        list: "/staff/notify_announcement/list",
        create: "/staff/notify_announcement/create",
        update: "/staff/notify_announcement/update",
        delete: "/staff/notify_announcement/delete",
        logList: "/staff/notify_announcement/log_list",
      },
      featured: {
        get: "/staff/quick_notices/get",
        update: "/staff/quick_notices/update",
        logList: "/staff/quick_notices/log_list",
      },
    },
    documents: {
      members: {
        list: "/staff/document/list",
        create: "/staff/document/create",
        update: "/staff/document/update",
        delete: "/staff/document/delete",
        shuffle: "/staff/document/shuffle",
        logList: "/staff/document/log_list",
      },
      memberInternal: {
        list: "/staff/document_internal/list",
        create: "/staff/document_internal/create",
        update: "/staff/document_internal/update",
        delete: "/staff/document_internal/delete",
        shuffle: "/staff/document_internal/shuffle",
        logList: "/staff/document_internal/log_list",
      },
      types: {
        list: "/staff/document_type/list",
        create: "/staff/document_type/create",
        update: "/staff/document_type/update",
        delete: "/staff/document_type/delete",
        logList: "/staff/document_type/log_list",
      },
    },
    staffs: {
      list: {
        list: "/staff/list",
        create: "/staff/create",
        update: "/staff/update",
        delete: "/staff/delete",
        logList: "/staff/log_list",
        logAction: "/staff/log_action/list",
        lockAccess: "/staff/lock_access",
        resetPassword: "/staff/reset_password",
      },
      loginLogs: {
        list: "/staff/login_log/list",
      },
    },
    reports: {
      paidoutList: {
        list: "/staff/all_contract/paidout_list",
      },
    },
    commissionPeriod: {
      commissionPeriodList: {
        list: "/staff/commission_period/list",
        log: "/staff/commission_period/log_list",
        lock: "/staff/commission_period/lock",
      },
    },
    dashboard: {
      commissionGeneral: "/staff/dashboard/commission_general",
      commissionGeneralDetail: "/staff/dashboard/commission_general_detail",
      commissionGeneralChart: "/staff/dashboard/commission_general_chart",
      levelUpProcess: "/staff/dashboard/level_up_process",
      listChildLevelUp: "/staff/dashboard/list_child_level_up",
      listChildByStatus: "/staff/dashboard/list_child_by_status",
      newAgentWeek: "/staff/dashboard/new_agent_week",
      newAgentMonth: "/staff/dashboard/new_agent_month",
      topAgentList: "/staff/dashboard/top_agent_list",
      agentMonthChart: "/staff/dashboard/agent_month_chart",
      listChildByLevel: "/staff/dashboard/list_child_by_level",
    },
  },
};
export default URLS;
