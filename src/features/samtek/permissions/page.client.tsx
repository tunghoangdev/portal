import { Grid } from "@/components/ui";
import { useState } from "react";
import { PermissionList } from "./permission-list";
import { RoleList } from "./role-list";

const PageClient = () => {
  // *** STATE ***
  const [permission, setPermission] = useState<any>(null);
  const idPermission = permission?.id;

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PermissionList
            idPermission={idPermission}
            setPermission={setPermission}
            idForm={2}
          />
        </Grid>
        <Grid item sm={12}>
          <RoleList idPermission={idPermission} />
        </Grid>
      </Grid>
    </>
  );
};

export default PageClient;
