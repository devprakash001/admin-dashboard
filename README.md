# 19Pays Admin Dashboard

A modern, responsive admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS for managing the 19Pays payment system.

## 🚀 Features

- **Modern UI/UX**: Built with Radix UI components and Tailwind CSS
- **Dark/Light Theme**: Theme switching with next-themes
- **Responsive Design**: Mobile-first approach with responsive layouts
- **TypeScript**: Full type safety throughout the application
- **Authentication**: Admin login system with API integration
- **User Management**: User profiles and management interface
- **Dashboard Analytics**: Reports and analytics dashboard
- **Settings Panel**: Admin settings and configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: SWR for data fetching
- **Charts**: Recharts for data visualization
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18.x or later
- npm, yarn, or pnpm package manager
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd 19pays-admin
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=https://19pays-api.oneninelabs.com
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
19pays-admin/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── reports/       # Reports and analytics
│   │   ├── settings/      # Admin settings
│   │   ├── users/         # User management
│   │   └── user-profile/  # User profile pages
│   ├── api/               # API routes
│   │   ├── adminlogin/    # Admin authentication
│   │   ├── users/         # User management API
│   │   └── user-profile/  # User profile API
│   └── login/             # Login page
├── components/            # Reusable components
│   ├── 19pays/           # Custom 19pays components
│   ├── ui/               # UI component library
│   └── theme-provider.tsx # Theme management
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎨 UI Components

This project uses a comprehensive UI component library built on Radix UI primitives:

- **Layout**: Sidebar, Navbar, Cards
- **Forms**: Input, Select, Checkbox, Radio, Textarea
- **Navigation**: Tabs, Breadcrumbs, Pagination
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Data Display**: Table, Charts, Badges, Avatars
- **Overlays**: Dialog, Popover, Tooltip, Sheet

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 API Integration

The dashboard integrates with the 19Pays API:

- **Base URL**: `https://19pays-api.oneninelabs.com`
- **Authentication**: Admin login endpoint
- **User Management**: User CRUD operations
- **Profile Management**: User profile updates

## 🎯 Key Pages

### Dashboard
- Overview of system metrics
- Quick access to main features
- Recent activity feed

### User Management
- User listing and search
- User profile management
- Bulk operations

### Reports
- Analytics and insights
- Export capabilities
- Custom date ranges

### Settings
- System configuration
- User preferences
- Admin settings

## 🔒 Authentication

The application uses a secure authentication system:

1. Admin login through API integration
2. Session management
3. Protected routes
4. Role-based access control

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

Build the application:

```bash
npm run build
```

The build output will be in the `.next` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Developer**: Dev Praksh Singh
- **Company**: 19Pays

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is an admin dashboard for the 19Pays payment system. Ensure you have proper authorization before accessing sensitive features.
