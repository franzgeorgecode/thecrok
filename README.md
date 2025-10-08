# Crok - Notion-like Document Editor

A minimalist, black and white document editor inspired by Notion, built with React, TypeScript, and Supabase.

## Features

- 🔐 User authentication
- 📝 Block-based editor (10+ block types)
- 🎨 Custom icons and cover images
- ⭐ Favorites system
- 🏷️ Tags/labels
- 🔍 Search functionality
- 🔒 Public/Private documents
- 📱 Responsive design
- 🎯 Minimalist black & white UI

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `src/lib/database.sql`
3. Get your project URL and anon key from Settings > API
4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## Deployment to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Add environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The `netlify.toml` file is already configured for proper routing.

## Database Schema

- **users**: User accounts
- **documents**: Document metadata
- **blocks**: Document content blocks
- **tags**: Document tags

All tables have Row Level Security (RLS) enabled for data protection.

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Vite
- Lucide React Icons

## License

MIT
