import isEqual from "lodash/isEqual";
import { useEffect, useMemo } from "react";
import { DEFAULT_PARAMS } from "~/constant";
import { useAuth } from "./use-auth";
import { useFilter } from "./use-filter";

export const GLOBAL_FILTER_MAP: Record<string, string> = {
  provider_code: "providerSelected",
  contract_type: "contractTypeSelected",
  id_agent_status: "agentStatusSelected",
  id_agent_level: "agentLevelSelected",
  mail_type: "emailTypeSelected",
};

export type GlobalFilterStateKeys = keyof typeof GLOBAL_FILTER_MAP;

type LocalParams = {
  basePath?: string;
  endpoint?: string;
  rangeFilter?: boolean;
  monthFilter?: boolean;
  periodFilter?: boolean;
  filter?: Record<string, any>;
};

export const useDataQuery = (localParams?: LocalParams) => {
  const { filter, endpoint, basePath, rangeFilter, monthFilter, periodFilter } =
    localParams || {};
  const { role } = useAuth();
  const {
    providerSelected,
    contractTypeSelected,
    dateRange,
    bonusPeriodName,
    agentStatusSelected,
    agentLevelSelected,
    enableFilters,
    setFilter,
    queryKeyState,
    queryParamsState,
    emailTypeSelected,
    info,
  } = useFilter();

  // 🧠 Build global mapping (từ Zustand)
  const globalValueMap: Record<GlobalFilterStateKeys, any> = useMemo(
    () => ({
      providerSelected,
      contractTypeSelected,
      agentStatusSelected,
      agentLevelSelected,
      emailTypeSelected,
    }),
    [
      providerSelected,
      contractTypeSelected,
      agentStatusSelected,
      agentLevelSelected,
      emailTypeSelected,
    ]
  );

  // 🧩 Lưu filter config khi mount (1 lần)
  useEffect(() => {
    if (localParams && !isEqual(localParams, enableFilters)) {
      setFilter("enableFilters", { ...localParams });
    }
  }, [localParams]);

  // ⚙️ Build query params
  const queryParams = useMemo(() => {
    const baseQuery = {
      endpoint: endpoint ?? role,
      ...DEFAULT_PARAMS,
      ...(filter || {}),
    };

    let finalQuery: Record<string, any> = { ...baseQuery };

    if (rangeFilter || monthFilter) Object.assign(finalQuery, dateRange);
    if (periodFilter) finalQuery.period_name = bonusPeriodName ?? "";
    if (info) finalQuery.info = info;
    if (filter) {
      for (const [queryKey, mapValue] of Object.entries(filter)) {
        const zustandKey = GLOBAL_FILTER_MAP[queryKey];
        if (zustandKey && mapValue === true) {
          finalQuery[queryKey] = globalValueMap[zustandKey];
        } else {
          finalQuery[queryKey] = mapValue;
        }
      }
    }

    // Xóa param null / undefined
    const cleanQuery = Object.fromEntries(
      Object.entries(finalQuery).filter(([_, v]) => v != null)
    );
    return cleanQuery;
  }, [
    rangeFilter,
    monthFilter,
    periodFilter,
    providerSelected,
    contractTypeSelected,
    agentStatusSelected,
    agentLevelSelected,
    dateRange,
    bonusPeriodName,
    filter,
    endpoint,
    role,
    info,
  ]);

  // 🔑 Build query key
  const queryKey = useMemo(() => {
    const baseQuery = [basePath, queryParams];
    return baseQuery;
  }, [basePath, queryParams]);

  // ⚙️ Query enable flag
  const isQueryEnabled = useMemo(() => {
    if ((rangeFilter || monthFilter) && !dateRange) return false;
    if (periodFilter && bonusPeriodName === undefined) return false;

    return true;
  }, [rangeFilter, monthFilter, dateRange, periodFilter, bonusPeriodName]);

  useEffect(() => {
    if (!isEqual(queryParamsState, queryParams)) {
      setFilter("queryParamsState", queryParams);
    }
    if (!isEqual(queryKeyState, queryKey)) {
      setFilter("queryKeyState", queryKey);
    }
  }, [queryParams, queryKey]);

  return {
    queryParams,
    queryKey,
    isQueryEnabled,
  };
};
