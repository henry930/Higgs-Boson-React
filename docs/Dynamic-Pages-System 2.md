# Dynamic Pages System

## Overview

The Dynamic Pages System allows you to create and manage custom pages with rich HTML content that can be accessed via custom URLs (e.g., `/article1`, `/welcome-blog`). This system includes:

- **WYSIWYG HTML Editor** (TinyMCE) for rich content creation
- **Custom URL routing** for pages (e.g., `/my-article`)
- **SEO meta tags** support
- **View tracking** with automatic page view counting
- **HTML sanitization** for security
- **Draft/Published** status management
- **Featured pages** support

## Architecture

### Frontend Components

1. **PagesManager** (`/src/components/PagesManager/`)
   - Main management interface for creating/editing pages
   - Lists all pages with status, views, and actions
   - Delete confirmation modal

2. **PageEditor** (`/src/components/PageEditor/`)
   - WYSIWYG editor using TinyMCE
   - Form for page metadata (title, slug, SEO, etc.)
   - Real-time slug generation from title
   - Sidebar with publication settings

3. **DynamicPage** (`/src/components/DynamicPage/`)
   - Renders dynamic pages at custom URLs
   - Handles 404 redirects for non-existent/unpublished pages
   - Automatic view counting (after 3 seconds)
   - HTML sanitization before rendering

### Backend API

#### Endpoints

- `GET /api/pages` - List all pages
- `GET /api/pages/slug/:slug` - Get page by slug
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `POST /api/pages/slug/:slug/views` - Increment page views

#### Security Features

- **HTML Sanitization**: All content is sanitized server-side using DOMPurify
- **Slug Validation**: Ensures unique slugs across pages
- **Input Validation**: Required fields validation
- **Safe HTML Tags**: Only allows specific HTML tags and attributes

### Database Schema

```prisma
model Page {
  id              Int      @id @default(autoincrement())
  title           String
  slug            String   @unique
  content         String
  metaTitle       String?
  metaDescription String?
  published       Boolean  @default(false)
  featured        Boolean  @default(false)
  authorName      String?
  coverImage      String?
  excerpt         String?
  tags            String?
  viewCount       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Redux State Management

The pages system uses Redux Toolkit with the following slice:

- **State**: `pages`, `currentPage`, `loading`, `error`, `lastFetched`
- **Actions**: `fetchPages`, `fetchPageBySlug`, `createPage`, `updatePage`, `deletePage`, `incrementPageViews`
- **Hook**: `usePages()` for easy component integration

## Usage Guide

### Creating a New Page

1. Go to **Admin Panel** → **Pages** tab
2. Click "**Create New Page**"
3. Fill in the required fields:
   - **Title**: Page title (required)
   - **Slug**: URL path (auto-generated, customizable)
   - **Content**: Rich HTML content using WYSIWYG editor
4. Optional settings:
   - **Meta Title/Description**: For SEO
   - **Author Name**: Page author
   - **Cover Image**: Featured image URL
   - **Excerpt**: Brief summary
   - **Tags**: Comma-separated tags
   - **Published**: Make page live
   - **Featured**: Mark as featured content

### URL Structure

Pages are accessible at `/{slug}`. For example:
- Slug: `welcome-blog` → URL: `/welcome-blog`
- Slug: `about-our-team` → URL: `/about-our-team`

### Content Editor Features

The TinyMCE editor supports:
- **Text Formatting**: Bold, italic, underline, etc.
- **Headings**: H1-H6 support
- **Lists**: Bulleted and numbered lists
- **Links**: Internal and external links
- **Images**: Inline images
- **Tables**: Rich table support
- **Code Blocks**: Syntax highlighting
- **Blockquotes**: Quote formatting

### SEO Features

- **Meta Title**: Custom page title for search engines
- **Meta Description**: Page description for search results
- **Clean URLs**: SEO-friendly slug-based URLs
- **Semantic HTML**: Proper heading structure

## Security

### HTML Sanitization

All HTML content is sanitized both server-side and client-side:

**Allowed HTML Tags:**
```
p, br, strong, em, u, s, h1, h2, h3, h4, h5, h6,
ul, ol, li, blockquote, a, img, table, thead, tbody,
tr, td, th, div, span, pre, code
```

**Allowed Attributes:**
```
href, target, src, alt, title, class, id, style
```

### Protection Features

- **XSS Prevention**: HTML sanitization prevents malicious scripts
- **Slug Validation**: Prevents duplicate or malicious URLs
- **Input Validation**: Server-side validation of all inputs
- **Published Status**: Unpublished pages return 404 to regular users

## File Structure

```
src/
├── components/
│   ├── DynamicPage/
│   │   ├── DynamicPage.tsx
│   │   └── DynamicPage.module.scss
│   ├── PageEditor/
│   │   ├── PageEditor.tsx
│   │   └── PageEditor.module.scss
│   └── PagesManager/
│       ├── PagesManager.tsx
│       └── PagesManager.module.scss
├── hooks/pages/
│   └── usePages.ts
├── store/features/pages/
│   └── pagesSlice.ts
└── types/
    └── index.ts (Page interface)
```

## API Response Format

All API endpoints return responses in this format:

```json
{
  "status": "success" | "error",
  "data": any,
  "message": string
}
```

## Examples

### Creating a Blog Post

```javascript
const blogPost = {
  title: "Getting Started with React",
  slug: "getting-started-react",
  content: "<h1>Getting Started with React</h1><p>React is a powerful library...</p>",
  metaTitle: "Getting Started with React - Tutorial",
  metaDescription: "Learn the basics of React development in this comprehensive guide.",
  excerpt: "A beginner's guide to React development.",
  authorName: "John Doe",
  tags: "react, javascript, tutorial",
  published: true,
  featured: false
};
```

### Accessing a Page

Pages are automatically accessible at their slug URL:
- `/getting-started-react`
- `/welcome-blog`
- `/company-news`

### View Tracking

Page views are automatically tracked:
- Incremented after 3 seconds of page view
- Displayed in the admin panel
- Used for analytics and content insights

## Integration with Existing System

The dynamic pages system integrates seamlessly with the existing:
- **Redux store** architecture
- **SCSS modules** styling system
- **Component-based** React structure
- **API service** patterns
- **TypeScript** type safety

## Future Enhancements

Potential improvements:
- **Rich media support**: File upload for images
- **Comment system**: User comments on pages
- **Page templates**: Predefined page layouts
- **Revision history**: Track page changes
- **Bulk operations**: Manage multiple pages
- **Search functionality**: Search through pages
- **Categories/Tags system**: Better content organization
