import { Grid, Stack, Typography } from "~/components/ui";
import { LevelUpProcess } from "./level-up-process";
import CardItem from "./card-item";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { useCrud } from "~/hooks/use-crud-v2";
import { useAuth, useFilter } from "~/hooks";
import { useMemo } from "react";
import { caluclateGrowth } from "~/utils/util";
import { XfypChart } from "./xfyp-chart";
import { AgentStats } from "./agent-stats";
import { LevelUpHistory } from "./level-up-history";
import { ROLES } from "~/constant";
import { AgentProvinceChart } from "./agent-province-chart";
import { AgentStatusStats } from "./agent-status-stats";
import { AgentMonthChart } from "./agent-month-chart";
import { TopTenLevel } from "./top-ten-level";
import { AgentBirthdayMonth } from "./agent-birthday-month";
import { useLocation } from "@tanstack/react-router";

const items = [
  {
    title: "Tổng FYP (MTD)",
    id: "xfpy_this_mtd",
    last: "xfpy_last_mtd",
    subDescription: "So với tháng trước",
  },
  {
    title: "Tổng FYP (YTD)",
    id: "xfpy_this_ytd",
    last: "xfpy_last_ytd",
    subDescription: "So với năm trước",
  },
  {
    title: "Tổng số hợp đồng (MTD)",
    id: "case_this_mtd",
    last: "case_last_mtd",
    subDescription: "So với tháng trước",
  },
  {
    title: "Tổng số hợp đồng (YTD)",
    id: "case_this_ytd",
    last: "case_last_ytd",
    subDescription: "So với năm trước",
  },
];

const lifeColor = {
  base: "text-sm md:text-xl leading-tight mb-0 text-[#008197]",
  color: "#008197",
  bg: "to-[#008197]/40",
  chart: "text-[#008197]",
};

const noneLifeColor = {
  base: "text-sm md:text-xl leading-tight text-[#de7323]",
  color: "#de7323",
  bg: "to-[#de7323]/40",
  chart: "text-[#de7323]",
};

const abroadColor = {
  base: "text-sm md:text-xl leading-tight text-[#006FEE]",
  color: "#006FEE",
  bg: "to-[#006FEE]/40",
  chart: "text-[#006FEE]",
};

