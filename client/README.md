# UIMP Client - Next.js Frontend

This is the frontend application for the Unified Internship & Mentorship Portal (UIMP).

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js config

## Getting Started

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout component
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
└── components/         # Reusable components (to be added)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features (Planned)

- Authentication (Login/Signup)
- Student Dashboard
- Mentor Dashboard
- Application Management
- Feedback System
- File Upload
- Notifications

## Development Notes

- Uses Next.js App Router for modern React patterns
- Configured with TypeScript for type safety
- Tailwind CSS for utility-first styling
- ESLint for code quality