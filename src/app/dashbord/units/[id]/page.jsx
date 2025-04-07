import UnitDetails from '@/components/dashbord/pages/UnitDetails';
import { fetchUnitById } from '@/components/services/serviceFetching';
import React from 'react'
const page = async ({ params }) => {
  const { id } = await params;
  const unit = await fetchUnitById(id);
  console.log(unit);
  return (
    <UnitDetails unit={unit} />
  )
}

export default page;
