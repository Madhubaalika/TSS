import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    owner:'',
   title: '',
   description: '',
   organizedBy: '',
   eventDate: '',
   eventTime: '',
   booth: '',
   category:'',
   ticketPrice: '',
   Participants: '',
   Count: '',
   Income: '',
   Quantity: '',
   image: '',
   likes: '',
   Comment: [],
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/admin/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  
  

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setEventDetails({
      owner: event.owner,
      title: event.title,
      description:event.description,
      organizedBy:event.organizedBy,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      booth: event.booth,
      category:event.category,
      ticketPrice: event.ticketPrice,
      Participants: event.Participants,
   Count: event.Count,
   Income: event.Income,
   Quantity: event.Quantity,
   image: event.image,
   likes: event.likes,
   Comment: event.Comment,
    });
  };

  const handleDeleteClick = async (eventId) => {
    try {
      await axios.delete(`/api/admin/events/${eventId}`);
      fetchEvents(); // Refresh the event list
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSaveChanges = async (eventId) => {
    try {
      await axios.put(`/api/admin/events/${eventId}`, eventDetails);
      setEditingEventId(null);
      fetchEvents(); // Refresh the event list
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="p-4 overflow-auto">
   
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-4">Owner</th>
            <th className="border border-gray-300 p-4">Title</th>
            <th className="border border-gray-300 p-4">Description</th>
            <th className="border border-gray-300 p-4">Organizedby</th>
            <th className="border border-gray-300 p-4">Date</th>
            <th className="border border-gray-300 p-4">Time</th>
            <th className="border border-gray-300 p-4">Category</th>
            <th className="border border-gray-300 p-4">Booth</th>
            <th className="border border-gray-300 p-4">Ticket Price</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="owner"
                    value={eventDetails.owner}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.owner
                )}
              </td><td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="title"
                    value={eventDetails.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.title
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="description"
                    value={eventDetails.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.description
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="organizedBy"
                    value={eventDetails.organizedBy}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.organizedBy
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="date"
                    name="eventDate"
                    value={eventDetails.eventDate}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.eventDate
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="time"
                    name="eventTime"
                    value={eventDetails.eventTime}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.eventTime
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="category"
                    value={eventDetails.category}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.category
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="text"
                    name="booth"
                    value={eventDetails.booth}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.booth
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <input
                    type="number"
                    name="ticketPrice"
                    value={eventDetails.ticketPrice}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                ) : (
                  event.ticketPrice
                )}
              </td>
             
              <td className="border border-gray-300 p-4">
                {editingEventId === event._id ? (
                  <div>
                    <button
                      onClick={() => handleSaveChanges(event._id)}
                      className="bg-green-500 text-white p-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="bg-gray-500 text-white p-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => handleEditClick(event)}
                      className="bg-blue-500 text-white p-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(event._id)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
   
    </div>
  );
}

export default EventList;
