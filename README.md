# Quarterly Task Planner

A modern, full-stack Next.js application for visualizing and managing tasks across quarterly timelines. Built with TypeScript, React 19, and styled-components, featuring internationalization and responsive design.

## Overview

This application provides a comprehensive task management system where users can:
- Display tasks across quarterly timelines in an interactive timeline view
- Visualize tasks as horizontal bars positioned by their start and end dates
- View every date in the quarter with individual date columns in the timeline
- Automatically scroll to the current date when viewing a quarter
- Create, edit, and delete tasks with start and end dates
- Add subtasks to tasks with specific dates and times
- Seamlessly navigate between quarters
- Zoom and pan the timeline for better navigation (Ctrl/Cmd/Alt + mouse wheel to zoom, Shift + mouse wheel to pan)
- Click on task bars to quickly edit task information in a modal dialog
- Multilingual admin interface (English, Estonian)

## Tech Stack

- **Framework**: React with Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5.7
- **Styling**: styled-components 6.1
- **State Management**: React Hooks (useState, useEffect, useCallback, useMemo)
- **Data Persistence**: JSON file-based data storage (via API routes)
- **Internationalization**: Custom i18n implementation with JSON translation files

## Project Structure

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes (REST endpoints)
│   │   │   └── tasks/
│   │   │       ├── route.ts          # GET, POST, PUT for tasks
│   │   │       └── [taskId]/
│   │   │           └── subtasks/
│   │   │               └── route.ts  # POST, PUT for subtasks
│   │   ├── calendar/                 # Calendar routes
│   │   │   └── [year]/[quarter]/
│   │   │       ├── page.tsx          # Main quarter view
│   │   │       └── tasks/
│   │   │           ├── new/
│   │   │           │   └── page.tsx  # Task creation page
│   │   │           └── [taskId]/
│   │   │               └── edit/
│   │   │                   └── page.tsx # Task editing page
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home (redirects to current quarter)
│   │
│   ├── components/                   # React components
│   │   ├── AppShell.tsx              # Application shell/layout wrapper
│   │   ├── Tooltip.tsx               # Tooltip component
│   │   │
│   │   ├── QuarterPlanner/           # Main feature module
│   │   │   ├── index.tsx             # Main planner orchestrator
│   │   │   ├── types.ts              # TypeScript type definitions
│   │   │   │
│   │   │   ├── Timeline/             # Timeline visualization module
│   │   │   │   ├── index.tsx         # Timeline container component
│   │   │   │   ├── constants.ts      # Timeline constants (formatters)
│   │   │   │   ├── styles.ts         # Timeline styled components
│   │   │   │   ├── TimelineTimeHeader.tsx  # Time header with months/dates
│   │   │   │   ├── TimelineItems.tsx       # Task items rendered as bars
│   │   │   │   └── TimelineSidebarContent.tsx # Sidebar with task list
│   │   │   │
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   │   ├── useTasks.ts       # Task CRUD operations
│   │   │   │   ├── useSubtasks.ts    # Subtask management
│   │   │   │   ├── useTaskForm.ts    # Task form state/logic
│   │   │   │   └── useQuarterNavigation.ts # Quarter navigation
│   │   │   │
│   │   │   ├── styles/               # Styled-components
│   │   │   │   ├── quarterPlannerStyles.ts
│   │   │   │   ├── quarterTableStyles.ts
│   │   │   │   ├── taskFormStyles.ts
│   │   │   │   ├── taskPageStyles.ts
│   │   │   │   ├── headerSectionStyles.ts
│   │   │   │   └── dropdownStyles.ts
│   │   │   │
│   │   │   ├── TaskCreate.tsx        # Task creation page component
│   │   │   ├── TaskEdit.tsx          # Task editing page component
│   │   │   ├── TaskEditDialog.tsx    # Task editing modal dialog
│   │   │   ├── TaskForm.tsx          # Reusable task form component
│   │   │   ├── HeaderSection.tsx     # Quarter header with navigation
│   │   │   ├── Dropdown.tsx          # Reusable dropdown component
│   │   │   │
│   │   │   └── Subtasks/
│   │   │       ├── SubtaskDialog.tsx # Subtask creation/editing modal
│   │   │       └── styles.ts
│   │   │
│   │   ├── DatePicker/               # Date picker component
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   │
│   │   └── shared/                   # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── FormElements.tsx
│   │       ├── ProgressBar/          # Progress bar component
│   │       │   ├── ProgressBar.tsx
│   │       │   └── index.ts
│   │       └── Toast/                # Toast notification system
│   │           ├── Toast.tsx
│   │           ├── ToastContext.tsx
│   │           └── types.ts
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── quarter.ts                # Quarter date calculations
│   │   ├── task-utils.ts             # Task/subtask normalization & validation
│   │   ├── translations.ts           # i18n implementation
│   │   ├── styled-components.tsx     # styled-components configuration
│   │   └── icons/                    # SVG icon components
│   │       ├── ChevronLeftIcon.tsx
│   │       ├── ChevronRightIcon.tsx
│   │       ├── ChevronDownIcon.tsx
│   │       ├── EditIcon.tsx
│   │       ├── RemoveIcon.tsx
│   │       └── PlusIcon.tsx
│   │
│   ├── locales/                      # Translation files
│   │   ├── en.json                   # English translations
│   │   └── et.json                   # Estonian translations
│   │
│   ├── data/                         # Data files
│   │   └── tasks.json                # Persistent task storage (JSON)
│   │
│   └── styles/                       # Global styles
│       ├── theme.ts                  # Theme configuration
│       └── styled.d.ts               # styled-components type definitions
│
├── public/                           # Static assets
├── package.json
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── eslint.config.mjs                 # ESLint configuration
└── prettier.config.mjs               # Prettier configuration
```

## Architecture

### Data Flow

1. **Data Layer**: JSON file (`src/data/tasks.json`) serves as data storage
2. **API Layer**: Next.js API routes (`src/app/api/tasks/`) perform CRUD operations
3. **Business Logic**: Custom hooks (`src/components/QuarterPlanner/hooks/`) manage state and communicate with the API
4. **Presentation Layer**: React components render the user interface using styled-components

### Key Architectural Decisions

#### 1. Component Composition and Separation of Concerns
- **Feature-based organization**: Components are grouped according to their functions (QuarterPlanner, Timeline)
- **Clear responsibility**: Each component or hook has a specific, focused purpose
- **Separate style management**: All styled-components are placed in separate `styles.ts` files to improve maintainability
- **Reusable components**: Shared components (Dropdown, DatePicker, Button) for consistency
- **Timeline-based visualization**: Tasks are displayed as horizontal bars on a timeline, similar to react-calendar-timeline

#### 2. Custom Hooks for State Management
- **`useTasks`**: Handles task loading, creation, updating, and deletion
- **`useSubtasks`**: Manages subtask creation and editing with dialog state
- **`useTaskForm`**: Responsible for form logic, validation, and submission for both create and edit modes
- **`useQuarterNavigation`**: Manages quarter navigation and URL routing

#### 3. Type Safety
- Comprehensive TypeScript types are documented in `types.ts` file
- Shared utility functions in `task-utils.ts` file help ensure type-safe data normalization
- Type-safe translation system that supports automatic key completion

#### 4. Internationalization (i18n)
- Custom translation system using JSON files
- `useLocale` and `useTranslations` hooks for reactive translation updates
- Safe locale initialization that prevents SSR and client mismatch (hydration)
- LocalStorage storage for language preference

#### 5. API Design (REST)
- RESTful: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/[id]`
- Additional resources: `POST /api/tasks/[id]/subtasks`, `PUT /api/tasks/[id]/subtasks`
- Consistent error handling with NextResponse
- Data validation through functions

