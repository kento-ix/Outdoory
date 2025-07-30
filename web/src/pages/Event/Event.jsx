// Event form
import './Event.css';
import { useState } from 'react';
import { postEvent } from '../../arc/event/eventServices';

const Event = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        event_time: '',
        capacity: ''
    });
    const [images, setImages] = useState([]);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const { title, location, event_time, capacity } = formData;
        const { ok, data } = await postEvent({ title, location, event_time, capacity, images });

        if(!ok) {
            setMessage(`Failed: ${data?.error || `Something went wrong`}`);
        } else {
            setMessage(`Event create sunncessfully`);

            setFormData({ title: '', location: '', event_time: '', capacity: '' });
            setImages([]);
        }
    };

    return (
        <div className="event-page">
            <div className="event-form-container">
                <h2>Create event</h2>
                {message && <p>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Location:</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Date:</label>
                        <input type="datetime-local" name="event_time" value={formData.event_time} onChange={handleChange} required />
                    </div>

                    <div>
                        <label>Capacity:</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label>Upload Image:</label>
                        <input type="file" name="images" accept="image/*" multiple onChange={handleFileChange}/>
                    </div>

                    <button type="submit">Event create</button>
                </form>
            </div>
        </div>
    );
};

export default Event;
