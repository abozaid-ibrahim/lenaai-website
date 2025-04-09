import Units from "@/components/dashbord/pages/Units";
import {
  fetchcombounds,
  fetchUnits,
  fetchDevelopers,
} from "@/components/services/serviceFetching";
import React from "react";

export const revalidate = 0;
export const metadata = {
  title: "Units",
  description: "Units page",
};
const Page = async () => {
  // Fetch units data using the server action
  const unitsData = await fetchUnits();
  const comboundata = await fetchcombounds();
  const developers = await fetchDevelopers();

  return (
    <div>
      <Units
        initialData={unitsData}
        comboundata={comboundata}
        developersData={developers}
      />
    </div>
  );
};

export default Page;
