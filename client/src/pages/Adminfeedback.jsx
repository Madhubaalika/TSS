import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('/api/feedback/all-feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Failed to fetch feedback', error);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <div className="p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-4">Attendee Feedback</h1>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-4">User</th>
                            <th className="border border-gray-300 p-4">Event</th>
                            <th className="border border-gray-300 p-4">Rating</th>
                            <th className="border border-gray-300 p-4">Comments</th>
                            <th className="border border-gray-300 p-4">Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.length > 0 ? (
                            feedbacks.map(feedback => (
                                <tr key={feedback._id}>
                                    <td className="border border-gray-300 p-4">{feedback.userId?.name || "N/A"}</td>
                                    <td className="border border-gray-300 p-4">{feedback.eventId?.title || "N/A"}</td>
                                    <td className="border border-gray-300 p-4">{feedback.rating}</td>
                                    <td className="border border-gray-300 p-4">{feedback.comments || "No comments"}</td>
                                    <td className="border border-gray-300 p-4">{new Date(feedback.submittedAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="border border-gray-300 p-4">No feedback available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    );
};

export default AdminFeedback;
