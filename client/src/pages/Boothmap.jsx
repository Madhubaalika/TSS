import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Boothmap() {
  const [booths, setBooths] = useState(Array(30).fill({ status: 'available', eventName: '' }));

  useEffect(() => {
    // Fetch booth data from the backend
    axios.get('/api/boothAvailability')
      .then(response => {
        const updatedBooths = booths.map((booth, index) => {
          const boothInfo = response.data.find(b => b.booth === index + 1);
          return boothInfo
            ? { status: 'booked', title: boothInfo.title }
            : { status: 'available', title: '' };
        });
        setBooths(updatedBooths);
      })
      .catch(error => console.error('Error fetching booth data:', error));
  }, []);

  return (
    <div>
      <h2>Booth Availability</h2>
      <div className="booth-map">
        {booths.map((booth, index) => (
          <div key={index} className={`booth ${booth.status}`}>
            Booth {index + 1}
            {booth.title && <div className="event-name">{booth.title}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boothmap;
