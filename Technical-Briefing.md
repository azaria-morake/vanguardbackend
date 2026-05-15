# Technical Briefing: Vanguard Admin Backend (Firebase)

This document outlines the architectural plan for transitioning the **Vanguard** website from a static hardcoded setup to a dynamic, Firebase-powered CMS.

## 1. Audit Summary: Dynamic Content Requirements

Based on a comprehensive audit of the React codebase, the following entities require a backend for non-code updates:

### Core Content (CRUD)
- **Articles (Insights)**: Full management of legal updates, interviews, and features.
    - *Fields*: Title, Slug, Date, Image URL, Excerpt, Full Content (Markdown/HTML), Audio Embed Code, Audio Link, `isFeatured` (Header).
- **Services**: Management of the service offerings carousel.
    - *Fields*: Title, Description, Bullet Points (Array).
- **Testimonials**: Management of client feedback.
    - *Fields*: Quote, Author, Role.

### Site-Wide Configurations (Singleton)
- **Contact Details**: Global Email, Phone, Physical Location, and WhatsApp destination.
- **Hero Sections**: Dynamic Titles, Subtitles, and Background Images for Home, About, Services, Insights, and Contact pages.
- **SEO Metadata**: Management of Meta Titles and Descriptions for each view to ensure search engine optimization.
- **Social Media Links**: Facebook, Instagram, and LinkedIn URLs in the footer and mobile menu.
- **WhatsApp Modal**: Configuration of the greeting message and contact number.

### Hidden Details
- **Legal Content**: The text within `LegalModal.jsx` (Privacy Policy & Terms) should be manageable.
- **Form Submissions**: Transition from `mailto:` to a centralized lead capture system.

---

## 2. Firebase Architecture

### Database: Cloud Firestore
We will use a flat collection structure for efficiency:
- `articles`: `Collection<Article>`
- `services`: `Collection<Service>`
- `testimonials`: `Collection<Testimonial>`
- `siteSettings`: `Document` (Singleton containing contact, hero, and global configs).
- `leads`: `Collection<Inquiry>` (Captured from the contact form).

### Storage: Firebase Storage
- `images/articles/`: Asset storage for article thumbnails and headers.
- `images/hero/`: Asset storage for high-resolution page headers.
- `audio/`: Hosting for podcast clips or interview snippets.

### Authentication: Firebase Auth
- **Admin Access Only**: Simple email/password authentication restricted to authorized Vanguard administrators.

### Functions: Firebase Cloud Functions (Optional)
- `onLeadCreated`: Automatically send an email notification to `contact@vanguardlegal.co.za` whenever a new inquiry is submitted through the site.

---

## 3. Frontend Integration Strategy

### Data Fetching
- **Global Provider**: A `SettingsProvider` will be implemented at the top level to fetch `siteSettings` once on app load and provide it to the Footer, WhatsApp Modal, and Hero components.
- **View-Level Fetching**: Views like `InsightsView` and `ServicesView` will fetch their respective collections from Firestore using the `useEffect` hook.

### Real-Time Updates
- We can optionally use Firestore's `onSnapshot` for the Admin panel, ensuring that changes made by the admin are reflected instantly in their preview.

---

## 4. Admin Dashboard Overview

A dedicated, password-protected `/admin` route will be added to the project, featuring:
- **Article Editor**: A Rich Text Editor (e.g., TipTap) for drafting legal insights.
- **Image Manager**: Direct-to-Storage uploaders with automatic URL generation.
- **Configuration Panel**: A central form to update the office phone, email, and hero titles.
- **Lead Viewer**: A simple table to view and export inquiries captured via the contact form.

---

## 5. Next Steps & Milestones

1. **Firebase Initialization**: Set up the project in the Firebase Console and configure the SDK.
2. **Schema Migration**: Move the current hardcoded arrays into Firestore as the initial seed data.
3. **Frontend Refactor**: Replace static imports with dynamic Firestore queries.
4. **Admin UI Development**: Build the secure management interface.

---

**Approval Required**: Please review the data fields and architectural choices. Once approved, I will begin by initializing the Firebase environment and migrating the first set of data.
