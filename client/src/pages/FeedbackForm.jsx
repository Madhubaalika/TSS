import axios from 'axios';
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";
const FeedbackForm = ({ eventId }) => {
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState('');
    const { user } = useContext(UserContext);
    const handleSubmit = (e) => {
        e.preventDefault();

        // Submit feedback to the server
        axios.post(`/api/submit-feedback/${user._id}`, { eventId, rating, comments })
            .then(response => alert('Feedback submitted!'))
            .catch(error => console.error('Error submitting feedback:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Rating:
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="0">Select</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                </select>
            </label>

            <label>
                Comments:
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
            </label>

            <button type="submit">Submit Feedback</button>
        </form>
    );
};

export default FeedbackForm;
