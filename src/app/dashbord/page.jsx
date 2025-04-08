import HomeDashbord from '@/components/dashbord/pages/HomeDashbord'
import { fetchUsersData } from '@/components/services/serviceFetching'
import React from 'react'

export const metadata = {
  title: 'Home',
  description: 'Home page',
}
const page = async () => {
  const userData = await fetchUsersData();
  return (
    <>
    <HomeDashbord userData={userData} />
   </>
  )
}

export default page
