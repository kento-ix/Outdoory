// event creaete async
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
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get events 