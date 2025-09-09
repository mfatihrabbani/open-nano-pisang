# Open Nano Pisang - Project Structure

This document outlines the structure of the Open Nano Pisang project, an image editing demo with Gemini proxy.

## Project Overview

Open Nano Pisang is a web application that allows users to edit images using AI-powered tools. It provides a clean, intuitive interface for uploading images, entering prompts, and generating edited images.

## Directory Structure

```
open-nano-pisang/
├── client/                 # Frontend React application
│   ├── components/         # Reusable React components
│   │   ├── api/           # API-related components
│   │   │   └── ApiKeyInput.tsx
│   │   ├── image/         # Image-related components
│   │   │   └── ImageUpload.tsx
│   │   ├── layout/        # Layout components
│   │   │   └── Sidebar.tsx
│   │   ├── prompt/        # Prompt-related components
│   │   │   └── PromptInput.tsx
│   │   ├── result/        # Result display components
│   │   │   └── ResultDisplay.tsx
│   │   ├── showcase/      # Showcase components
│   │   │   └── Showcase.tsx
│   │   └── ui/            # UI components from shadcn/ui
│   ├── data/              # Static data files
│   │   └── showcase.json
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Main page component
│   │   └── NotFound.tsx   # 404 page component
│   ├── services/          # API services
│   │   └── api.ts         # API service for backend communication
│   ├── App.tsx            # Main App component
│   ├── global.css         # Global styles
│   └── vite-env.d.ts      # Vite environment types
├── public/                # Static assets
│   ├── ingredients/       # Sample ingredient images
│   └── showcase/          # Sample showcase images
├── server/                # Backend Express server
│   ├── index.ts           # Main server file
│   └── routes/            # API routes
│       └── api.ts         # API route handlers
├── shared/                # Shared code between client and server
│   └── api.ts             # Shared API types and interfaces
├── .dockerignore          # Docker ignore file
├── .gitignore             # Git ignore file
├── .prettierrc            # Prettier configuration
├── components.json        # shadcn/ui components configuration
├── DOCUMENTATION.md       # Project documentation
├── index.html             # HTML entry point
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Lock file for dependencies
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project README
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.server.ts  # Vite configuration for server build
└── vite.config.ts         # Vite configuration for client build
```

## Component Architecture

### Frontend Components

#### Layout Components
- **Sidebar**: Navigation sidebar for switching between image and text-to-image modes.

#### UI Components
- **ApiKeyInput**: Component for entering and managing API keys.
- **ModelInput**: Component for selecting AI models.

#### Feature Components
- **ImageUpload**: Component for uploading and managing images.
- **PromptInput**: Component for entering prompts with preset options.
- **ResultDisplay**: Component for displaying generated images.
- **Showcase**: Component for displaying example images and prompts.

#### Page Components
- **Index**: Main page component that orchestrates all other components.
- **NotFound**: 404 page component.

### Backend Structure

#### Server
- **index.ts**: Main server file that sets up Express middleware and routes.
- **routes/api.ts**: API route handlers for image editing and health checks.

#### Shared Code
- **shared/api.ts**: TypeScript interfaces and types shared between client and server.

### Services
- **client/services/api.ts**: Service layer for API communication with the backend.

## Data Flow

1. **User Interaction**: Users interact with the UI components (e.g., upload images, enter prompts).
2. **State Management**: The main page component (Index) manages the application state.
3. **API Communication**: When a user generates an image, the API service sends a request to the backend.
4. **Backend Processing**: The backend processes the request using the Google Generative AI API.
5. **Result Display**: The backend returns the processed images, which are displayed in the ResultDisplay component.

## Key Features

- **Image Upload**: Users can upload 1-5 images with size and dimension restrictions.
- **Prompt Input**: Users can enter text prompts to guide image generation.
- **Mode Switching**: Users can switch between image editing and text-to-image generation.
- **Showcase**: Pre-defined examples that users can use as templates.
- **API Key Management**: Secure storage of API keys in the browser's local storage.

## Development Workflow

### Frontend Development
1. Components are organized by feature in the `client/components` directory.
2. UI components from shadcn/ui are placed in the `client/components/ui` directory.
3. The main page component (`client/pages/Index.tsx`) orchestrates all other components.

### Backend Development
1. API routes are defined in `server/routes/api.ts`.
2. The main server file (`server/index.ts`) sets up middleware and routes.
3. Shared types and interfaces are defined in `shared/api.ts`.

### Build Process
1. The client is built using Vite with configuration in `vite.config.ts`.
2. The server is built separately with configuration in `vite.config.server.ts`.
3. The build process outputs to the `dist` directory.

## Dependencies

### Frontend
- React for UI components
- Tailwind CSS for styling
- shadcn/ui for pre-built UI components
- React Router for navigation
- TanStack Query for data fetching
- Sonner for toast notifications

### Backend
- Express for the web server
- Google Generative AI for image generation
- Zod for request validation

### Shared
- TypeScript for type safety

## Environment Configuration

The application uses environment variables for configuration:
- `PORT`: The port on which the server runs (default: 3000)

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build both client and server
- `npm run build:client`: Build only the client
- `npm run build:server`: Build only the server
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run format.fix`: Format code with Prettier
- `npm run typecheck`: Run TypeScript type checking