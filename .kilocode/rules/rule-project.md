# Open Nano Pisang - Project Rules

This document outlines the tech stack, coding style, and architectural patterns used in the Open Nano Pisang project. Following these rules will ensure consistency when generating code for this project.

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 3.4.17 with custom theme
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: React hooks (useState, useEffect, useRef)
- **Data Fetching**: TanStack Query 5.84.2
- **Routing**: React Router DOM 6.30.1
- **Form Handling**: React Hook Form 7.62.0
- **Notifications**: Sonner 1.7.4
- **Icons**: Lucide React 0.539.0
- **Animations**: Framer Motion 12.23.12

### Backend
- **Runtime**: Node.js with Express 5.1.0
- **Language**: TypeScript
- **AI Integration**: Google Generative AI SDK 1.17.0
- **Validation**: Zod 3.25.76
- **Environment**: dotenv 17.2.2

### Development Tools
- **TypeScript**: 5.9.2 with relaxed strict settings
- **Testing**: Vitest 3.2.4
- **Code Formatting**: Prettier 3.6.2
- **Bundling**: Vite with SWC for fast compilation

## Project Structure

```
open-nano-pisang/
├── client/                 # Frontend React application
│   ├── components/         # Reusable React components
│   │   ├── api/           # API-related components
│   │   ├── image/         # Image-related components
│   │   ├── layout/        # Layout components
│   │   ├── prompt/        # Prompt-related components
│   │   ├── result/        # Result display components
│   │   ├── showcase/      # Showcase components
│   │   └── ui/            # UI components from shadcn/ui
│   ├── data/              # Static data files
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.tsx            # Main App component
│   └── global.css         # Global styles
├── public/                # Static assets
├── server/                # Backend Express server
│   ├── index.ts           # Main server file
│   └── routes/            # API routes
├── shared/                # Shared code between client and server
└── Configuration files     # Various config files
```

## Coding Style Guidelines

### TypeScript
- Use TypeScript interfaces for type definitions
- Place shared types in the `shared/` directory
- Use relaxed TypeScript settings (strict: false)
- Define interfaces for component props
- Use type assertions sparingly

### React Components
- Use functional components with hooks
- Name components using PascalCase
- Define prop interfaces for each component
- Use default exports for main components
- Use named exports for utility functions

```typescript
interface ComponentProps {
  title: string;
  isActive?: boolean;
  onAction: (value: string) => void;
}

export default function Component({ title, isActive = false, onAction }: ComponentProps) {
  // Component implementation
}
```

### File Organization
- Group components by feature in subdirectories
- Keep UI components in the `ui/` directory
- Place page components in the `pages/` directory
- Store utility functions in the `lib/` directory
- Organize API services in the `services/` directory

### Styling
- Use Tailwind CSS classes for styling
- Leverage the custom theme defined in `tailwind.config.ts`
- Use the `cn` utility function from `lib/utils.ts` for conditional classes
- Follow the design system established in `global.css`

```typescript
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  props.className
)}>
  {/* Content */}
</div>
```

### State Management
- Use React hooks for local state management
- Use `useState` for simple state
- Use `useEffect` for side effects
- Use `useRef` for DOM references and persistent values
- Create custom hooks for complex state logic

```typescript
function useLocalStorage(key: string, initial: string = "") {
  const [value, setValue] = useState<string>(() => {
    try {
      const v = localStorage.getItem(key);
      return v ?? initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}
```

### API Communication
- Use the API service pattern for backend communication
- Define request/response types in `shared/api.ts`
- Handle errors gracefully with try/catch blocks
- Use async/await for asynchronous operations

```typescript
import { EditRequestBody, EditSuccessResponse } from "@shared/api";

class ApiService {
  async editImages(
    apiKey: string,
    prompt: string,
    images: EditImage[],
    model?: string,
  ): Promise<EditSuccessResponse> {
    const requestBody: EditRequestBody = {
      apiKey,
      prompt,
      images,
      model,
    };

    try {
      const response = await fetch(`${this.baseUrl}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit images");
      }

      return await response.json();
    } catch (error) {
      console.error("Error editing images:", error);
      throw error;
    }
  }
}
```

### Imports
- Use absolute imports with path aliases:
  - `@/` for client files
  - `@shared/` for shared files
- Organize imports in this order:
  1. React and third-party libraries
  2. Shared imports
  3. Relative imports

```typescript
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditImage } from "@shared/api";
import ApiKeyInput from "@/components/api/ApiKeyInput";
```

### Error Handling
- Use toast notifications for user-facing errors
- Log errors to the console for debugging
- Provide fallback values when possible
- Use try/catch blocks for asynchronous operations

```typescript
import { toast } from "sonner";

try {
  const result = await apiService.editImages(apiKey, prompt, images);
  setResultUrls(result.images);
  toast.success("Generated image ready");
} catch (e: any) {
  toast.error(e?.message ?? "Failed to generate");
}
```

### Constants
- Define constants at the top of files
- Use SCREAMING_SNAKE_CASE for constants
- Group related constants together

```typescript
const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_DIM = 2048; // px
```

### Comments
- Use JSDoc-style comments for functions and interfaces
- Add inline comments for complex logic
- Keep comments concise and informative

```typescript
/**
 * Resizes an image to maximum dimensions while maintaining aspect ratio
 * @param file The image file to resize
 * @returns Object containing MIME type and base64 data
 */
async function resizeToMax(
  file: File,
): Promise<{ mimeType: string; data: string }> {
  // Implementation
}
```

## Architectural Patterns

### Component Architecture
- Create reusable, composable components
- Lift state up to the nearest common ancestor
- Use props for data flow down
- Use callbacks for events flowing up

### Data Flow
1. User interacts with UI components
2. State is managed in the page component (Index)
3. API service communicates with the backend
4. Backend processes requests using Google Generative AI
5. Results are displayed in the UI

### API Design
- Use RESTful API patterns
- Return consistent error responses
- Validate requests with Zod schemas
- Use HTTP status codes appropriately

## Naming Conventions

### Files and Directories
- Use PascalCase for React components
- Use camelCase for utility files
- Use kebab-case for directories

### Variables and Functions
- Use camelCase for variables and functions
- Use PascalCase for React components
- Use SCREAMING_SNAKE_CASE for constants
- Prefix boolean variables with `is`, `has`, or `should`

### Interfaces and Types
- Use PascalCase for interface names
- Prefix interfaces with `I` is not required
- Use descriptive names for type properties

## Performance Considerations

- Use React.memo for expensive components
- Implement proper dependency arrays in useEffect
- Use useMemo for expensive calculations
- Use useCallback for stable function references
- Optimize images with appropriate dimensions

## Security Considerations

- Store API keys in localStorage (for demo purposes)
- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS in production
- Implement proper CORS policies

## Accessibility

- Use semantic HTML elements
- Provide alternative text for images
- Ensure keyboard navigation is possible
- Use ARIA attributes when necessary
- Maintain good color contrast ratios