#### 6. Date Handling
- ISO-8601 date storage
- Centralized date management in `lib/quarter.ts` file
- ISO-8601 week calculations (Monday is the first day)
- DatePicker component for date selection

#### 7. Timeline Visualization
- **Timeline-based UI**: Tasks displayed as horizontal bars positioned by their start/end dates
- **Date-based granularity**: Timeline shows every individual date in the quarter (approximately 90 dates per quarter)
- **Auto-scroll to current date**: Automatically scrolls to and centers today's date when viewing a quarter
- **Interactive navigation**: Zoom with Ctrl/Cmd/Alt + mouse wheel, pan with Shift + mouse wheel
- **Synchronized scrolling**: Sidebar and timeline canvas scroll together vertically
- **Click-to-edit**: Click on any task bar to quickly edit task information in a modal dialog
- **Month groupings**: Dates are grouped by month with month headers
- **Loading states**: Progress bar displayed while timeline data is loading

## How It Works

### Application Flow

1. **Page**: `app/page.tsx` redirects to the current quarter (`/calendar/{year}/{quarter}`)
2. **Quarter Page**: `app/calendar/[year]/[quarter]/page.tsx` renders `QuarterPlanner` component
3. **Main Component**: `QuarterPlanner` contains:
   - Task loading using `useTasks` hook
   - Quarter navigation using `useQuarterNavigation` hook
   - Subtask management using `useSubtasks` hook
   - Renders `HeaderSection` and `Timeline`
4. **Timeline Component**: `Timeline` displays tasks as horizontal bars on a timeline:
   - Shows every date in the quarter as individual columns
   - Automatically scrolls to the current date on load
   - Calculates task positions based on start/end dates and date boundaries
   - Renders tasks as bars spanning the exact dates they cover
   - Provides interactive zoom and pan controls
   - Includes a sidebar for task management with synchronized scrolling
   - Supports clicking on task bars to edit tasks in a modal dialog
   - Displays a progress bar while loading

### Data Flow Example: Creating a Task

1. User clicks "Add task" → navigates to `/calendar/{year}/{quarter}/tasks/new`
2. `TaskCreate` component renders `TaskForm` component
3. `TaskForm` uses `useTaskForm` hook for form logic
4. On submit, `useTaskForm` makes `POST /api/tasks` request
5. API route validates data, normalizes data, writes to `tasks.json` file
6. User is redirected back to quarter view
7. `useTasks` hook reloads tasks and UI updates dynamically

### State Management Strategy

- **Server State**: Tasks stored in JSON file, loaded via API URLs
- **Client State**: Managed via React hooks (useState, useCallback, useMemo)
- **Optimistic Updates**: When editing or adding subtasks, the timeline updates immediately for a smoother and more pleasant user experience – saving happens in the background (inline editing)
- **Timeline State**: Zoom level and scroll position managed locally in the Timeline component

### Timeline Interaction

The timeline provides several ways to interact:
- **Auto-scroll**: Automatically scrolls to and centers today's date when the timeline loads
- **Zoom**: Hold Ctrl/Cmd/Alt and scroll mouse wheel to zoom in/out (0.5x to 3x)
- **Pan**: Hold Shift and scroll mouse wheel to pan horizontally
- **Edit Task**: Click on any task bar to open the edit modal dialog
- **Scroll Sync**: Scrolling the sidebar automatically scrolls the timeline canvas and vice versa
- **Date Navigation**: Each date in the quarter is visible as a separate column in the timeline

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

### Code Quality

```bash
npm run lint        # Run ESLint
npm run format      # Format with Prettier
npm run format:check # Check formatting
```

