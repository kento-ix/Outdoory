import { getApiBaseUrl } from "../config";

// post experience
export async function postExperience({ type, content, image }) {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('content', content);

    if (image) {
        formData.append('image', image);
    }

    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=createExp`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Post Experience Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get experiences
export async function getExperiences() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=listExp`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.experiences && Array.isArray(data.experiences)) {
            data.experiences = data.experiences.map(exp => {
                if (exp.image_url) exp.image_url = normalizeImageUrl(exp.image_url);
                return exp;
            });
        }

        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Experiences Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// get user's own experiences
export async function getUserExperiences() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=userExp`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();

        if (data?.experiences && Array.isArray(data.experiences)) {
            data.experiences = data.experiences.map(exp => {
                if (exp.image_url) exp.image_url = normalizeImageUrl(exp.image_url);
                return exp;
            });
        }

        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get User Experiences Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// delete experience
export async function deleteExperience(experienceId) {
    try {
        const res = await fetch(`${getApiBaseUrl()}/routes?action=deleteExp&id=${experienceId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        const data = await res.json();
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Delete Experience Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}

// fix image path
function normalizeImageUrl(imageUrl) {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

    return `${getApiBaseUrl()}/api/uploads/${imageUrl.replace('/uploads/', '')}`;
}
