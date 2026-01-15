export const MENU_SETTINGS = {
  staff: {
    dashboard: {
      navLink: '/staff/dashboard',
      idForm: 0
    },
    agents: {
      list: {
        navLink: '/staff/agents/list',
        idForm: 26
      },
      tree: {
        navLink: '/staff/agents/tree',
        idForm: 27
      },
      promotionHistory: {
        navLink: '/staff/agents/promotion-history',
        idForm: 36
      },
      electronicContracts: {
        navLink: '/staff/agents/electronic-contracts'
      },
      assignLevel: {
        navLink: '/staff/agents/assign-level',
        idForm: 31
      },
      changeManager: {
        navLink: '/staff/agents/change-manager',
        idForm: 32
      },
      levelUpReport: {
        navLink: '/staff/agents/level-up-report',
        idForm: 35
      }
    },
    customers: {
      navLink: '/staff/customers',
      idForm: 28
    },
    bonusCalculation: {
      navLink: '/staff/bonus-calculation'
    },
    lifeInsurance: {
      processing: {
        navLink: '/staff/life-insurance/list-processing',
        idForm: 23
      },
      done: {
        navLink: '/staff/life-insurance/list-done',
        idForm: 24
      },
      feeDue: {
        navLink: '/staff/life-insurance/fee-due',
        idForm: 29
      },
      lostEffective: {
        navLink: '/staff/life-insurance/lost-effective',
        idForm: 30
      },
      financial: {
        navLink: '/staff/life-insurance/financial',
        idForm: 25
      },
      resolvingBenefits: {
        navLink: '/staff/life-insurance/resolving-benefits'
      },
      products: {
        navLink: '/staff/life-insurance/products',
        idForm: 20
      },
      providers: {
        navLink: '/staff/life-insurance/providers',
        idForm: 18
      },
      paidoutList: {
        navLink: '/staff/life_contract/paidout_list',
        idForm: 40
      },
      commissionList: {
        navLink: '/staff/life_contract/commission_list',
        idForm: 38
      },
    },
    nonLifeInsurance: {
      processing: {
        navLink: '/staff/non-life-insurance/list-processing',
        idForm: 21
      },
      done: {
        navLink: '/staff/non-life-insurance/list-done',
        idForm: 22
      },
      products: {
        navLink: '/staff/non-life-insurance/products',
        idForm: 19
      },
      providers: {
        navLink: '/staff/non-life-insurance/providers',
        idForm: 17
      },
      profix: {
        navLink: '/staff/non-life-insurance/profix',
        idForm: 33
      },
      profixDetailAll: {
        navLink: '/staff/none_life/profix_detail_all',
        idForm: 34
      },
      paidoutList: {
        navLink: '/staff/none_life/paidout_list',
        idForm: 39
      },
      commissionList: {
        navLink: '/staff/none_life_contract/commission_list',
        idForm: 37
      },
    },
    incomeOutcome: {
      cashbookIncome: {
        navLink: '/staff/income-outcome/cashbook-income',
        idForm: 12
      },
      cashbookOutcome: {
        navLink: '/staff/income-outcome/cashbook-outcome',
        idForm: 13
      },
      cashbookTotal: {
        navLink: '/staff/income-outcome/cashbook-total',
        idForm: 16
      },
      income: {
        navLink: '/staff/income-outcome/income',
        idForm: 10
      },
      outcome: {
        navLink: '/staff/income-outcome/outcome',
        idForm: 11
      },
      cashbookIncomeDeleted: {
        navLink: '/staff/income-outcome/cashbook-income-deleted',
        idForm: 14
      },
      cashbookOutcomeDeleted: {
        navLink: '/staff/income-outcome/cashbook-outcome-deleted',
        idForm: 15
      }
    },
    notifications: {
      list: {
        navLink: '/staff/notifications/list',
        idForm: 8
      },
      featured: {
        navLink: '/staff/notifications/featured',
        idForm: 9
      }
    },
    documents: {
      internal: {
        navLink: '/staff/documents/internal',
        idForm: 7
      },
      members: {
        navLink: '/staff/documents/member',
        idForm: 6
      },
      types: {
        navLink: '/staff/documents/types',
        idForm: 5
      }
    },
    staffs: {
      list: {
        navLink: '/staff/staffs/list',
        idForm: 1
      },
      permissions: {
        navLink: '/staff/staffs/permissions',
        idForm: 3
      },
      loginLogs: {
        navLink: '/staff/staffs/login-logs',
        idForm: 4
      }
    },
    reports: {
      paidoutList: {
        navLink: '/staff/reports/paidout_list',
        idForm: 41
      },
    },
    commissionPeriod: {
      navLink: '/staff/commission_period/list',
      idForm: 42
    },
  },
  agent: {
    dashboard: {
      navLink: '/agent/dashboard'
    },
    members: {
      list: {
        navLink: '/agent/member/list'
      },
      tree: {
        navLink: '/agent/member/tree'
      },
      levelUpReport: {
        navLink: '/agent/member/level-up-report'
      },
      levelUpLog: {
        navLink: '/agent/member/level-up-log'
      }
    },
    lifeInsurance: {
      processing: {
        navLink: '/agent/life-insurance/list-processing'
      },
      done: {
        navLink: '/agent/life-insurance/list-done'
      },
      feeDue: {
        navLink: '/agent/life-insurance/fee-due'
      },
      lostEffective: {
        navLink: '/agent/life-insurance/lost-effective'
      },
      individual: {
        navLink: '/agent/life-insurance/individual'
      }
    },
    nonLifeInsurance: {
      processing: {
        navLink: '/agent/non-life-insurance/list-processing'
      },
      done: {
        navLink: '/agent/non-life-insurance/list-done'
      },
      individual: {
        navLink: '/agent/non-life-insurance/individual'
      }
    },
    individual: {
      list: {
        navLink: '/agent/individual/list'
      }
    },
    commissionTable: {
      list: {
        navLink: '/agent/commission-table/list'
      }
    },
    customers: {
      list: {
        navLink: '/agent/customer/list'
      }
    },
    documents: {
      list: {
        navLink: '/agent/documents/list'
      }
    },
    notifications: {
      list: {
        navLink: '/agent/notifications/list'
      }
    },
    profile: {
      navLink: '/agent/profile'
    }
  }
}
