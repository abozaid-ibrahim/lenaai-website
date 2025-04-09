import HomeDashbord from '@/components/dashbord/pages/HomeDashbord'
import { fetchUsers } from '@/components/services/serviceFetching'
import React from 'react'

export const metadata = {
  title: 'Home',
  description: 'Home page',
}
const page = async () => {
  const userData = await fetchUsers();
  console.log("userData", userData);
  return (
    <>
      <HomeDashbord users={userData} />
    </>
  )
}

export default page
