import './Experience.css';
import { useState } from 'react';
import { postExperience } from '../../arc/experience/experienceServices';

const Experience = () => {
    const [formData, setFormData] = useState({
        type: 'photo',
        content: '',
    });
    
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const { type, content } = formData;
        const { ok, data } = await postExperience({ type, content, image });

        if (!ok) {
        setMessage(`Failed: ${data?.error || 'Something went wrong'}`);
        } else {
        setMessage('Experience created successfully');
        setFormData({ type: 'photo', content: '' });
        setImage(null);
        }
    };

    return (
        <div className="experience-page">
        <div className="experience-form-container">
            <h2>Create Experience</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
            <div>
                <label>Type:</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                <option value="photo">Photo</option>
                <option value="article">Article</option>
                </select>
            </div>

            <div>
                <label>Content:</label>
                <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="5"
                placeholder="Write your story or description..."
                required
                />
            </div>

            <div>
                <label>Upload Image:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <button type="submit">Create Experience</button>
            </form>
        </div>
        </div>
    );
};

export default Experience;
