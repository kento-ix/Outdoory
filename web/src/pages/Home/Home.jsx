import { useAtom } from 'jotai';
import { viewModeAtom } from '../../atoms/uiAtoms';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../arc/event/eventServices';
import { getExperiences } from '../../arc/experience/experienceServices';
import EventCard from '../../components/Cards/eventCard';
import ExperienceCard from '../../components/Cards/experienceCard';

import './Home.css';

const Home = () => {
    const [viewMode] = useAtom(viewModeAtom);
    const [events, setEvents] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { ok, data, status } = await getEvents();
            
            console.log('Fetch Events Result:', { ok, data, status });
            
            if (ok && data?.events) {
                data.events.forEach((event, index) => {
                    console.log(`Event ${index + 1} (ID: ${event.id}):`, {
                        title: event.title,
                        image_url: event.image_url,
                        images: event.images,
                        hasImageData: !!event.image_url || (event.images && event.images.length > 0)
                    });
                });
                
                setEvents(data.events);
            } else {
                const errorMessage = data?.error || `Failed to fetch events (Status: ${status})`;
                console.error('Events fetch error:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Events fetch exception:', err);
            setError('Network error occurred while fetching events');
        }
        
        setLoading(false);
    };

    const fetchExperiences = async () => {
        setLoading(true);
        setError('');
        
        try {
            const { ok, data, status } = await getExperiences();
            
            console.log('Fetch Experiences Result:', { ok, data, status });
            
            if (ok && data?.experiences) {
                setExperiences(data.experiences);
            } else {
                const errorMessage = data?.error || `Failed to fetch experiences (Status: ${status})`;
                console.error('Experiences fetch error:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Experiences fetch exception:', err);
            setError('Network error occurred while fetching experiences');
        }
        
        setLoading(false);
    };

    useEffect(() => {
        console.log('View mode changed to:', viewMode);
        
        if (viewMode === "event") {
            fetchEvents();
        } else {
            fetchExperiences();
        }
    }, [viewMode]);

    return(
        <div className="home-container">
            {viewMode === "event" ? (
                <div className="event-section">
                    <div className="event-header">
                        <h2>Event list</h2>
                        <Link to={"/event"} className="create-event-link">
                            Create event
                        </Link>
                    </div>
                    
                    {loading && (
                        <div className="loading">Loading events...</div>
                    )}
                    
                    {error && (
                        <div className="error-message">
                            <p>Error: {error}</p>
                            <button 
                                onClick={fetchEvents} 
                                className="retry-button"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {!loading && !error && events.length === 0 && (
                        <div className="no-content">
                            <p>No events found.</p>
                            <Link to={"/event"} className="create-first-content">
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
                                    showActions={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="experience-section">
                    <div className="experience-header">
                        <h2>Experience</h2>
                        <Link to={"/experience"} className='create-experience-link'>
                            Add experience
                        </Link>
                    </div>
                    
                    {loading && (
                        <div className="loading">Loading experiences...</div>
                    )}
                    
                    {error && (
                        <div className="error-message">
                            <p>Error: {error}</p>
                            <button 
                                onClick={fetchExperiences} 
                                className="retry-button"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {!loading && !error && experiences.length === 0 && (
                        <div className="no-content">
                            <p>No experiences found.</p>
                            <Link to={"/experience"} className="create-first-content">
                                Share your first experience
                            </Link>
                        </div>
                    )}
                    
                    {!loading && !error && experiences.length > 0 && (
                        <div className="content-grid">
                            {experiences.map(experience => (
                                <ExperienceCard 
                                    key={experience.id} 
                                    experience={experience}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;