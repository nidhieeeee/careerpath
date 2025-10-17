# 🎓 CareerPath - Educational Platform

<div align="center">
  <img src="public/logoCP.png" alt="CareerPath Logo" width="120" height="120">
  
  [![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Contact](#contact)

---

## 🎯 About the Project

**CareerPath** is a comprehensive educational platform designed to connect students with institutes and provide career guidance through courses, articles, and merit lists. The platform supports multiple user roles with dedicated dashboards for different administrative levels.

### 🌟 Key Highlights

- **Multi-Role System** - Super Admin and Sub-Admin roles
- **Institute Management** - Complete institute lifecycle management
- **Course Management** - Dynamic course creation and management
- **Content Publishing** - Article creation and publication system
- **Merit Lists** - Academic performance tracking and ranking
- **Responsive Design** - Mobile-first approach with modern UI/UX

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (RBAC)
- Session management with automatic logout

### 👥 User Management
- **Super Admin**: System-wide control and management
- **Sub-Admin**: Limited administrative privileges

### 🏫 Institute Management
- Create, edit, and delete institutes
- Institute profile management
- Contact information and statistics

### 📚 Course Management
- Dynamic course creation and editing
- Category-based course organization
- Course status management (Active/Inactive)

### 📝 Content Management
- Article creation and publishing
- Category-based article organization
- SEO-friendly article structure

### 🏆 Merit List System
- Academic performance tracking
- Ranking and scoring system
- Institute-wise merit lists

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern React with Hooks and Context API
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Heroicons & Lucide Icons** - Beautiful SVG icons
- **React Hot Toast** - Elegant notifications

### State Management
- **Zustand** - Lightweight state management
- **Context API** - Global state sharing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/carrier-path.git
   cd carrier-path
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file:
   ```env
   VITE_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=CareerPath
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```
## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
```bash
POST /auth/login          # User login
POST /auth/logout         # User logout
```

### Super Admin Endpoints
```bash
GET    /admin/dashboard     # Dashboard data
GET    /admin/institutes    # Get all institutes
POST   /admin/institutes    # Create institute
PUT    /admin/institutes/:id # Update institute
DELETE /admin/institutes/:id # Delete institute
GET    /admin/subadmins     # Get all sub-admins
POST   /admin/subadmins     # Create sub-admin
PUT    /admin/subadmins/:id # Update sub-admin
DELETE /admin/subadmins/:id # Delete sub-admin
```

### Sub-Admin Endpoints
```bash
GET    /subadmin/dashboard    # Dashboard data
GET    /subadmin/courses      # Get courses
POST   /subadmin/courses      # Create course
PUT    /subadmin/courses/:id  # Update course
DELETE /subadmin/courses/:id  # Delete course
GET    /subadmin/articles     # Get articles
POST   /subadmin/articles     # Create article
PUT    /subadmin/articles/:id # Update article
DELETE /subadmin/articles/:id # Delete article
GET    /subadmin/meritlists   # Get merit lists
POST   /subadmin/meritlists   # Create merit list
PUT    /subadmin/meritlists/:id # Update merit list
DELETE /subadmin/meritlists/:id # Delete merit list
```
---

## 📁 Project Structure

```
carrier-path/
├── public/
│   └── logoCP.png              # Application logo
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   │   ├── sub/           # Sub-admin components
│   │   │   └── AdminNavbar.jsx
│   │   └── layout/            # Layout components
│   ├── hooks/                 # Custom React hooks
│   ├── store/                 # State management
│   ├── pages/                 # Page components
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
└── tailwind.config.js        # TailwindCSS configuration
```

---

## 👥 User Roles

### 🔴 Super Admin
- **Full System Access** - Complete control over all features
- **User Management** - Create/manage all user types
- **System Configuration** - Global settings and analytics

### 🟢 Sub-Admin
- **Limited Access** - Specific to assigned institute
- **Course Management** - Add/edit courses for their institute
- **Article Management** - Create articles and content
- **Merit Lists** - Manage academic rankings

---

## 📞 Contact

### Project Links
- **Repository** - [https://github.com/yourusername/carrier-path](https://github.com/yourusername/carrier-path)
- **Live Demo** - [https://careerpath-demo.netlify.app](https://careerpath-demo.netlify.app)

### Support
For support and questions:
- **Email**: support@careerpath.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/carrier-path/issues)

---

<div align="center">
  <p>Made with ❤️ by the CareerPath Team</p>
</div>
