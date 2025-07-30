import './EventCard.css';
import { useState } from 'react';

const EventCard = ({ 
    event, 
    showActions = false,
    showParticipation = false,
    isOwner = false,
    onDelete,
    onJoin,
    onLeave
}) => {

    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    console.log('Event participation debug:', {
        eventId: event.id,
        isParticipating: event.is_participating,
        isOwner: isOwner,
        showParticipation: showParticipation,
        participantCount: event.participant_count
    });

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
                
                {/* 主催者表示 */}
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
                    <strong>Date & Time:</strong> {formatDate(event.event_time)}
                </p>
                
                {/* 参加者数・定員表示 */}
                <p className="event-info">
                    <strong>Participants:</strong> 
                    {event.participant_count !== undefined ? event.participant_count : 0}
                    {event.capacity && ` / ${event.capacity}`} people
                    {isCapacityFull && <span className="capacity-full"> (Full)</span>}
                </p>
                
                <p className="event-info">
                    <strong>Created:</strong> {formatDate(event.created_at)}
                </p>
                
                {/* アクションボタンセクション */}
                {(showActions || showParticipation) && (
                    <div className="event-actions">
                        {/* for host */}
                        {showActions && isOwner && (
                            <button 
                                className="delete-btn" 
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                Delete Event
                            </button>
                        )}
                        
                        {/* for participant */}
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
                        
                        {/* 主催者への参加状況表示 */}
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