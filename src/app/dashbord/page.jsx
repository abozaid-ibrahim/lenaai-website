import HomeDashbord from '@/components/dashbord/pages/HomeDashbord'
import { fetchUsers } from '@/components/services/serviceFetching'
import React from 'react'

export const metadata = {
  title: 'Home',
  description: 'Home page',
}
const page = async() => {
  const users = await fetchUsers();
  return (
    <>
    <HomeDashbord users={users}/>
   </>
  )
}

export default page
