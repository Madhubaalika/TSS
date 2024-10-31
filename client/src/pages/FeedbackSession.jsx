import axios from 'axios';
import FeedbackForm from './FeedbackForm';
import { UserContext } from "../UserContext";
import { useContext, useEffect, useState } from "react";

const FeedbackSession = () => {
    const { user } = useContext(UserContext);
    const [completedEvents, setCompletedEvents] = useState([]);

    useEffect(() => {
        if (!user) {
            console.error('User is not logged in');
            return; // Exit if the user is not authenticated
        }

        // Fetch completed events from the backend
        axios.get(`/api/completed-events/${user._id}`)
            .then(response => setCompletedEvents(response.data))
            .catch(error => console.error('Error fetching completed events:', error));
    }, [user]); // Add user as a dependency to re-fetch if user changes

    return (
        <div>
            <h1>Feedback Session</h1>
            {completedEvents.length === 0 ? (
                <p>You have no completed events to provide feedback for.</p>
            ) : (
                completedEvents.map(ticket => (
                    <div key={ticket._id}> {/* Use ticket._id instead of ticket.eventid */}
                        <h2>{ticket.ticketDetails.eventname}</h2>
                        <p>Date: {new Date(ticket.ticketDetails.eventdate).toLocaleDateString()}</p>
                        <p>Time: {ticket.ticketDetails.eventtime}</p>
                        <p>Price: ${ticket.ticketDetails.ticketprice}</p>
                        
                        {/* Feedback form for the event */}
                        <FeedbackForm eventId={ticket.eventid} />
                    </div>
                ))
            )}
        </div>
    );
};

export default FeedbackSession;
