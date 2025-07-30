# NekoPress Source Code Organization

This document outlines the organized file structure for the NekoPress application.

## Directory Structure

```
src/
├── app/                    # Next.js app router pages and API routes
├── components/             # React components organized by functionality
│   ├── auth/              # Authentication-related components
│   │   ├── auth-context.tsx
│   │   ├── authform.tsx
│   │   ├── forgot-password.tsx
│   │   └── index.ts
│   ├── layout/            # Layout and navigation components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── client-layout.tsx
│   │   ├── theme-provider.tsx
│   │   └── index.ts
│   ├── forms/             # Form components
│   │   ├── edit-profile.tsx
│   │   └── index.ts
│   ├── features/          # Feature-specific components
│   │   ├── current-user-avatar.tsx
│   │   ├── fuzzy-text.tsx # 404 fuzzy text component from reactbits.dev
│   │   ├── testimonials.tsx
│   │   └── index.ts
│   ├── sections/          # Page section components
│   │   ├── conversion-info.tsx
│   │   ├── file-upload-section.tsx
│   │   ├── supported-section.tsx
│   │   └── index.ts
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── index.ts           # Main components export file
├── hooks/                 # Custom React hooks
│   ├── use-current-user-image.ts
│   ├── use-current-user-name.ts
│   ├── use-mobile.ts
│   └── index.ts
├── lib/                   # Utility libraries and configurations
│   ├── auth/              # Authentication utilities
│   ├── database/          # Database utilities
│   │   ├── supabase/      # Supabase client configurations
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── index.ts
│   ├── user.ts            # User-related utilities
│   ├── utils.ts           # General utilities
│   ├── middleware.ts      # Next.js middleware
│   └── index.ts           # Main lib export file
└── middleware.ts          # Root middleware (moved to lib/)
```

## Key Improvements

### 1. **Organized Components**
- **Auth components**: All authentication-related components are grouped together
- **Layout components**: Navigation, footer, and layout components are centralized
- **Form components**: Form-specific components are separated
- **Feature components**: Feature-specific components are organized
- **UI components**: Reusable shadcn/ui components remain separate

### 2. **Centralized Utilities**
- **Database utilities**: All Supabase-related code is in `lib/database/`
- **Auth utilities**: Authentication utilities are in `lib/auth/`
- **General utilities**: Common utilities are in `lib/utils.ts`

### 3. **Better Imports**
- **Index files**: Each directory has an `index.ts` file for clean imports
- **Centralized exports**: Main `index.ts` files provide clean import paths
- **Consistent naming**: All exports follow consistent patterns

### 4. **Improved Maintainability**
- **Separation of concerns**: Each directory has a specific purpose
- **Easier navigation**: Related files are grouped together
- **Scalable structure**: Easy to add new components in appropriate directories

## Import Examples

### Before (messy imports):
```typescript
import { createClient } from "@/utils/supabase/client";
import { AuthProvider } from "@/components/auth-context";
import { Navbar } from "@/components/navbar";
```

### After (clean imports):
```typescript
import { createBrowserClient } from "@/lib/database";
import { AuthProvider } from "@/components/auth";
import { Navbar } from "@/components/layout";
```

## Migration Notes

- All Supabase client imports now use `@/lib/database`
- Component imports use the new organized structure
- Middleware has been moved to `lib/middleware.ts`
- Index files provide clean, centralized exports

This organization makes the codebase more maintainable, scalable, and easier to navigate for developers. 