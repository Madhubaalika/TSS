import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';

const VolunteerRegistrationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        skills: ''
        // other fields as necessary
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label>
                Phone:
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
            <label>
                skills:
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} required />
            </label>
            <button type="submit">Register as Volunteer</button>
        </form>
    );
};

const VolunteerSession = () => {
    const { user } = useContext(UserContext);
    const [isRegistered, setIsRegistered] = useState(null); // null means loading

    useEffect(() => {
        if (!user) {
            console.error('User is not logged in');
            return;
        }

        // Check if the user is already registered as a volunteer
        axios.get(`/api/volunteer/is-registered/${user._id}`)
            .then(response => setIsRegistered(response.data.registered))
            .catch(error => console.error('Error checking volunteer registration:', error));
    }, [user]);

    const handleRegistration = (formData) => {
        axios.post(`/api/volunteers-submit/${user._id}`, { ...formData, userid: user._id })
            .then(response => setIsRegistered(true))
            .catch(error => console.error('Error registering as volunteer:', error));
    };

    if (isRegistered === null) {
        return <p>Loading...</p>; // Loading state
    }

    return (
        <div>
            <h1>Volunteer Session</h1>
            {isRegistered ? (
                <p>You are already registered as a volunteer.</p>
            ) : (
                <VolunteerRegistrationForm onSubmit={handleRegistration} />
            )}
        </div>
    );
};

export default VolunteerSession;
