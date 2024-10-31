import  { useContext, useState,useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function AddEvent() {
  const {user} = useContext(UserContext);
  const [formData, setFormData] = useState({

    owner: user? user.name : "",
    title: "",
    optional:"",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    booth: "",
    category:"",
    ticketPrice: 0,
    image: null,
    likes: 0
  });
  const [availableBooths, setAvailableBooths] = useState([]);

  useEffect(() => {
      // Fetch available booths from backend
      axios.get('/api/booth/available-booths')
          .then(response => setAvailableBooths(response.data))
          .catch(error => console.error('Error fetching available booths:', error));
  }, []);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create FormData object
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    axios.post("/createEvent", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("Event posted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });
  };

  return (
    <div className='flex flex-col ml-20 mt-10'>
      <div><h1 className='font-bold text-[36px] mb-5'>Post an Event</h1></div>
      
      <form onSubmit={handleSubmit} className='flex flex-co'>
      <div className='flex flex-col gap-5'>
        <label className='flex flex-col'>
          Title:
          <input
            type="text"
            name="title"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Optional:
          <input
            type="text"
            name="optional"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.optional}
            onChange={handleChange}
          />
        </label >
        <label className='flex flex-col'>
          Description:
          <textarea
            name="description"
            className=' rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 h-8 border-none'
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Organized By:
          <input
            type="text"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Event Date:
          <input
            type="date"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Event Time:
          <input
            type="time"
            name="eventTime"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.eventTime}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
                Booth:
                <select
                    name="booth"
                    className="rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none"
                    value={formData.booth}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a booth</option>
                    {availableBooths.map(booth => (
                        <option key={booth} value={booth}>
                            Booth {booth}
                        </option>
                    ))}
                </select>
            </label>
            <label className='flex flex-col'>
          Cateogory:
          <input
            type="text"
            name="category"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.category}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Ticket Price:
          <input
            type="number"
            name="ticketPrice"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.ticketPrice}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Image:
          <input
            type="file"
            name="image"
            className=' rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none'
            onChange={handleImageUpload}
          />
        </label >
        <button className='primary' type="submit">Submit</button>
        </div>
        
      </form>
    </div>
  );
}
