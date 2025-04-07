'use server';

import Units from '@/components/dashbord/pages/Units'
import { fetchcombounds, fetchUnits } from '@/components/services/serviceFetching';
import React from 'react'

const page = async () => {
  // Fetch units data using the server action
  const unitsData = await fetchUnits();
  const comboundata = await fetchcombounds();
  
  return (
    <div>
      <Units initialData={unitsData} comboundata={comboundata}/>
    </div>
  )
}

export default page
