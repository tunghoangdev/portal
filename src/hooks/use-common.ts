import { useCommonStore } from "~/stores";
export const useCommon = (key?: string) => {
  const data = useCommonStore((state) =>
    key ? state.data?.[key as keyof typeof state.data] : undefined
  );
  const periodDate = useCommonStore((state) => state.data?.periodDate);
  const currentSecretkey = useCommonStore(
    (state) => state.data?.currentSecretKey
  );
  const formIds = useCommonStore((state) => state.data?.formIds);
  const reportList = useCommonStore((state) => state.data?.reportingPeriod);
  const period_name = useCommonStore((state) => state.data?.period_name);
  const periodList = useCommonStore((state) => state.data?.periodList);
  const outcomeList = useCommonStore((state) => state.data?.outcomeList);
  const abroadProvider = useCommonStore((state) => state.data?.abroadProvider);
  const productList = useCommonStore((state) => state.data?.productList);
  const outcomeParentList = useCommonStore(
    (state) => state.data?.outcomeParentList
  );
  const incomeParentList = useCommonStore(
    (state) => state.data?.incomeParentList
  );
  const incomeList = useCommonStore((state) => state.data?.incomeList);
  const lifeInsuranceData = useCommonStore(
    (state) => state.data?.lifeInsuranceData
  );
  const permissionList = useCommonStore((state) => state.data?.permissionList);
  const documentTypes = useCommonStore((state) => state.data?.documentTypes);
  const choiceList = useCommonStore((state) => state.data?.choiceList);
  const provinceIssuedList = useCommonStore(
    (state) => state.data?.provinceIssuedList
  );
  const periodDicList = useCommonStore((state) => state.data?.periodDicList);
  const lifeProviders = useCommonStore((state) => state.data?.lifeProviders);
  const noneLifeProviders = useCommonStore(
    (state) => state.data?.noneLifeProviders
  );
  const lifeStatus = useCommonStore((state) => state.data?.lifeStatus);
  const agentStatusList = useCommonStore(
    (state) => state.data?.agentStatusList
  );
  const listBank = useCommonStore((state) => state.data?.listBank);
  const listFeeTypes = useCommonStore((state) => state.data?.listFeeTypes);
  const listFinan = useCommonStore((state) => state.data?.listFinan);
  const lifeSubProducts = useCommonStore(
    (state) => state.data?.lifeSubProducts
  );
  const currentProviderId = useCommonStore(
    (state) => state.data?.currentProviderId
  );
  const productMainId = useCommonStore((state) => state.data?.productMainId);
  const provinceId = useCommonStore((state) => state.data?.provinceId);
  const districtId = useCommonStore((state) => state.data?.districtId);
  const wardId = useCommonStore((state) => state.data?.wardId);
  const lifeTypes = useCommonStore((state) => state.data?.lifeTypes);
  const provinceList = useCommonStore((state) => state.data?.provinceList);
  const wardList = useCommonStore((state) => state.data?.wardList);
  const agentLevels = useCommonStore((state) => state.data?.agentLevels);
  const agentStatusSelected = useCommonStore(
    (state) => state.data?.agentStatusSelected
  );
  const agentLevelSelected = useCommonStore(
    (state) => state.data?.agentLevelSelected
  );
  const hideNotification = useCommonStore(
    (state) => state.data?.hideNotification
  );
  const commissionTypes = useCommonStore(
    (state) => state.data?.commissionTypes
  );
  const selectedFormId = useCommonStore((state) => state.data?.selectedFormId);

  return {
    data,
    periodDate,
    period_name,
    lifeProviders,
    noneLifeProviders,
    provinceId,
    districtId,
    wardId,
    lifeSubProducts,
    choiceList,
    currentProviderId,
    productMainId,
    provinceList,
    wardList,
    lifeTypes,
    lifeStatus,
    selectedFormId,
    commissionTypes,
    periodList,
    hideNotification,
    listBank,
    agentLevels,
    agentStatusList,
    agentStatusSelected,
    agentLevelSelected,
    periodDicList,
    permissionList,
    provinceIssuedList,
    outcomeList,
    incomeList,
    formIds,
    documentTypes,
    listFeeTypes,
    listFinan,
    currentSecretkey,
    lifeInsuranceData,
    incomeParentList,
    outcomeParentList,
    reportList,
    abroadProvider,
    productList,
  };
};
