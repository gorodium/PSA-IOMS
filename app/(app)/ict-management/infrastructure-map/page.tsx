import { getCurrentUser } from "@/lib/auth";
import { getICTMapPageDataAction, getPersonnelForICTMapAction } from "./actions";
import { ICTInfrastructureMapPage } from "@/components/ict-map/ICTInfrastructureMapPage";

export const dynamic = "force-dynamic";

export default async function InfrastructureMapRoute() {
  const user = await getCurrentUser();
  const [data, personnel] = await Promise.all([
    getICTMapPageDataAction(),
    getPersonnelForICTMapAction(),
  ]);

  return <ICTInfrastructureMapPage initialData={data} personnel={personnel} />;
}
