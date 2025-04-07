"use client"
import { updateUnit } from '@/components/services/serviceFetching';
import React, { useState, useEffect } from 'react';
const UpdateUnitForm = ({ unit, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        unitTitle: '',
        unitId: '',
        buildingType: '',
        city: '',
        country: '',
        compound: '',
        developer: '',
        purpose: '',
        finishing: '',
        view: '',
        floor: '',
        roomsCount: '',
        bathroomCount: '',
        landArea: '',
        gardenSize: '',
        garageArea: '',
        totalPrice: '',
        downPayment: '',
        paymentPlans: '',
        deliveryDate: '',
        clientId: '',
        clientName: '',
        dataSource: '',
        images: [],
    });

    useEffect(() => {
        if (unit) {
            setFormData({
                unitTitle: unit.unitTitle || '',
                unitId: unit.unitId || '',
                buildingType: unit.buildingType || '',
                city: unit.city || '',
                country: unit.country || '',
                compound: unit.compound || '',
                developer: unit.developer || '',
                purpose: unit.purpose || '',
                finishing: unit.finishing || '',
                view: unit.view || '',
                floor: unit.floor || 0,
                roomsCount: unit.roomsCount || 0,
                bathroomCount: unit.bathroomCount || 0,
                landArea: unit.landArea || 0,
                gardenSize: unit.gardenSize || 0,
                garageArea: unit.garageArea || 0,
                totalPrice: unit.totalPrice || 0,
                downPayment: unit.downPayment || 0,
                paymentPlans: unit.paymentPlans || '',
                deliveryDate: unit.deliveryDate || '',
                clientId: unit.clientId || '',
                clientName: unit.clientName || '',
                dataSource: unit.dataSource || '',
                images: unit.images || [],
                updatedAt: unit.updatedAt || '',
            });
        }
    }, [unit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageObjects = files.map(file => ({
            url: URL.createObjectURL(file),
            thumbnailUrl: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            fileType: file.type,
            width: 0, // These will be updated when the image loads
            height: 0
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...imageObjects]
        }));
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData", formData);
        // const updatedUnit = await updateUnit(formData);
        // console.log("updatedUnit", updatedUnit);
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="unitTitle" className="block text-sm font-medium text-gray-700">
                        Unit Title
                    </label>
                    <input
                        type="text"
                        name="unitTitle"
                        id="unitTitle"
                        value={formData.unitTitle}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="buildingType" className="block text-sm font-medium text-gray-700">
                        Building Type
                    </label>
                    <select
                        name="buildingType"
                        id="buildingType"
                        value={formData.buildingType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    >
                        <option value="">Select Type</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                    </label>
                    <input
                        type="text"
                        name="country"
                        id="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="compound" className="block text-sm font-medium text-gray-700">
                        Compound
                    </label>
                    <input
                        type="text"
                        name="compound"
                        id="compound"
                        value={formData.compound}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="developer" className="block text-sm font-medium text-gray-700">
                        Developer
                    </label>
                    <input
                        type="text"
                        name="developer"
                        id="developer"
                        value={formData.developer}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                        Purpose
                    </label>
                    <select
                        name="purpose"
                        id="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    >
                        <option value="">Select Purpose</option>
                        <option value="Sell">Sell</option>
                        <option value="Rent">Rent</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="finishing" className="block text-sm font-medium text-gray-700">
                        Finishing
                    </label>
                    <select
                        name="finishing"
                        id="finishing"
                        value={formData.finishing}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    >
                        <option value="">Select Finishing</option>
                        <option value="Fully Finished">Fully Finished</option>
                        <option value="Semi Finished">Semi Finished</option>
                        <option value="Core & Shell">Core & Shell</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="view" className="block text-sm font-medium text-gray-700">
                        View
                    </label>
                    <input
                        type="text"
                        name="view"
                        id="view"
                        value={formData.view}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                        Floor
                    </label>
                    <input
                        type="number"
                        name="floor"
                        id="floor"
                        value={formData.floor}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="roomsCount" className="block text-sm font-medium text-gray-700">
                        Rooms Count
                    </label>
                    <input
                        type="number"
                        name="roomsCount"
                        id="roomsCount"
                        value={formData.roomsCount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="bathroomCount" className="block text-sm font-medium text-gray-700">
                        Bathroom Count
                    </label>
                    <input
                        type="number"
                        name="bathroomCount"
                        id="bathroomCount"
                        value={formData.bathroomCount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
                        Land Area
                    </label>
                    <input
                        type="number"
                        name="landArea"
                        id="landArea"
                        value={formData.landArea}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="gardenSize" className="block text-sm font-medium text-gray-700">
                        Garden Size
                    </label>
                    <input
                        type="number"
                        name="gardenSize"
                        id="gardenSize"
                        value={formData.gardenSize}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="garageArea" className="block text-sm font-medium text-gray-700">
                        Garage Area
                    </label>
                    <input
                        type="number"
                        name="garageArea"
                        id="garageArea"
                        value={formData.garageArea}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">
                        Total Price
                    </label>
                    <input
                        type="number"
                        name="totalPrice"
                        id="totalPrice"
                        value={formData.totalPrice}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">
                        Down Payment
                    </label>
                    <input
                        type="number"
                        name="downPayment"
                        id="downPayment"
                        value={formData.downPayment}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="paymentPlans" className="block text-sm font-medium text-gray-700">
                        Payment Plans
                    </label>
                    <input
                        type="text"
                        name="paymentPlans"
                        id="paymentPlans"
                        value={formData.paymentPlans}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">
                        Delivery Date
                    </label>
                    <input
                        type="date"
                        name="deliveryDate"
                        id="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                        Client ID
                    </label>
                    <input
                        type="text"
                        name="clientId"
                        id="clientId"
                        value={formData.clientId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                        Client Name
                    </label>
                    <input
                        type="text"
                        name="clientName"
                        id="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>

                <div>
                    <label htmlFor="dataSource" className="block text-sm font-medium text-gray-700">
                        Data Source
                    </label>
                    <input
                        type="text"
                        name="dataSource"
                        id="dataSource"
                        value={formData.dataSource}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
                    />
                </div>
            </div>

            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images
                </label>
                <div className="flex flex-wrap gap-4">
                    {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.url || image.thumbnailUrl}
                                alt={`Uploaded ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Update
                </button>
            </div>
        </form>
    );
};

export default UpdateUnitForm; 