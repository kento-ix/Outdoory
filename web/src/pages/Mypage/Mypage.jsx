import { useAtom } from 'jotai';
import { viewModeAtom } from '../../atoms/uiAtoms';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserEvents, deleteEvent, updateEvent } from '../../arc/event/eventServices';
import { getUserExperiences } from '../../arc/experience/experienceServices';
import { deleteExperience } from '../../arc/experience/experienceServices';
import EventCard from '../../components/Cards/eventCard';
import ExperienceCard from '../../components/Cards/experienceCard';

import './Mypage.css';

const Mypage = () => {
    const [viewMode] = useAtom(viewModeAtom);
    const [events, setEvents] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUserEvents = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { ok, data, status } = await getUserEvents();
            
            console.log('Fetch User Events Result:', { ok, data, status });
            
            if (ok && data?.events) {
                data.events.forEach((event, index) => {
                    console.log(`My Event ${index + 1} (ID: ${event.id}):`, {
                        title: event.title,
                        image_url: event.image_url,
                        images: event.images,
                        hasImageData: !!event.image_url || (event.images && event.images.length > 0)
                    });
                });
                
                setEvents(data.events);
            } else {
                const errorMessage = data?.error || `Failed to fetch user events (Status: ${status})`;
                console.error('User events fetch error:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error('User events fetch exception:', err);
            setError('Network error occurred while fetching user events');
        }
        
        setLoading(false);
    };

    const fetchUserExperiences = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { ok, data, status } = await getUserExperiences();
            
            console.log('Fetch User Experiences Result:', { ok, data, status });
            
            if (ok && data?.experiences) {
                data.experiences.forEach((experience, index) => {
                    console.log(`My Experience ${index + 1} (ID: ${experience.id}):`, {
                        title: experience.title,
                        content: experience.content,
                        type: experience.type,
                        image_url: experience.image_url,
                        hasImageData: !!experience.image_url,
                        fullObject: experience
                    });
                });
                
                setExperiences(data.experiences);
            } else {
                const errorMessage = data?.error || `Failed to fetch user experiences (Status: ${status})`;
                console.error('User experiences fetch error:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error('User experiences fetch exception:', err);
            setError('Network error occurred while fetching user experiences');
        }
        
        setLoading(false);
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('do you want to delete event?')) {
            return;
        }

        try {
            const result = await deleteEvent(eventId);
            
            if (result.ok) {
                console.log('Successfully deleted event:', eventId);
                fetchUserEvents();
            } else {
                console.error('Failed to delete event:', result.data?.error);
                alert(result.data?.error || 'fail to delete event');
            }
        } catch (error) {
            console.error('Delete event exception:', error);
        }
    };

    const handleUpdateEvent = async (eventId, updateData) => {
        try {
            console.log('Updating event:', eventId, updateData);
            
            const result = await updateEvent(eventId, updateData);
            
            if (result.ok) {
                console.log('Successfully updated event:', eventId);
                alert('Event updated successfully!');
                fetchUserEvents();
            } else {
                console.error('Failed to update event:', result.data?.error);
                alert(result.data?.error || 'Failed to update event');
            }
        } catch (error) {
            console.error('Update event exception:', error);
            alert('An error occurred while updating the event');
        }
    };

    const handleDeleteExperience = async (experienceId) => {
        if (!window.confirm('Do you want to delete?')) {
            return;
        }

        try {
            const result = await deleteExperience(experienceId);
            
            if (result.ok) {
                console.log('Successfully deleted experience:', experienceId);
                alert('experience has deleted');
                fetchUserExperiences();
            } else {
                console.error('Failed to delete experience:', result.data?.error);
                alert(result.data?.error || 'fail to delete experience');
            }
        } catch (error) {
            console.error('Delete experience exception:', error);
        }
    };

    useEffect(() => {
        console.log('Mypage view mode changed to:', viewMode);
        
        if (viewMode === "event") {
            fetchUserEvents();
        } else {
            fetchUserExperiences();
        }
    }, [viewMode]);

    return(
        <div className="home-container">
            {viewMode === "event" ? (
                <div className="event-section">
                    <div className="event-header">
                        <h2>My Events</h2>
                        <Link to={"/event"} className="create-event-link">
                            Create event
                        </Link>
                    </div>
                    
                    {loading && (
                        <div className="loading">Loading your events...</div>
                    )}
                    
                    {!loading && !error && events.length === 0 && (
                        <div className="no-content">
                            <p>You haven't created any events yet.</p>
                            <Link to={"/event"} className="create-event-link">
                                Create your first event
                            </Link>
                        </div>
                    )}
                    
                    {!loading && !error && events.length > 0 && (
                        <div className="content-grid">
                            {events.map(event => (
                                <EventCard 
                                    key={event.id}
                                    event={event}
                                    showActions={true} // display delete button
                                    showParticipation={false} // not display join event button
                                    isOwner={true} // display host info
                                    onDelete={handleDeleteEvent}
                                    onUpdate={handleUpdateEvent}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="experience-section">
                    <div className="experience-header">
                        <h2>My Experience</h2>
                        <Link to={"/experience"} className='create-experience-link'>
                            Add experience
                        </Link>
                    </div>
                    
                    {/* loading */}
                    {loading && (
                        <div className="loading">Loading your experiences...</div>
                    )}
                    
                    {/* if no content is found */}
                    {!loading && !error && experiences.length === 0 && (
                        <div className="no-content">
                            <p>You haven't shared any experiences yet.</p>
                            <Link to={"/experience"} className='create-experience-link'>
                                Add your first experience
                            </Link>
                        </div>
                    )}
                    
                    {/* display experience content */}
                    {!loading && !error && experiences.length > 0 && (
                        <div className="content-grid">
                            {experiences.map(experience => (
                                <ExperienceCard 
                                    key={experience.id} 
                                    experience={experience}
                                    showActions={true} // display delete buntton
                                    onDelete={handleDeleteExperience}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Mypage;