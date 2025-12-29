# Hero's Journey (Web)

A gamified self-improvement application designed to help you track your personal growth, habits, and goals through an interactive and engaging interface. Embark on your own hero's journey, manage your tasks, and visualize your progress.

## 🌟 Features

*   **Interactive Chat**: Engage with an AI companion/avatar to guide you through your journey.
*   **Todo Management**: Keep track of your daily quests and tasks.
*   **Star Map**: Visualize your progress and growth milestones in a unique star map view.
*   **Character Assessments**:
    *   **Physical Test**: Track and assess your physical stats.
    *   **Talent Test**: Discover and hone your innate talents.
*   **Gamification**: Earn experience, level up, and unlock new avatars as you complete tasks.
*   **Onboarding**: A personalized onboarding experience to set up your profile and goals.
*   **Internationalization**: Support for multiple languages.

## 🛠️ Tech Stack

This project is built using a modern frontend stack:

*   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
*   **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Backend & Auth**: [Supabase](https://supabase.com/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **I18n**: [i18next](https://www.i18next.com/)

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or pnpm

### Installation

1.  **Clone the repository**

    ```bash
    git clone <YOUR_GIT_URL>
    cd hero-journey-web
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**

    Create a `.env` file in the root directory. You will likely need to configure your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server**

    ```bash
    npm run dev
    ```

    The application should now be running at `http://localhost:8080` (or the port shown in your terminal).

## 📦 Build

To build the application for production:

```bash
npm run build
```

## 📄 License

[MIT](LICENSE)
