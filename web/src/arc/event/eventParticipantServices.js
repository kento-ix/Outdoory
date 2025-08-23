import { getApiBaseUrl } from "../config";

// join event async
export async function joinEvent(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=join`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify({ event_id: eventId })
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Join Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// cancel event async
export async function leaveEvent(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=leave&event_id=${eventId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Leave Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get event participant async
export async function getEventParticipants(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=participants&event_id=${eventId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Event Participants Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// check participation status async
export async function checkParticipationStatus(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=check&event_id=${eventId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Check Participation Status Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get a list of join user async
export async function getMyParticipatingEvents() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=my_events`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.events && Array.isArray(data.events)) {
            data.events = data.events.map(event => {
                if (event.image_url) {
                    event.image_url = normalizeImageUrl(event.image_url);
                }
                
                if (event.images && typeof event.images === 'string') {
                    try {
                        event.images = JSON.parse(event.images);
                    } catch (e) {
                        event.images = event.images.split(',').map(img => img.trim());
                    }
                }
                
                return event;
            });
        }
        
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get My Participating Events Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get event detail async
export async function getEventDetail(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=event_detail&event_id=${eventId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.event?.image_url) {
            data.event.image_url = normalizeImageUrl(data.event.image_url);
        }
        
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Event Detail Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// fix image path
function normalizeImageUrl(imageUrl) {
    if (!imageUrl) return null;

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
    }
    
    if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/images/')) {
        return imageUrl;
    } else if (imageUrl.startsWith('/api/')) {
        return imageUrl;
    } else {
        return '/api/uploads/' + imageUrl.replace(/^\//, '');
    }
}
