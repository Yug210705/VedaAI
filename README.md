# VedaAI

VedaAI is an intelligent, AI-powered assessment creator and evaluation platform designed for modern educators. 

## 🏗️ Architecture Overview

The platform uses a robust, separated client-server architecture:

- **Frontend:** Built with Next.js (React), powered by TailwindCSS for responsive and highly polished styling. State management is handled through Zustand for lightweight, scalable reactivity. It implements a fully responsive, native app-like mobile experience.
- **Backend:** A Node.js API (Express/Koa structure) that acts as the primary engine for securely interacting with the Gemini AI models. 
- **AI Integration:** Google's Gemini AI handles all generative tasks—such as dynamically creating assignments, numerical problems, and short-form questions based on user prompts.

## 🚀 Approach

- **User-Centric Design:** Focus heavily on UI polish and native-like feel on mobile, with micro-animations, glassmorphism, and meticulously aligned custom UI components.
- **Robust AI Tooling:** The platform avoids generic templating by prompting the AI engine for highly contextual and dynamic outputs tailored specifically for educational assessments.
- **Clean Code & Modularity:** Frontend elements are compartmentalized into reusable, highly specific React components (e.g., custom dropdowns, responsive sidebars, custom input toggles).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend folder and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=5000
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✨ Features
- AI-Generated Assignments
- Fully Responsive (Mobile & Desktop)
- Custom Native-Feel UI Components
- Integrated AI Grading (Coming Soon)
