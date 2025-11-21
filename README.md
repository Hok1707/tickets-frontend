# Event Ticket Management System

A comprehensive event ticket management system built with React and Vite. This application allows for managing events, tickets, orders, and users with a dedicated admin dashboard.

## Features

- **Admin Dashboard**: Manage events, users, and system settings.
- **Authentication**: Secure user login and registration.
- **Event Management**: Create, update, and delete events.
- **Ticket System**: Purchase and manage tickets.
- **Cart & Orders**: Shopping cart functionality and order history.
- **Payments**: Integrated payment processing (placeholder/implementation details).
- **User Profile**: Manage user details and preferences.

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router](https://reactrouter.com/)
- **Form Handling**: [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **QR Codes**: [qrcode.react](https://github.com/zpao/qrcode.react)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd event-ticket-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Locally preview the production build.

## Project Structure

```
event-ticket-management-system/
├── src/
│   ├── components/   # Reusable UI components
│   ├── features/     # Feature-based modules (auth, events, etc.)
│   ├── hooks/        # Custom React hooks
│   ├── routes/       # Application routing configuration
│   ├── services/     # API services and integration
│   ├── store/        # Global state management (Zustand)
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Helper functions and utilities
│   ├── App.tsx       # Main application component
│   └── main.tsx      # Entry point
├── public/           # Static assets
└── ...config files
```
