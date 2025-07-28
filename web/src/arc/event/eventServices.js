// event create async
export async function postEvent({title, location, event_time, capacity, images}) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('location', location);
    formData.append('event_time', event_time);
    formData.append('capacity', capacity);

    if(images && images.length > 0) {
        for(let i = 0; i < images.length; i++) {
            formData.append('images[]', images[i]);
        }
    }

    try {
        const res = await fetch("http://localhost/api/routes/events.php?action=create", {
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
}

// get events async
export async function getEvents() {
    try {
        const res = await fetch("http://localhost/api/routes/events.php?action=list", {
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
        console.error('Get Events Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}


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

export async function getEvent(eventId) {
    try {
        const res = await fetch(`http://localhost/api/routes/events.php?action=get&id=${eventId}`, {
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
        console.error('Get Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}