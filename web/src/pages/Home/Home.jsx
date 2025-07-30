import { useAtom } from 'jotai';
import { viewModeAtom } from '../../atoms/uiAtoms';
import { authUserAtom } from '../../atoms/authAtoms';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../arc/event/eventServices';
import { getExperiences } from '../../arc/experience/experienceServices';
import { joinEvent, leaveEvent, getEventDetail } from '../../arc/event/eventParticipantServices';
import EventCard from '../../components/Cards/eventCard';
import ExperienceCard from '../../components/Cards/experienceCard';

import './Home.css';

const Home = () => {
    const [viewMode] = useAtom(viewModeAtom);
    const [currentUser] = useAtom(authUserAtom);
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
                const eventsWithDetails = await Promise.all(
                    data.events.map(async (event) => {
                        try {
                            const detailResult = await getEventDetail(event.id);
                            if (detailResult.ok && detailResult.data?.event) {
                                return detailResult.data.event;
                            }
                        } catch (error) {
                            console.error(`Failed to fetch details for event ${event.id}:`, error);
                        }
                        return { ...event, participant_count: 0, is_participating: false };
                    })
                );
                
                setEvents(eventsWithDetails);
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
                data.experiences.forEach((experience, index) => {
                    console.log(`Experience ${index + 1} (ID: ${experience.id}):`, {
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

    // イベント参加処理
    const handleJoin = async (eventId) => {
        try {
            const result = await joinEvent(eventId);
            
            if (result.ok) {
                console.log('Successfully joined event:', eventId);
                // イベント一覧を再取得して最新状態に更新
                fetchEvents();
            } else {
                console.error('Failed to join event:', result.data?.error);
                alert(result.data?.error || 'Failed to join event');
            }
        } catch (error) {
            console.error('Join event exception:', error);
            alert('An error occurred while joining the event');
        }
    };

    // イベント離脱処理
    const handleLeave = async (eventId) => {
        try {
            const result = await leaveEvent(eventId);
            
            if (result.ok) {
                console.log('Successfully left event:', eventId);
                // イベント一覧を再取得して最新状態に更新
                fetchEvents();
            } else {
                console.error('Failed to leave event:', result.data?.error);
                alert(result.data?.error || 'Failed to leave event');
            }
        } catch (error) {
            console.error('Leave event exception:', error);
            alert('An error occurred while leaving the event');
        }
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

                    {!loading && !error && events.length === 0 && (
                        <div className="no-content">
                            <p>No events available.</p>
                        </div>
                    )}
                    
                    {!loading && !error && events.length > 0 && (
                        <div className="content-grid">
                            {events.map(event => (
                                <EventCard 
                                    key={event.id}
                                    event={event}
                                    showActions={false}
                                    showParticipation={true}
                                    isOwner={currentUser && event.user_id === currentUser.id}
                                    onJoin={handleJoin}
                                    onLeave={handleLeave}
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

                    {!loading && !error && experiences.length === 0 && (
                        <div className="no-content">
                            <p>No experiences available.</p>
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