# 🎨 ConsistencyGrid

**Your life in weeks as your wallpaper**

A beautiful, personalized life calendar wallpaper generator that auto-updates daily. Track your habits, set goals, and visualize your life progress with a stunning calendar wallpaper.

![ConsistencyGrid](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)

---

## ✨ Features

### 🎯 Core Features
- **Life Calendar Wallpaper** - Visualize your life in weeks with a beautiful calendar grid
- **Auto-Update** - Wallpaper automatically updates daily to show current progress
- **Habit Tracking** - Track daily habits and build consistency
- **Goal Management** - Set and track long-term goals on your wallpaper
- **Streak System** - Monitor your consistency with streak tracking
- **Analytics Dashboard** - View insights and trends about your habits
- **Reminders** - Set reminders for important dates and events
- **Multiple Themes** - Choose from various themes (Dark Minimal, Orange Glow, White Clean, AMOLED Black)
- **Customizable** - Fully customizable wallpaper with quotes, colors, and layouts

### 🎨 Design Features
- **Modern UI** - Clean, professional interface with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support** - Multiple theme options
- **Accessibility** - WCAG compliant with proper focus states and semantic HTML

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (for development) or PostgreSQL (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/consistencygrid.git
   cd consistencygrid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
consistencygrid/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── habits/         # Habits page
│   │   ├── generator/      # Wallpaper generator
│   │   └── ...
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── generator/     # Generator components
│   │   ├── habits/        # Habit components
│   │   ├── ui/            # UI components
│   │   └── ...
│   ├── lib/               # Utility libraries
│   └── utils/             # Helper functions
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets
└── ...
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **React**: 19.2
- **Database**: Prisma ORM with SQLite/PostgreSQL
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Image Generation**: Canvas API

---

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page
- `/login` - Login page
- `/signup` - Sign up page

### Protected Pages (Requires Authentication)
- `/dashboard` - Main dashboard with overview
- `/generator` - Wallpaper generator and customization
- `/habits` - Habit tracking and management
- `/goals` - Goal setting and tracking
- `/streaks` - Streak visualization
- `/analytics` - Analytics and insights
- `/reminders` - Reminder management
- `/calendar` - Calendar view
- `/settings` - User settings
- `/help` - Help and documentation

### API Routes
- `/api/auth/*` - Authentication endpoints
- `/api/habits/*` - Habit management
- `/api/goals/*` - Goal management
- `/api/streaks/*` - Streak calculations
- `/api/analytics/*` - Analytics data
- `/api/reminders/*` - Reminder management
- `/api/settings/*` - User settings
- `/api/dashboard/stats` - Dashboard statistics

---

## 🎨 Customization

### Themes
- **Dark Minimal** - Dark background with minimal design
- **Orange Glow** - Orange accent colors
- **White Clean** - Clean white background
- **AMOLED Black** - Pure black for AMOLED screens

### Wallpaper Options
- Custom resolution (1080×2400, 1920×1080, etc.)
- Toggle elements (life grid, year grid, stats, quotes)
- Custom quotes
- Goal tracking overlay
- Habit tracking overlay
- Progress indicators

---

## 🔐 Authentication

ConsistencyGrid supports multiple authentication methods:

1. **Email/Password** - Traditional email and password authentication
2. **Google OAuth** - One-click Google sign-in (optional)

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📊 Database Schema

The application uses Prisma ORM. Key models:

- **User** - User accounts and authentication
- **Habit** - Daily habits
- **HabitCompletion** - Habit completion records
- **Goal** - Long-term goals
- **Reminder** - Date reminders
- **Settings** - User preferences

See `prisma/schema.prisma` for full schema.

---

## 🧪 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

### Database Commands
```bash
# Create migration
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Icons by [Lucide](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com)

---

## 📧 Support

For support, email support@consistencygrid.com or open an issue on GitHub.

---

## 🎯 Roadmap

- [ ] iOS app for wallpaper automation
- [ ] More theme options
- [ ] Social sharing features
- [ ] Team/group challenges
- [ ] Export data as PDF
- [ ] API for third-party integrations

---

**Made with ❤️ by the ConsistencyGrid team**
