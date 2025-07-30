# Outdoory 🏔️

[English](#english) | [日本語](#japanese)

---

## English

### 📖 Overview

Outdoory is a web application designed for people who enjoy outdoor activities. It's a platform where you can find companions who share your interests, or join activities organized by others. Try something new even if you have no experience and build a richer lifestyle through exciting adventures.

### ✨ Features

- **Event Management**: Create and join outdoor events
- **Experience Sharing**: Share your outdoor experiences with the community
- **User Authentication**: Secure login and registration system
- **Image Upload**: Upload and share photos from your adventures
- **Companion Finding**: Connect with like-minded outdoor enthusiasts

### 🛠️ Technology Stack

**Frontend:**
- React.js
- CSS3
- Recoil (State Management)

**Backend:**
- PHP
- MySQL
- JWT Authentication
- Composer (Dependency Management)

### 📋 Prerequisites

- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL
- XAMPP (for local development)
- Composer

### 🚀 Installation & Setup

#### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd outdoory
   ```

2. **Start XAMPP**
   - Start Apache and MySQL services in XAMPP

3. **Setup Database**
   ```bash
   cd backend
   php db/create_database.php
   php db/create_tables.php
   ```

4. **Install PHP Dependencies**
   ```bash
   composer install
   ```

5. **Configure Environment**
   - Create `.env` file in backend directory
   - Configure database connection settings

6. **Start Backend Server**
   - Place backend files in XAMPP's htdocs directory
   - Access via `http://localhost/outdoory/backend/public`

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access Application**
   - Open `http://localhost:3000` in your browser

### 📁 Project Structure

```
outdoory/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── arc/           # API services
│   │   ├── atoms/         # Recoil state atoms
│   │   └── assets/        # Static assets
│   └── public/
└── backend/
    ├── auth/              # Authentication logic
    ├── models/            # Database models
    ├── routes/            # API routes
    ├── db/                # Database setup
    ├── utils/             # Utility functions
    └── uploads/           # Uploaded images
```

### 🔌 API Endpoints

#### Events
- `POST /events/create` - Create new event
- `GET /events` - Get all events
- `GET /events/{id}` - Get specific event

#### Experiences
- `POST /experiences/create` - Share new experience
- `GET /experiences` - Get all experiences

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### 📝 Usage Example

**Creating an Event:**
```javascript
// Frontend API call
const createEvent = async (eventData) => {
  const formData = new FormData();
  formData.append('title', eventData.title);
  formData.append('location', eventData.location);
  formData.append('event_time', eventData.eventTime);
  formData.append('capacity', eventData.capacity);
  
  if (eventData.images) {
    eventData.images.forEach(image => {
      formData.append('images[]', image);
    });
  }
  
  const response = await fetch('/api/events/create', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License.

---

## Japanese

### 📖 概要

Outdooryは、アウトドア活動を楽しむ人々のためのWebアプリケーションです。同じ興味を持つ仲間を見つけたり、他の人が企画した活動に参加したりできるプラットフォームです。経験がなくても新しいことに挑戦し、刺激的な冒険を通してより豊かなライフスタイルを築きましょう。

### ✨ 機能

- **イベント管理**: アウトドアイベントの作成と参加
- **体験共有**: コミュニティとアウトドア体験を共有
- **ユーザー認証**: 安全なログインと登録システム
- **画像アップロード**: 冒険の写真をアップロードして共有
- **仲間探し**: 同じ志を持つアウトドア愛好家とのつながり

### 🛠️ 技術スタック

**フロントエンド:**
- React.js
- CSS3
- Recoil（状態管理）

**バックエンド:**
- PHP
- MySQL
- JWT認証
- Composer（依存関係管理）

### 📋 前提条件

- Node.js（v14以上）
- PHP（v7.4以上）
- MySQL
- XAMPP（ローカル開発用）
- Composer

### 🚀 インストール・セットアップ

#### バックエンドセットアップ

1. **リポジトリをクローン**
   ```bash
   git clone <repository-url>
   cd outdoory
   ```

2. **XAMPPを起動**
   - XAMPPでApacheとMySQLサービスを開始

3. **データベースセットアップ**
   ```bash
   cd backend
   php db/create_database.php
   php db/create_tables.php
   ```

4. **PHP依存関係をインストール**
   ```bash
   composer install
   ```

5. **環境設定**
   - backendディレクトリに`.env`ファイルを作成
   - データベース接続設定を構成

6. **バックエンドサーバーを起動**
   - バックエンドファイルをXAMPPのhtdocsディレクトリに配置
   - `http://localhost/outdoory/backend/public`でアクセス

#### フロントエンドセットアップ

1. **フロントエンドディレクトリに移動**
   ```bash
   cd frontend
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **開発サーバーを起動**
   ```bash
   npm start
   ```

4. **アプリケーションにアクセス**
   - ブラウザで`http://localhost:3000`を開く

### 📁 プロジェクト構造

```
outdoory/
├── frontend/
│   ├── src/
│   │   ├── components/     # 再利用可能なUIコンポーネント
│   │   ├── pages/         # アプリケーションページ
│   │   ├── arc/           # APIサービス
│   │   ├── atoms/         # Recoil状態アトム
│   │   └── assets/        # 静的アセット
│   └── public/
└── backend/
    ├── auth/              # 認証ロジック
    ├── models/            # データベースモデル
    ├── routes/            # APIルート
    ├── db/                # データベースセットアップ
    ├── utils/             # ユーティリティ関数
    └── uploads/           # アップロード画像
```

### 🔌 APIエンドポイント

#### イベント
- `POST /events/create` - 新しいイベントを作成
- `GET /events` - すべてのイベントを取得
- `GET /events/{id}` - 特定のイベントを取得

#### 体験
- `POST /experiences/create` - 新しい体験を共有
- `GET /experiences` - すべての体験を取得

#### 認証
- `POST /auth/login` - ユーザーログイン
- `POST /auth/register` - ユーザー登録

### 📝 使用例

**イベントの作成:**
```javascript
// フロントエンドAPIコール
const createEvent = async (eventData) => {
  const formData = new FormData();
  formData.append('title', eventData.title);
  formData.append('location', eventData.location);
  formData.append('event_time', eventData.eventTime);
  formData.append('capacity', eventData.capacity);
  
  if (eventData.images) {
    eventData.images.forEach(image => {
      formData.append('images[]', image);
    });
  }
  
  const response = await fetch('/api/events/create', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

### 🤝 貢献

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

### 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。