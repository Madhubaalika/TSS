import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const response = await axios.get('/api/volunteers/all-volunteers');
                setVolunteers(response.data);
            } catch (error) {
                console.error('Failed to fetch volunteers', error);
            }
        };
        fetchVolunteers();
    }, []);

    
    return (
        <div className="p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Volunteers</h1>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-4">ID</th>
                            <th className="border border-gray-300 p-4">Name</th>
                            <th className="border border-gray-300 p-4">Email</th>
                            <th className="border border-gray-300 p-4">Phone</th>
                            <th className="border border-gray-300 p-4">Skills</th>
                            <th className="border border-gray-300 p-4">Date Joined</th>
                            <th className="border border-gray-300 p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.length > 0 ? (
                            volunteers.map(volunteer => (
                                <tr key={volunteer._id}>
                                    <td className="border border-gray-300 p-4">{volunteer._id}</td>
                                    <td className="border border-gray-300 p-4">{volunteer.name}</td>
                                    <td className="border border-gray-300 p-4">{volunteer.email}</td>
                                    <td className="border border-gray-300 p-4">{volunteer.phone}</td>
                                    <td className="border border-gray-300 p-4">{volunteer.skills}</td>
                                    <td className="border border-gray-300 p-4">{new Date(volunteer.date).toLocaleDateString()}</td>
                                    <td>
    <center>
        {volunteer.paymentHistory && volunteer.paymentHistory.length > 0 ? (
            <span className="text-green-500 font-semibold">Paid</span>
        ) : (
            <Link to={`/volunteer/${volunteer._id}/pay`}>
                <button className="bg-red-500 text-white p-1 rounded">
                    Pay
                </button>
            </Link>
        )}
    </center>
</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="border border-gray-300 p-4">No volunteers available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    );
};

export default VolunteerList;
