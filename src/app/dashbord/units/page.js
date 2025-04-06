import Units from '@/components/dashbord/pages/Units'
import { fetchUnits } from '@/components/services/serviceFetching';
import React from 'react'


const page = async () => {
  // Fetch units data using the server action
  const unitsData = await fetchUnits();
  console.log(unitsData)
  return (
    <div>
      <Units initialData={unitsData} />
    </div>
  )
}

export default page
