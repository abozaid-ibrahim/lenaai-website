import React from 'react';
import { Building2, Home, Square, Bath, Bed, Eye, Landmark, Calendar, DollarSign, MapPin, User } from 'lucide-react';

export default function ChatMetaDataModal({ onClose, metaData }) {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-2xl relative overflow-y-auto max-h-[90vh]'>
                <button
                    className='absolute top-2 right-2 text-gray-600 hover:text-black'
                    onClick={onClose}
                >
                    &times;
                </button>

                {Object.entries(metaData).map(([key, property]) => (
                    <div key={property.property_id} className="mb-8 last:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{property.metadata.unitTitle}</h2>

                        {/* Description */}
                        <p className="text-gray-600 mb-6">{property.description}</p>

                        {/* Property Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Building Type</p>
                                        <p className="text-sm font-medium">{property.metadata.buildingType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Home className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Floor</p>
                                        <p className="text-sm font-medium">{property.metadata.floor}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Bed className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Rooms</p>
                                        <p className="text-sm font-medium">{property.metadata.roomsCount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Bath className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Bathrooms</p>
                                        <p className="text-sm font-medium">{property.metadata.bathroomCount}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Location</p>
                                        <p className="text-sm font-medium">{property.metadata.compound}, {property.metadata.city}, {property.metadata.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Square className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Land Area</p>
                                        <p className="text-sm font-medium">{property.metadata.landArea} m²</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Eye className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">View</p>
                                        <p className="text-sm font-medium">{property.metadata.view}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Landmark className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Finishing</p>
                                        <p className="text-sm font-medium">{property.metadata.finishing}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Delivery Date</p>
                                        <p className="text-sm font-medium">{property.metadata.deliveryDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Developer</p>
                                        <p className="text-sm font-medium">{property.metadata.developer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Price Information */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-2 rounded-md">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="text-sm font-medium">{property.metadata.totalPrice} EGP</p>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        {property.metadata.images && property.metadata.images.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Images</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {property.metadata.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={`Property image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-md"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
