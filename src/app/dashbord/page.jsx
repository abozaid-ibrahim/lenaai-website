import HomeDashbord from '@/components/dashbord/pages/HomeDashbord'
import { fetchUsers } from '@/components/services/serviceFetching'
import React from 'react'

export const metadata = {
  title: 'Home',
  description: 'Home page',
}
const Page = async () => {
  const users = await fetchUsers();
  return (
    <>
      <HomeDashbord users={users.data} />
    </>

  )
}

export default Page;
