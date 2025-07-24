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
        
        // デバッグ用ログ
        console.log('Post Event Response:', data);
        
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
        
        // デバッグ用ログ - APIレスポンスの構造を確認
        console.log('Get Events Response:', data);
        
        // 画像パスの前処理（必要に応じて）
        if (data?.events && Array.isArray(data.events)) {
            data.events = data.events.map(event => {
                // 画像URLの正規化
                if (event.image_url) {
                    // 必要に応じて画像URLの前処理を行う
                    event.image_url = normalizeImageUrl(event.image_url);
                }
                
                // 複数画像への対応
                if (event.images && typeof event.images === 'string') {
                    try {
                        // JSON文字列の場合はパース
                        event.images = JSON.parse(event.images);
                    } catch (e) {
                        // カンマ区切り文字列の場合は分割
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

// 画像URLを正規化する関数
function normalizeImageUrl(imageUrl) {
    if (!imageUrl) return null;
    
    // 既に完全なURLの場合はそのまま返す
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // 先頭にスラッシュがない場合は追加
    if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
    }
    
    // APIディレクトリ内の画像パスを適切に構築
    if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/images/')) {
        return imageUrl;
    } else if (imageUrl.startsWith('/api/')) {
        return imageUrl;
    } else {
        // デフォルトのアップロードディレクトリを仮定
        return '/api/uploads/' + imageUrl.replace(/^\//, '');
    }
}

// 特定のイベントを取得する関数（必要に応じて）
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
        
        // デバッグ用ログ
        console.log('Get Event Response:', data);
        
        // 画像URLの正規化
        if (data?.event?.image_url) {
            data.event.image_url = normalizeImageUrl(data.event.image_url);
        }
        
        return { ok: res.ok, data, status: res.status };
    } catch (error) {
        console.error('Get Event Error:', error);
        return { ok: false, data: { error: error.message }, status: 0 };
    }
}