
# ThoughtHub Frontend

ThoughtHub is a modern blogging platform built with **React**, **Vite** and **Tailwind CSS** that empowers users to create, share, and discover engaging blog content. With a clean, minimal design and a focus on user experience, ThoughtHub provides a seamless platform for content creators.

---

## 🚀 Features

### 🔐 Authentication
- Google OAuth integration for seamless sign-in  
- Automatic session timeout after 5 minutes of inactivity  
- Protected routes for authenticated users  

### 📝 Blog Management
- Create rich-text blogs with React Quill editor  
- Image upload with automatic compression (Compressorjs)  
- Responsive blog cards with hover animations  
- Delete blog functionality with confirmation dialog  

### 💬 Content Interaction
- Social media sharing (Facebook, Twitter, LinkedIn)  
- Copy link functionality  
- Estimated read time calculation  
- AI-powered "QuickScribe" feature for generating blog summaries
- Similar post recommendation

### 🧑‍💻 User Experience
- Responsive design that works across all device sizes  
- Modern UI with subtle animations and transitions  
- Context-aware alerts and warning dialogs  
- Shimmer loading states for improved perceived performance  

### 🙋‍♂️ User Profile & Settings
- Customizable user profile  
- Social media links management  
- Account settings management  

### 🔍 Search and Discovery
- Real-time blog search functionality  
- Pagination for browsing through content  

---

## 🧰 Tech Stack

### 🖥️ Frontend
- **React** – UI library  
- **Vite** – Build tool and dev server  
- **React Router** – Client-side routing  
- **Tailwind CSS** – Utility-first CSS framework  
- **React Icons** – Icon library  
- **Axios** – HTTP client  

### 🔐 Authentication
- `@react-oauth/google` – Google authentication  
- `jwt-decode` – JWT token handling  

### ✍️ Rich Content
- **React Quill** – Rich text editor  
- **Compressorjs** – Image compression  

### ⚙️ State Management
- React Hooks and Custom Hooks – Application state management  
- Alert Context – Notification system  
- Warning Context – Confirmation dialogs  
- Timeout Context – Session management  

### 🌐 Backend Integration
- RESTful API architecture  
- External summarization API (AWS Lambda) and post recommendation 

---

## 📁 Project Structure

```
thoughtHub_Frontend/
├── public/                # Static files
├── src/
│   ├── assets/            # Images and static resources
│   ├── components/        # React components
│   │   ├── Blog/          # Blog creation and display components
│   │   ├── Footer/        # Footer component
│   │   ├── GoogleLogin/   # Authentication components
│   │   ├── Home/          # Home page components
│   │   ├── Login/         # Login page components
│   │   └── Settings/      # User settings components
│   ├── contexts/          # React context providers
│   │   ├── alertContext.jsx       # Alert notifications system
│   │   ├── timeOutContext.jsx     # Session management
│   │   ├── useLogout.jsx          # Logout functionality
│   │   └── warningContext.jsx     # Confirmation dialogs
│   ├── utils/             # Utility functions and constants
│   ├── App.css            # Global styles
│   ├── App.jsx            # Main application component
│   ├── index.css          # CSS entry point
│   └── main.jsx           # JavaScript entry point
├── .env                   # Environment variables
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML template
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

---

## ⚙️ Getting Started

### 🧾 Prerequisites

- Node.js (v18.0.0 or higher)  
- npm   

### 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/thoughtHub_Frontend.git
cd thoughtHub_Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_CREATE_USER_API=http://localhost:8080/api/v1/create_user
VITE_GOOGLE_CLIENT_ID=your-google-client-id
# Add other environment variables as needed
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts

| Command           | Description                          |
|------------------|--------------------------------------|
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build for production                 |
| `npm run lint`    | Run ESLint                           |
| `npm run preview` | Preview the production build locally |

---

## 🔮 Future Improvements

- Refine Likes and Comments section through websockets and enable public access
- Enhanced authentication with JWT
- Implement categorization for blogs
- Let users edit their blogs
- Improved search with filtering options
- Caching layer for frequently accessed data  
- Analytics for tracking traffic
- Bookmarking system to let users save articles for later reading
- Text-to-speech translation on blogs

---

## 🙏 Acknowledgments

- [React](https://reactjs.org)  
- [Tailwind CSS](https://tailwindcss.com)  
- [Vite](https://vitejs.dev)  
- All other amazing open-source libraries used in this project

---

© 2025 ThoughtHub Backend
