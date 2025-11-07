# Homepage Implementation Task List

## Project: Online Exam Assignment Platform - Public Homepage

### Overview
This task list covers the implementation of the public-facing homepage with the following sections:
1. Hero Section
2. Features
3. Call-to-Action (CTA)
4. How It Works
5. Demo Screenshots

---

## Phase 1: Foundation & Structure

### ☐ Task 1: Create (public) route group structure and layout
**Description**: Set up the Next.js App Router structure for public pages
- Create `app/(public)/` directory
- Create `app/(public)/layout.tsx` with public layout wrapper
- Configure routing to distinguish public pages from protected routes
- Set up proper metadata and SEO tags

**Files to create:**
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx` (homepage)

---

### ☐ Task 2: Create PublicNavbar component with navigation links
**Description**: Build the main navigation header for public pages
- Logo/Brand name (left side)
- Navigation links: Home, Features, How It Works, Contact
- Login button (right side, highlighted)
- Mobile responsive hamburger menu
- Sticky navigation on scroll
- Smooth scroll to sections

**Files to create:**
- `components/PublicNavbar.tsx`

**Features:**
- Desktop: Horizontal navigation
- Mobile: Hamburger menu with slide-out drawer
- Active link highlighting
- Smooth animations

---

### ☐ Task 3: Create Footer component with legal links and branding
**Description**: Build footer with links and information
- Platform branding and description
- Quick links section (Home, Features, About, Contact)
- Legal links (Privacy Policy, Terms of Service)
- Social media icons (placeholder for now)
- Copyright notice with current year
- Newsletter signup (optional)

**Files to create:**
- `components/Footer.tsx`

---

## Phase 2: Hero Section

### ☐ Task 4: Create Hero section with headline, subheading, and CTA buttons
**Description**: Build the main hero section that appears first on the homepage
- Eye-catching headline (e.g., "Transform How Your Institution Conducts Exams")
- Subheading explaining platform value
- Two prominent CTA buttons:
  - Primary: "Request Demo" or "Get Started"
  - Secondary: "Login"
- Background with gradient or subtle pattern
- Optional: Decorative elements or illustration

**Files to create:**
- `components/home/HeroSection.tsx`

**Content to include:**
- Platform tagline
- Brief value proposition (1-2 sentences)
- Visual appeal with proper spacing

---

### ☐ Task 5: Add hero section animations (using Framer Motion)
**Description**: Enhance hero section with smooth animations
- Fade-in headline with stagger effect
- Slide-in subheading from bottom
- Pulse/hover animations on CTA buttons
- Subtle background animations (floating elements)
- Scroll indicator at bottom

**Animation timing:**
- Headline: 0.5s delay
- Subheading: 0.7s delay
- CTA buttons: 0.9s delay
- All with smooth easing

---

## Phase 3: Features Section

### ☐ Task 6: Create Features section with feature cards
**Description**: Showcase 4 key platform features with cards

**Features to highlight:**
1. **Multi-Question Types**
   - Icon: CheckCircle or ListChecks
   - Description: Support for MCQ, Short Answer, and Coding questions

2. **AI-Powered Proctoring**
   - Icon: Eye or Shield
   - Description: Webcam monitoring, violation tracking, secure exams

3. **Multi-Institution Support**
   - Icon: Building2 or School
   - Description: Manage multiple institutions, departments, and users

4. **Real-Time Grading**
   - Icon: Zap or Clock
   - Description: Instant results for MCQs, streamlined manual grading

**Files to create:**
- `components/home/FeaturesSection.tsx`
- `components/home/FeatureCard.tsx`

**Layout:**
- 2x2 grid on desktop
- Single column on mobile
- Each card with icon, title, description

---

### ☐ Task 7: Add animations and hover effects to feature cards
**Description**: Make feature cards interactive and engaging
- Hover scale effect (scale: 1.05)
- Card tilt on hover (subtle 3D effect)
- Icon animations on hover (rotate, bounce, or glow)
- Stagger reveal on scroll (cards appear one by one)
- Smooth transitions

**Interactions:**
- Cursor hover changes card appearance
- Icons animate independently
- Cards reveal as user scrolls down

---

## Phase 4: CTA Section

### ☐ Task 8: Create primary CTA section with call-to-action buttons
**Description**: Mid-page CTA to encourage user action
- Strong headline (e.g., "Ready to Transform Your Exam Process?")
- Supporting text (1 sentence)
- Primary button: "Get Started Today" or "Request a Demo"
- Secondary button: "View Pricing" or "Contact Us"
- Background: Accent color (blue/purple gradient)
- Full-width section with centered content

**Files to create:**
- `components/home/CTASection.tsx`

**Design:**
- Contrasting background color
- White text on colored background
- Generous padding (py-20)
- Call attention without being overwhelming

---

## Phase 5: How It Works Section

### ☐ Task 9: Create How It Works section with 4-step process
**Description**: Visual explanation of platform workflow

**Steps to show:**
1. **Admin Setup**
   - Icon: UserCog or Settings
   - Title: "Admin Creates Institution"
   - Description: "Set up your institution, departments, and invite teachers"

2. **Exam Creation**
   - Icon: FileEdit or PenTool
   - Title: "Teachers Create Exams"
   - Description: "Design exams with MCQs, essays, and coding challenges"

3. **Student Takes Exam**
   - Icon: Users or GraduationCap
   - Title: "Students Take Proctored Exams"
   - Description: "Secure, monitored exam environment with violation tracking"

4. **Automated Grading**
   - Icon: CheckCircle2 or Award
   - Title: "Instant Results & Grading"
   - Description: "Auto-graded MCQs, streamlined manual grading for essays"

**Files to create:**
- `components/home/HowItWorksSection.tsx`
- `components/home/ProcessStep.tsx`

**Layout:**
- Horizontal timeline on desktop
- Vertical flow on mobile
- Connecting lines/arrows between steps
- Number badges (1, 2, 3, 4)

---

### ☐ Task 10: Add scroll animations to How It Works section
**Description**: Progressive reveal animation as user scrolls
- Steps appear one by one with stagger effect
- Connecting lines animate/draw as steps appear
- Number badges animate with scale/fade effect
- Use Framer Motion's `whileInView` prop
- Trigger animation when section is 50% visible

**Animation sequence:**
- Step 1 → Line → Step 2 → Line → Step 3 → Line → Step 4
- Each with 200ms delay between
- Smooth fade + slide from bottom

---

## Phase 6: Demo Screenshots Section

### ☐ Task 11: Create Demo Screenshots section with platform preview images
**Description**: Showcase platform UI with screenshots

**Screenshots to include:**
1. Admin Dashboard (institution/department management)
2. Teacher Exam Creation (question builder interface)
3. Student Exam Interface (taking exam view)
4. Results/Grading Page (teacher grading view)

**Files to create:**
- `components/home/ScreenshotsSection.tsx`
- `components/home/ScreenshotCard.tsx`

**Layout:**
- Grid layout: 2 columns on desktop, 1 on mobile
- Each screenshot with caption/description
- Placeholder images initially (can be replaced with real screenshots later)
- Border, shadow, and rounded corners for polish

**Placeholder approach:**
- Use colored rectangles with text labels for now
- Or use https://placehold.co/ for placeholder images
- Dimensions: 1200x800px (3:2 aspect ratio)

---

### ☐ Task 12: Add image lightbox/modal functionality for screenshots
**Description**: Allow users to view full-size screenshots
- Click on screenshot to open lightbox/modal
- Full-screen view with dark overlay
- Navigation: Next/Previous arrows
- Close button (X) in top-right corner
- Click outside image to close
- Keyboard support: Arrow keys for navigation, ESC to close
- Smooth open/close animations

**Implementation options:**
- Use shadcn/ui Dialog component
- Or implement custom lightbox with Framer Motion
- Support touch gestures on mobile (swipe to navigate)

---

## Phase 7: Polish & Testing

### ☐ Task 13: Implement responsive design for mobile and tablet views
**Description**: Ensure homepage looks great on all screen sizes
- Mobile (320px - 768px):
  - Single column layout
  - Hamburger menu
  - Stacked CTA buttons
  - Reduced spacing

- Tablet (768px - 1024px):
  - 2-column feature cards
  - Adjusted spacing

- Desktop (1024px+):
  - Full grid layouts
  - Max width container (1280px)
  - Optimal spacing

**Testing breakpoints:**
- 320px (iPhone SE)
- 375px (iPhone 12/13)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)

---

### ☐ Task 14: Test homepage on different screen sizes and browsers
**Description**: Cross-browser and device testing
- **Browsers to test:**
  - Chrome
  - Firefox
  - Safari
  - Edge

- **Testing checklist:**
  - All animations work smoothly
  - Navigation links work correctly
  - CTA buttons are clickable and visible
  - Images load properly
  - Text is readable on all backgrounds
  - No layout shifts or overflow issues
  - Performance: Page loads in < 3 seconds

- **Accessibility:**
  - Keyboard navigation works
  - Proper heading hierarchy (h1, h2, h3)
  - Alt text for images
  - Sufficient color contrast
  - Focus indicators visible

**Tools to use:**
- Chrome DevTools responsive mode
- Lighthouse audit for performance
- WAVE browser extension for accessibility

---

## Post-Homepage Tasks (Future)

### Additional Pages to Create:
- [ ] Features page (detailed breakdown)
- [ ] About Us page
- [ ] Contact page with form
- [ ] FAQ page
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Pricing page (if applicable)

---

## Content Needed Before Implementation

### Branding Assets:
- [ ] Platform name decision
- [ ] Logo (SVG format preferred)
- [ ] Color scheme confirmation (currently using slate theme)
- [ ] Brand fonts (if different from default)

### Content Copy:
- [ ] Hero headline (attention-grabbing)
- [ ] Hero subheading (value proposition)
- [ ] Feature descriptions (4 features, 50-100 words each)
- [ ] How It Works step descriptions (50 words each)
- [ ] CTA section copy
- [ ] Footer description/tagline

### Visual Assets:
- [ ] Platform screenshots (or use placeholders initially)
- [ ] Optional: Hero section illustration/animation
- [ ] Optional: Icons (or use Lucide React icons)
- [ ] Favicon

---

## Technical Decisions Made

### Tech Stack for Homepage:
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (Motion library)
- **Icons**: Lucide React
- **UI Components**: shadcn/ui
- **Font**: Default Next.js font (Inter)

### File Structure:
```
app/
├── (public)/
│   ├── layout.tsx          # Public layout with navbar + footer
│   ├── page.tsx            # Homepage
│   ├── about/              # Future
│   ├── contact/            # Future
│   └── legal/              # Future (privacy, terms)

