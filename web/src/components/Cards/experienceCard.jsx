import './experienceCard.css';

const ExperienceCard = ({ experience, showActions = false, onDelete }) => {
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

    return (
        <div className="experience-card">
            {experience.image_url && (
                <div className="experience-image">
                    <img 
                        src={`http://localhost${experience.image_url}`} 
                        alt={experience.title}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
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
                    {experience.description}
                </p>
                
                {experience.category && (
                    <p className="experience-category">
                        <span className="label">Category:</span> {experience.category}
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