import HomeDashbord from "@/components/dashbord/pages/HomeDashbord";
import { fetchUsersData } from "@/components/services/serviceFetching";
import React from "react";

export const metadata = {
  title: 'Home',
  description: 'Home page',
}
const Page = async () => {
  const users = await fetchUsersData();
  return (
    <>
      <HomeDashbord users={users.data} />
    </>

  )
}

export default Page;