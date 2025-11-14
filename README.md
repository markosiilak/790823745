# Quarterly Task Planner

A modern, full-stack Next.js application for visualizing and managing tasks across quarterly timelines. Built with TypeScript, React 19, and styled-components, featuring internationalization and responsive design.

## Overview

This application provides a comprehensive task management system where users can:
- Display tasks across quarterly timelines by weeks
- Create, edit, and delete tasks with start and end dates
- Add subtasks to tasks with specific dates and times
- Seamlessly navigate between quarters
- Switch between table view and compact view modes
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
│   │   │   ├── QuarterTable/         # Table visualization module
│   │   │   │   ├── index.tsx         # Table container component
│   │   │   │   ├── constants.ts      # Table constants (widths, formatters)
│   │   │   │   ├── styles.ts         # Loading indicator styles
│   │   │   │   ├── LoadingIndicator.tsx
│   │   │   │   ├── TableHeaderSection.tsx
│   │   │   │   ├── TableHead.tsx     # Table header (<thead>)
│   │   │   │   ├── TableBody.tsx     # Table body (<tbody>)
│   │   │   │   ├── TaskRow.tsx       # Individual task row
│   │   │   │   ├── WeekCell.tsx      # Week cell with subtasks
│   │   │   │   └── hooks/
│   │   │   │       ├── useViewMode.ts       # View mode state (table/compact)
│   │   │   │       └── useTableData.ts      # Data processing/transformations
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
│   │   ├── icons/                    # SVG icon components
│   │   │   ├── ChevronLeftIcon.tsx
│   │   │   ├── ChevronRightIcon.tsx
│   │   │   ├── ChevronDownIcon.tsx
│   │   │   ├── EditIcon.tsx
│   │   │   └── RemoveIcon.tsx
│   │   │
│   │   └── shared/                   # Shared UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── FormElements.tsx
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── quarter.ts                # Quarter date calculations
│   │   ├── task-utils.ts             # Task/subtask normalization & validation
│   │   ├── translations.ts           # i18n implementation
│   │   └── styled-components.tsx     # styled-components configuration
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
- **Feature-based organization**: Components are grouped according to their functions (QuarterPlanner, QuarterTable)
- **Clear responsibility**: Each component or hook has a specific, focused purpose
- **Separate style management**: All styled-components are placed in separate `styles.ts` files to improve maintainability
- **Reusable components**: Shared components (Dropdown, DatePicker, Button) for consistency

#### 2. Custom Hooks for State Management
- **`useTasks`**: Handles task loading, creation, updating, and deletion
- **`useSubtasks`**: Manages subtask creation and editing with dialog state
- **`useTaskForm`**: Responsible for form logic, validation, and submission for both create and edit modes
- **`useQuarterNavigation`**: Manages quarter navigation and URL routing
- **`useViewMode`**: Manages table view mode (table/compact) and week selection
- **`useTableData`**: Processes and transforms task data for table rendering

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

## How It Works

### Application Flow

1. **Page**: `app/page.tsx` redirects to the current quarter (`/calendar/{year}/{quarter}`)
2. **Quarter Page**: `app/calendar/[year]/[quarter]/page.tsx` renders `QuarterPlanner` component
3. **Main Component**: `QuarterPlanner` contains:
   - Task loading using `useTasks` hook
   - Quarter navigation using `useQuarterNavigation` hook
   - Subtask management using `useSubtasks` hook
   - Renders `HeaderSection` and `QuarterTable`
4. **Task Table**: `QuarterTable` displays tasks with weekly dates:
   - Processes tasks using `useTableData` hook
   - Dynamically renders tasks, weeks, and dates
   - Supports table/compact view modes using `useViewMode` hook

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
- **Optimistic Updates**: When editing or adding subtasks, the table updates immediately for a smoother and more pleasant user experience – saving happens in the background (inline editing)

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

