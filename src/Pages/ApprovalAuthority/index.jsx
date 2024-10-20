import React, { useState } from 'react';

// Sample request data
const sampleRequests = {
    assetRequests: [
        { id: 1, assetName: 'Laptop', status: 'pending', date: '2024-10-15' },
        { id: 2, assetName: 'Desktop', status: 'pending', date: '2024-10-14' },
        { id: 3, assetName: 'Tablet', status: 'pending', date: '2024-10-13' },
        { id: 4, assetName: 'Printer', status: 'pending', date: '2024-10-12' },
        { id: 5, assetName: 'Monitor', status: 'pending', date: '2024-10-11' },
        { id: 6, assetName: 'Keyboard', status: 'pending', date: '2024-10-10' },
        { id: 7, assetName: 'Mouse', status: 'pending', date: '2024-10-09' },
        { id: 8, assetName: 'Webcam', status: 'pending', date: '2024-10-08' },
        { id: 9, assetName: 'Speaker', status: 'pending', date: '2024-10-07' },
        { id: 10, assetName: 'Headphone', status: 'pending', date: '2024-10-06' },
        { id: 11, assetName: 'Charger', status: 'pending', date: '2024-10-05' },
        { id: 12, assetName: 'Projector', status: 'pending', date: '2024-10-04' },
    ],
    categoryRequests: [
        { id: 1, categoryName: 'Electronics', status: 'pending', date: '2024-10-13' },
        { id: 2, categoryName: 'Furniture', status: 'pending', date: '2024-10-12' },
    ],
    workflowRequests: [
        { id: 1, workflowName: 'Onboarding', status: 'pending', date: '2024-10-11' },
        { id: 2, workflowName: 'Offboarding', status: 'pending', date: '2024-10-10' },
    ],
};

// Table component for displaying requests in tabs
const RequestTable = ({ type, requests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const requestData = {
        Asset: requests.assetRequests,
        Category: requests.categoryRequests,
        Workflow: requests.workflowRequests,
    }[type];

    // Function to filter requests based on search term and filters
    const filteredRequests = requestData.filter((request) => {
        const name =
            type === 'Asset' ? request.assetName : type === 'Category' ? request.categoryName : request.workflowName;
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory ? request.categoryName === selectedCategory : true;
        const matchesDate =
            (!startDate || new Date(request.date) >= new Date(startDate)) &&
            (!endDate || new Date(request.date) <= new Date(endDate));
        return matchesSearch && matchesCategory && matchesDate;
    });

    return (
        <div className="bg-white rounded-lg p-4 shadow-md mt-4 w-full">
            {/* Search Bar */}
            <input
                type="text"
                placeholder={`Search ${type}...`}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full md:w-1/2 lg:w-[20%]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row mb-4 space-y-2 md:space-y-0 md:space-x-2">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-48"
                >
                    <option value="">All Categories</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Offboarding">Offboarding</option>
                </select>

                <input
                    type="date"
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-48"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-48"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            {/* Table with increased height and width */}
            <div className="overflow-x-auto">
                <div className="max-h-[33.5rem] overflow-y-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="py-2 px-4 text-left">Sr. No.</th>
                                <th className="py-2 px-4 text-left">{type} Name</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request, index) => (
                                    <tr key={request.id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">
                                            {type === 'Asset'
                                                ? request.assetName
                                                : type === 'Category'
                                                ? request.categoryName
                                                : request.workflowName}
                                        </td>
                                        <td className="py-2 px-4">{request.status}</td>
                                        <td className="py-2 px-4">{request.date}</td>
                                        <td className="py-2 px-4">
                                            <button className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition">
                                                Approve
                                            </button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition ml-2">
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-600">
                                        No matching requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Main ApprovalAuthority component
const ApprovalAuthority = () => {
    const [activeTab, setActiveTab] = useState('Asset');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Asset':
                return <RequestTable type="Asset" requests={sampleRequests} />;
            case 'Category':
                return <RequestTable type="Category" requests={sampleRequests} />;
            case 'Workflow':
                return <RequestTable type="Workflow" requests={sampleRequests} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Tabs as Cards */}
            <div className="flex flex-wrap justify-center space-x-2 mb-4">
                {['Asset', 'Category', 'Workflow'].map((tab) => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`cursor-pointer p-2 rounded-lg shadow-sm text-center transition hover:shadow-lg transform hover:scale-105 ${
                            activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-blue-600 border border-blue-600'
                        }`}
                    >
                        <h2 className="text-lg font-semibold">{tab} Requests</h2>
                        <p className="text-sm">Manage {tab.toLowerCase()} requests.</p>
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}
        </div>
    );
};

export default ApprovalAuthority;
