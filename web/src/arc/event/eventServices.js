import { getApiBaseUrl } from "../config";

// event create async
export async function postEvent({ title, location, event_time, capacity, images }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('event_time', event_time);
    formData.append('capacity', capacity);

    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            formData.append('images[]', images[i]);
        }
    }

    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=createEvent`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Post Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
};

// get events async
export async function getEvents() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=listEvent`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.events && Array.isArray(data.events)) {
            data.events = data.events.map(event => {
                if (event.image_url) event.image_url = normalizeImageUrl(event.image_url);
                if (event.images && typeof event.images === 'string') {
                    try {
                        event.images = JSON.parse(event.images);
                    } catch {
                        event.images = event.images.split(',').map(img => img.trim());
                    }
                }
                return event;
            });
        }

        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Events Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
};

// get user's own events async
export async function getUserEvents() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=userEvent`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.events && Array.isArray(data.events)) {
            data.events = data.events.map(event => {
                if (event.image_url) event.image_url = normalizeImageUrl(event.image_url);
                if (event.images && typeof event.images === 'string') {
                    try {
                        event.images = JSON.parse(event.images);
                    } catch {
                        event.images = event.images.split(',').map(img => img.trim());
                    }
                }
                return event;
            });
        }

        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get User Events Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
};

// get event info async
export async function getEvent(eventId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=get&id=${eventId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        if (data?.event?.image_url) data.event.image_url = normalizeImageUrl(data.event.image_url);
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
};

// delete event async
export const deleteEvent = async (eventId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${getApiBaseUrl()}/routes?action=deleteEvent&event_id=${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        return { ok: response.ok, data, status: response.status };
    } catch (error) {
        console.error('Delete Event Error:', error);
        return { ok: false, data: { error: 'Network error' }, status: 500 };
    }
};

// update event
export async function updateEvent(eventId, updateData) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=update&event_id=${eventId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(updateData)
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Update Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
};

// fix image path
function normalizeImageUrl(imageUrl) {
    if (!imageUrl) return null;

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    if (!imageUrl.startsWith('/')) imageUrl = '/' + imageUrl;

    if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/images/') || imageUrl.startsWith('/api/')) {
        return imageUrl;
    }

    return '/api/uploads/' + imageUrl.replace(/^\//, '');
};
