import './experienceCard.css';
import { useState } from 'react';

const ExperienceCard = ({ experience, showActions = false, onDelete }) => {
    // State to track if image failed to load
    const [imageError, setImageError] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this experience?')) {
            if (onDelete) {
                onDelete(experience.id);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Create the correct image URL (matching EventCard logic)
    const getImageUrl = () => {
        if (!experience.image_url) return null;
        
        // If it's already a full URL, use it
        if (experience.image_url.startsWith('http')) {
            return experience.image_url;
        }
        
        // Build the API URL for the image (same as EventCard)
        return `http://localhost/api/uploads/${experience.image_url.replace('/uploads/', '')}`;
    };

    // Handle when image fails to load
    const handleImageError = () => {
        const imageUrl = getImageUrl();
        console.log('Experience image failed to load:', imageUrl);
        setImageError(true);
    };

    const imageUrl = getImageUrl();

    return (
        <div className="experience-card">
            {/* Image Section */}
            {imageUrl && (
                <div className="experience-image">
                    {imageError ? (
                        <div className="no-image">
                            <span>No Image Available</span>
                        </div>
                    ) : (
                        <img 
                            src={imageUrl}
                            alt={experience.title || 'Experience image'}
                            onError={handleImageError}
                        />
                    )}
                </div>
            )}
            
            <div className="experience-content">
                <h3 className="experience-title">{experience.title}</h3>
                
                {experience.location && (
                    <p className="experience-location">
                        <span className="label">Location:</span> {experience.location}
                    </p>
                )}
                
                <p className="experience-description">
                    {experience.description || experience.content}
                </p>
                
                {experience.category && (
                    <p className="experience-category">
                        <span className="label">Category:</span> {experience.category}
                    </p>
                )}
                
                {experience.type && (
                    <p className="experience-type">
                        <span className="label">Type:</span> {experience.type}
                    </p>
                )}
                
                <p className="experience-created">
                    <span className="label">Shared:</span> {formatDate(experience.created_at)}
                </p>
                
                {showActions && (
                    <div className="experience-actions">
                        <button 
                            className="delete-button" 
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceCard;