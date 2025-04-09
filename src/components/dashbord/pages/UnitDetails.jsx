"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import UpdateUnitModal from '../scomponent/UpdateUnitModal';
import { updateUnit, deleteUnit } from '@/components/services/serviceFetching';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
export default function UnitDetails({ unit }) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updatedUnit, setUpdatedUnit] = useState(unit);
    const router = useRouter();

    const handleDeleteUnit = async () => {
        toast(
            <div className='flex flex-col gap-4 text-black rounded-md'>
                <p>Are you sure you want to delete this unit?</p>
                <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => {
                    deleteUnit(unit.unitId);
                    toast.dismiss();
                    router.push('/dashbord/units');
                }}>Delete</button>
            </div>
        )
    }
    const handleUpdateUnit = async (updatedUnit) => {
        console.log("updatedUnit", updatedUnit);
        let newUnit = await updateUnit(updatedUnit);
        console.log(newUnit);
        setIsUpdateModalOpen(false);
        toast.success('Unit updated successfully');
        // setUpdatedUnit(newUnit);
        router.refresh();
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{unit.unitTitle}</h1>
                    <p className="text-gray-600 mt-2">{unit.buildingType} in {unit.compound}</p>
                </div>
                <div className='flex gap-4'>
                    <button onClick={() => setIsUpdateModalOpen(true)} className='cursor-pointer bg-primary text-white px-4 py-2 rounded-md'>Update Unit</button>

                    <button onClick={handleDeleteUnit} className='cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md'>Delete Unit</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                        {updatedUnit.images && updatedUnit.images[0] && (
                            <Image
                                src={updatedUnit.images[0].url}
                                alt={updatedUnit.unitTitle}
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {updatedUnit.images && updatedUnit.images.slice(1).map((image, index) => (
                            <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                                <Image
                                    src={image.url}
                                    alt={`${updatedUnit.unitTitle} - ${index + 2}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                        ))}

                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-2xl font-bold text-gray-800">EGP {updatedUnit.totalPrice.toLocaleString()}</h2>
                        <p className="text-gray-600">Down Payment: EGP {updatedUnit.downPayment.toLocaleString()}</p>
                        <p className="text-gray-600">Payment Plans: {updatedUnit.paymentPlans}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Rooms</p>
                            <p className="font-semibold">{updatedUnit.roomsCount}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Bathrooms</p>
                            <p className="font-semibold">{updatedUnit.bathroomCount}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">Floor</p>
                            <p className="font-semibold">{updatedUnit.floor}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-600">View</p>
                            <p className="font-semibold">{updatedUnit.view}</p>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Finishing</span>
                            <span className="font-semibold">{updatedUnit.finishing}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Land Area</span>
                            <span className="font-semibold">{updatedUnit.landArea} m²</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Garden Size</span>
                            <span className="font-semibold">{updatedUnit.gardenSize} m²</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Date</span>
                            <span className="font-semibold">{new Date(updatedUnit.deliveryDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-800">Location</h3>
                        <p className="text-gray-600">{updatedUnit.compound}, {updatedUnit.city}, {updatedUnit.country}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Developer</h3>
                        <p className="text-gray-600">{updatedUnit.developer}</p>
                    </div>
                </div>
            </div>
            <div className='p-6 '>
                <UpdateUnitModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSubmit={handleUpdateUnit}
                    unit={unit}
                />
            </div>
        </div>
    )
}
