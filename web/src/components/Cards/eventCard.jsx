import './EventCard.css';
import { useState } from 'react';

const EventCard = ({ event, showActions = false, onDelete }) => {
    // State to track if image failed to load
    const [imageError, setImageError] = useState(false);

    // Delete event function
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    };

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Create the correct image URL
    const getImageUrl = () => {
        if (!event.image_url) return null;
        
        // If it's already a full URL, use it
        if (event.image_url.startsWith('http')) {
            return event.image_url;
        }
        
        // Build the API URL for the image
        return `http://localhost/api/uploads/${event.image_url.replace('/uploads/', '')}`;
    };

    // Handle when image fails to load
    const handleImageError = () => {
        const imageUrl = getImageUrl();
        console.log('Image failed to load:', imageUrl);
        setImageError(true);
    };

    const imageUrl = getImageUrl();

    return (
        <div className="event-card">
            {/* Image Section */}
            {imageUrl && (
                <div className="event-image">
                    {imageError ? (
                        <div className="no-image">
                            <span>No Image Available</span>
                        </div>
                    ) : (
                        <img 
                            src={imageUrl}
                            alt={event.title}
                            onError={handleImageError}
                        />
                    )}
                </div>
            )}
            
            {/* Event Details Section */}
            <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                
                {event.location && (
                    <p className="event-info">
                        <strong>Location:</strong> {event.location}
                    </p>
                )}
                
                <p className="event-info">
                    <strong>Date & Time:</strong> {formatDate(event.event_time)}
                </p>
                
                {event.capacity && (
                    <p className="event-info">
                        <strong>Capacity:</strong> {event.capacity} people
                    </p>
                )}
                
                <p className="event-info">
                    <strong>Created:</strong> {formatDate(event.created_at)}
                </p>
                
                {/* Delete Button (only show if needed) */}
                {showActions && (
                    <div className="event-actions">
                        <button 
                            className="delete-btn" 
                            onClick={handleDelete}
                        >
                            Delete Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;