const classes = {
  title: "text-xs md:text-sm text-default-700",
};
export default function DashboardPageClient() {
  const { role } = useAuth();
  const { agentId } = useFilter();
  const location = useLocation();
  const pathname = location.pathname;
  const basePath = API_ENDPOINTS?.dashboard;
  const { getAll } = useCrud(
    [basePath?.lifeContract, agentId],
    {
      endpoint: agentId ? ROLES.AGENT : role,
      id: agentId,
    },
    {
      enabled:
        Boolean(basePath?.lifeContract) ||
        (Boolean(agentId) && !pathname.endsWith("/dashboard")),
    }
  );
  const { getAll: getAllLifeContract } = useCrud(
    [basePath?.noneLifeContract, agentId],
    {
      endpoint: agentId ? ROLES.AGENT : role,
      id: agentId,
    },
    {
      enabled:
        Boolean(basePath?.noneLifeContract) ||
        (Boolean(agentId) && !pathname.endsWith("/dashboard")),
    }
  );

  const { getAll: getAllAbroad } = useCrud(
    [basePath?.abroadContract, agentId],
    {
      endpoint: agentId ? ROLES.AGENT : role,
      id: agentId,
    },
    {
      enabled:
        Boolean(basePath?.abroadContract) ||
        (Boolean(agentId) && !pathname.endsWith("/dashboard")),
    }
  );

  const { data: lifeContractList }: any = getAll();
  const { data: noneLifeContractList }: any = getAllLifeContract();
  const { data: abroadContractList }: any = getAllAbroad();

  const newItems = useMemo(() => {
    if (!lifeContractList) return [];
    return items.map((item: any) => {
      const current = lifeContractList?.[item.id];
      const last = lifeContractList?.[item.last];
      if (!current && !last) return { ...item, total: current || 0 };
      const growthRate = caluclateGrowth(current, last);
      return {
        ...item,
        ...growthRate,
        total: current || 0,
      };
    });
  }, [lifeContractList]);

  const newNoneLifeItems = useMemo(() => {
    if (!noneLifeContractList) return [];
    return items.map((item: any) => {
      const current = noneLifeContractList?.[item.id];
      const last = noneLifeContractList?.[item.last];
      if (!current && !last)
        return {
          ...item,
          total: current || 0,
          title: item.title.replace("FYP", "doanh số"),
        };
      const growthRate = caluclateGrowth(current, last);

      return {
        ...item,
        ...growthRate,
        total: current || 0,
        title: item.title.replace("FYP", "doanh số"),
      };
    });
  }, [noneLifeContractList]);

  const newAbroadItems = useMemo(() => {
    if (!abroadContractList) return [];
    return items.map((item: any) => {
      const current = abroadContractList?.[item.id];
      const last = abroadContractList?.[item.last];
      if (!current && !last)
        return {
          ...item,
          total: current || 0,
          title: item.title.replace("FYP", "doanh số"),
        };
      const growthRate = caluclateGrowth(current, last);

      return {
        ...item,
        ...growthRate,
        total: current || 0,
        title: item.title.replace("FYP", "doanh số"),
      };
    });
  }, [abroadContractList]);

  return (
    <Stack direction="col" className="min-h-screen gap-y-5 mt-5 pb-5">
      <Grid container spacing={4} className="mb-5">
        <Grid item xs={12}>
          <Typography variant="h5" className={abroadColor.base}>
            Di trú
          </Typography>
        </Grid>
        {newAbroadItems.map((item, index) => (
          <Grid item xs={6} md={3} key={index}>
            <CardItem {...item} colors={{ ...abroadColor }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} className="mb-2.5">
        <Grid item xs={12}>
          <Typography variant="h5" className={lifeColor.base}>
            Nhân thọ
          </Typography>
        </Grid>
        {newItems.map((item, index) => (
          <Grid item xs={6} md={3} key={index}>
            <CardItem {...item} colors={{ ...lifeColor }} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={4} className="mb-5">
        <Grid item xs={12}>
          <Typography variant="h5" className={noneLifeColor.base}>
            Phi nhân thọ
          </Typography>
        </Grid>
        {newNoneLifeItems.map((item, index) => (
          <Grid item xs={6} md={3} key={index}>
            <CardItem {...item} colors={{ ...noneLifeColor }} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} className="mb-5">
        {/* {role === ROLES.AGENT && (
					<Grid item xs={12} md={3}>
						<LevelUpProcess classNames={classes} />
					</Grid>
				)} */}
        <Grid item xs={12}>
          <XfypChart
            colors={{ lifeColor, noneLifeColor, abroadColor }}
            classNames={classes}
          />
        </Grid>
      </Grid>
      <AgentStats colors={{ lifeColor, noneLifeColor }} classNames={classes} />
      <Grid container spacing={4} className="mb-5">
        <Grid item xs={12} md={4}>
          <AgentStatusStats classNames={classes} />
          {role === ROLES.AGENT ? (
            <>
              <LevelUpProcess classNames={classes} />
              <div className="mt-5">
                <AgentMonthChart
                  colors={{ lifeColor, noneLifeColor }}
                  classNames={classes}
                />
              </div>
            </>
          ) : (
            <AgentBirthdayMonth classNames={classes} />
          )}
          {/* <AgentBirthdayMonth classNames={classes} /> */}
        </Grid>

        <Grid item xs={12} md={4}>
          <LevelUpHistory classNames={classes} />
          {role === ROLES.AGENT && (
            <div className="mt-5">
              <TopTenLevel classNames={classes} />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {role === ROLES.AGENT ? (
            <AgentBirthdayMonth classNames={classes} />
          ) : (
            <AgentMonthChart
              colors={{ lifeColor, noneLifeColor }}
              classNames={classes}
            />
          )}
        </Grid>

        {role === ROLES.STAFF && !agentId && (
          <Grid item xs={12} md={12}>
            <AgentProvinceChart
              colors={{ lifeColor, noneLifeColor }}
              classNames={classes}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
