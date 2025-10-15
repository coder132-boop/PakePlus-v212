# ChoreCore - The Core of Clean

> A modern household task management app for shared living spaces

## 🌟 Features

- **Smart Task Management**: Set recurring tasks and track daily chores
- **Approval Workflow**: Admin assigns tasks, members complete them, admins approve
- **Points System**: Earn points for completing chores (motivating progress tracking)
- **9 Beautiful Themes**: Customize your experience with gorgeous liquid glass designs
- **Mobile & Desktop**: Use anywhere with responsive design
- **Secure Authentication**: Sign up with email/password (optional Google OAuth)

## 🏗️ Architecture

ChoreCore uses a modern tech stack:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom liquid glass theme
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Radix UI + shadcn/ui

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project credentials
   - Update `/utils/supabase/info.tsx` with your credentials

3. **Initialize the database**:
   - Visit your app at `http://localhost:5173/?admin-setup`
   - Copy the SQL script from the setup page
   - Run it in your Supabase SQL Editor
   - Click "Verify Setup" to confirm

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to `http://localhost:5173`
   - Create your first admin account
   - Start managing chores!

### Mobile Testing

To test on your phone:

```bash
npm run dev:mobile
```

Then visit the URL shown in your terminal from your phone's browser.

## 🚀 Deployment

ChoreCore can be deployed to any static hosting platform:

### Vercel (Recommended)
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

### Manual Build
```bash
npm run build
# Deploy the /dist folder to your hosting platform
```

## 🔐 Authentication

ChoreCore supports two authentication methods:

1. **Email/Password** (enabled by default)
2. **Google OAuth** (optional - requires Google Cloud Console setup)

See [Authentication Guide](./AUTHENTICATION.md) for detailed setup instructions.

## 📱 Desktop App

To wrap ChoreCore as a desktop application, see [Desktop App Guide](./DESKTOP_APP.md).

## 🎨 Theming

ChoreCore includes 9 beautiful themes with a distinctive "Liquid Glass" aesthetic:

- Ocean (default)
- Sunset
- Forest
- Lavender
- Coral
- Midnight
- Mint
- Rose
- Monochrome

Users can switch themes in Settings.

## 🗂️ Project Structure

```
chorecore/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── figma/          # Figma integration utilities
├── contexts/           # React context providers
├── styles/             # Global CSS and Tailwind config
├── utils/              # Utility functions and Supabase client
├── supabase/           # Supabase Edge Functions
└── docs/               # Documentation
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:mobile` - Start dev server with network access
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project follows these best practices:

- TypeScript for type safety
- ESLint for code quality
- Consistent file structure
- Comprehensive error handling
- Mobile-first responsive design

## 📄 License

ChoreCore is proprietary software. All rights reserved.

## 🤝 Support

For issues or questions, please contact support through the application settings.

## 🎯 Terminology

ChoreCore uses inclusive terminology:

- **House**: A shared living space (family, roommates, etc.)
- **Admin**: User who can assign chores and approve completions
- **Member**: User who completes chores

This makes ChoreCore suitable for all shared living situations, not just families.

---

**Made with ❤️ for cleaner homes**
