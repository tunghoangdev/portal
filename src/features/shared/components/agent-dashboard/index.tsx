import AgentMonthChart from "./agent-month-chart";
import LevelUpProcess from "./level-up-process";
import ListChildByStatus from "./list-child-by-status";
import ListChildLevelUp from "./list-child-level-up";
import NewAgent from "./new-agent";
import { useCommissionPeriodOptions } from "~/hooks/query/options";
import CommissionGeneral from "./commission-general";
import CommissionGeneralChart from "./commission-general-chart";
import { Grid } from "~/components/ui";

const AgentDashboard = ({ query, userId, dataUser }: any) => {
  const periodOptions = useCommissionPeriodOptions();
  return (
    <Grid container spacing={4}>
      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        {periodOptions.length > 0 && (
          <CommissionGeneral
            query={query}
            periodOptions={periodOptions}
            userId={userId}
          />
        )}
      </Grid>

      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        <CommissionGeneralChart query={query} userId={userId} />
        <LevelUpProcess query={query} userId={userId} dataUser={dataUser} />
      </Grid>
      <Grid item sm={12} xs={12}>
        <ListChildByStatus query={query} userId={userId} />
      </Grid>
      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        <NewAgent query={query} userId={userId} />
      </Grid>

      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        <AgentMonthChart query={query} userId={userId} />
      </Grid>

      <Grid
        item
        sm={6}
        xs={12}
        className="shadow-md p-2 rounded-md text-center border border-default-100"
      >
        <ListChildLevelUp query={query} userId={userId} />
      </Grid>
    </Grid>
  );
};

export default AgentDashboard;