components/
├── PublicNavbar.tsx
├── Footer.tsx
└── home/
    ├── HeroSection.tsx
    ├── FeaturesSection.tsx
    ├── FeatureCard.tsx
    ├── CTASection.tsx
    ├── HowItWorksSection.tsx
    ├── ProcessStep.tsx
    ├── ScreenshotsSection.tsx
    └── ScreenshotCard.tsx
```

### Performance Targets:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90

---

## Notes & Considerations

### SEO Optimization:
- Add proper meta tags in layout.tsx
- Open Graph tags for social sharing
- Structured data (JSON-LD) for organization
- Sitemap.xml generation

### Accessibility (WCAG 2.1 AA):
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast ratios > 4.5:1

### Future Enhancements:
- Multi-language support (i18n)
- Blog section for content marketing
- Video demo instead of/in addition to screenshots
- Interactive product tour
- Customer testimonials section
- Integration showcase (if applicable)
- Live chat widget

---

## Approval Checklist

Before starting implementation, confirm:
- [ ] Task list reviewed and approved
- [ ] Content strategy aligned
- [ ] Design direction understood
- [ ] Placeholder content acceptable for initial implementation
- [ ] Timeline expectations set

---

**Status**: ⏳ Awaiting Approval

**Next Step**: Once approved, begin with Phase 1 (Tasks 1-3) to set up the foundation.
