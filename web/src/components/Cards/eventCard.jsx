import './EventCard.css';
import { useState } from 'react';

const EventCard = ({ 
    event, 
    showActions = false,
    showParticipation = false,
    isOwner = false,
    onDelete,
    onJoin,
    onLeave,
    onUpdate
}) => {

    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        event_time: '',
        capacity: ''
    });

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    };

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            await onJoin(event.id);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLeave = async () => {
        if (window.confirm('Are you sure you want to leave this event?')) {
            setIsLoading(true);
            try {
                await onLeave(event.id);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleEditClick = () => {
        const eventDate = new Date(event.event_time);
        const formattedDateTime = eventDate.toISOString().slice(0, 16);
        
        setEditData({
            event_time: formattedDateTime,
            capacity: event.capacity || ''
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            event_time: '',
            capacity: ''
        });
    };

    const handleUpdateSubmit = async () => {
        if (!editData.event_time) {
            alert('Event date and time is required');
            return;
        }

        if (editData.capacity && editData.capacity <= 0) {
            alert('Capacity must be greater than 0');
            return;
        }

        const selectedDate = new Date(editData.event_time);
        if (selectedDate < new Date()) {
            alert('Event time cannot be in the past');
            return;
        }

        setIsLoading(true);
        try {
            const mysqlDateTime = editData.event_time.replace('T', ' ') + ':00';
            
            const updateData = {
                event_time: mysqlDateTime,
                capacity: editData.capacity ? parseInt(editData.capacity) : null
            };

            await onUpdate(event.id, updateData);
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

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

    const getImageUrl = () => {
        if (!event.image_url) return null;
        
        if (event.image_url.startsWith('http')) {
            return event.image_url;
        }
        
        return `http://localhost/api/uploads/${event.image_url.replace('/uploads/', '')}`;
    };

    const handleImageError = () => {
        const imageUrl = getImageUrl();
        console.log('Image failed to load:', imageUrl);
        setImageError(true);
    };

    const imageUrl = getImageUrl();
    const isCapacityFull = event.capacity && event.participant_count >= event.capacity;

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
                
                {event.username && (
                    <p className="event-info">
                        <strong>Host:</strong> {event.username}
                        {isOwner && <span className="owner-badge"> (You)</span>}
                    </p>
                )}
                
                {event.location && (
                    <p className="event-info">
                        <strong>Location:</strong> {event.location}
                    </p>
                )}
                
                <p className="event-info">
                    <strong>Date & Time:</strong> 
                    {isEditing ? (
                        <input
                            type="datetime-local"
                            value={editData.event_time}
                            onChange={(e) => handleInputChange('event_time', e.target.value)}
                            className="edit-input"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    ) : (
                        formatDate(event.event_time)
                    )}
                </p>
                
                <p className="event-info">
                    <strong>Participants:</strong> 
                    {event.participant_count !== undefined ? event.participant_count : 0}
                    {isEditing ? (
                        <>
                            {' / '}
                            <input
                                type="number"
                                value={editData.capacity}
                                onChange={(e) => handleInputChange('capacity', e.target.value)}
                                className="edit-input capacity-input"
                                min="1"
                                placeholder="No limit"
                            />
                        </>
                    ) : (
                        <>
                            {event.capacity && ` / ${event.capacity}`} people
                            {isCapacityFull && <span className="capacity-full"> (Full)</span>}
                        </>
                    )}
                </p>
                
                <p className="event-info">
                    <strong>Created:</strong> {formatDate(event.created_at)}
                </p>
                
                {(showActions || showParticipation) && (
                    <div className="event-actions">
                        {showActions && isOwner && (
                            <div className="owner-actions">
                                {isEditing ? (
                                    <div className="edit-actions">
                                        <button 
                                            className="update-confirm-btn" 
                                            onClick={handleUpdateSubmit}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Updating...' : 'Update'}
                                        </button>
                                        <button 
                                            className="cancel-btn" 
                                            onClick={handleCancelEdit}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="normal-actions">
                                        <button 
                                            className="edit-btn" 
                                            onClick={handleEditClick}
                                            disabled={isLoading}
                                        >
                                            Edit Event
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                        >
                                            Delete Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        

                        {showParticipation && !isOwner && (
                            <>
                                {event.is_participating ? (
                                    <button 
                                        className="leave-btn" 
                                        onClick={handleLeave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Leaving...' : 'Leave Event'}
                                    </button>
                                ) : (
                                    <button 
                                        className="join-btn" 
                                        onClick={handleJoin}
                                        disabled={isLoading || isCapacityFull}
                                    >
                                        {isLoading ? 'Joining...' : isCapacityFull ? 'Event Full' : 'Join Event'}
                                    </button>
                                )}
                            </>
                        )}
                        
                        {showParticipation && isOwner && (
                            <div className="owner-status">
                                <span className="host-badge">Event Host</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCard;