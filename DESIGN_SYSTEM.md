# Tulana Darshaka - Design System

## Notion-Inspired UI Design System

This document outlines the design tokens, components, and patterns used throughout the Tulana Darshaka platform.

---

## 🎨 Design Principles

1. **Clean & Minimal** - Generous whitespace, focused content
2. **Smooth Interactions** - Micro-animations (200-300ms), instant feedback
3. **Contextual UI** - Hover menus, inline actions appear when needed
4. **Responsive** - Mobile-first, works beautifully on all devices
5. **Accessible** - WCAG 2.1 AA compliant, keyboard navigation

---

## 🌈 Color Tokens

### Light Mode
```css
:root {
  /* Background */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f6f3;
  --bg-tertiary: #efeeeb;
  --bg-hover: rgba(0, 0, 0, 0.03);
  --bg-active: rgba(0, 0, 0, 0.05);

  /* Text */
  --text-primary: #37352f;
  --text-secondary: #787774;
  --text-tertiary: #9b9a97;
  --text-inverse: #ffffff;

  /* Border */
  --border: #e3e2df;
  --border-hover: #d3d3d0;
  --divider: rgba(55, 53, 47, 0.09);

  /* Brand Colors */
  --accent: #2383e2;
  --accent-light: #edf5fd;
  --accent-dark: #1a6cbf;

  /* Semantic Colors */
  --success: #0f7b6c;
  --success-light: #e6f4f1;
  --warning: #f9ab00;
  --warning-light: #fef7e6;
  --error: #eb5757;
  --error-light: #fdeaea;
  --info: #2383e2;
  --info-light: #edf5fd;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.16);

  /* Interactive */
  --focus-ring: 0 0 0 3px rgba(35, 131, 226, 0.15);
}
```

### Dark Mode
```css
[data-theme='dark'] {
  /* Background */
  --bg-primary: #191919;
  --bg-secondary: #252525;
  --bg-tertiary: #2f2f2f;
  --bg-hover: rgba(255, 255, 255, 0.05);
  --bg-active: rgba(255, 255, 255, 0.08);

  /* Text */
  --text-primary: #e3e2e0;
  --text-secondary: #9b9a97;
  --text-tertiary: #6f6e69;
  --text-inverse: #191919;

  /* Border */
  --border: #373737;
  --border-hover: #4a4a4a;
  --divider: rgba(255, 255, 255, 0.09);

  /* Brand Colors (adjusted for dark mode) */
  --accent: #4a9eff;
  --accent-light: #1a3a52;
  --accent-dark: #6bb0ff;

  /* Semantic Colors */
  --success: #2d9d8c;
  --success-light: #1a3f3a;
  --warning: #ffb84d;
  --warning-light: #3d2e1a;
  --error: #ff6b6b;
  --error-light: #3d1f1f;
  --info: #4a9eff;
  --info-light: #1a3a52;

  /* Shadows (more prominent in dark mode) */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 8px 32px rgba(0, 0, 0, 0.6);
}
```

---

## 📐 Spacing Scale

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}
```

---

## ✍️ Typography

### Font Families
```css
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}
```

### Font Sizes & Line Heights
```css
:root {
  /* Display */
  --text-display: 2.5rem;      /* 40px */
  --text-display-lh: 1.2;

  /* Headings */
  --text-h1: 2rem;             /* 32px */
  --text-h1-lh: 1.25;
  --text-h2: 1.5rem;           /* 24px */
  --text-h2-lh: 1.3;
  --text-h3: 1.25rem;          /* 20px */
  --text-h3-lh: 1.4;
  --text-h4: 1.125rem;         /* 18px */
  --text-h4-lh: 1.45;

  /* Body */
  --text-base: 1rem;           /* 16px */
  --text-base-lh: 1.6;
  --text-sm: 0.875rem;         /* 14px */
  --text-sm-lh: 1.5;
  --text-xs: 0.75rem;          /* 12px */
  --text-xs-lh: 1.4;

  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

### Typography Classes
```css
.text-display {
  font-size: var(--text-display);
  line-height: var(--text-display-lh);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
}

.text-h1 {
  font-size: var(--text-h1);
  line-height: var(--text-h1-lh);
  font-weight: var(--weight-semibold);
  letter-spacing: -0.01em;
}

.text-body {
  font-size: var(--text-base);
  line-height: var(--text-base-lh);
  font-weight: var(--weight-regular);
}

.text-small {
  font-size: var(--text-sm);
  line-height: var(--text-sm-lh);
  font-weight: var(--weight-regular);
}
```

---

## 🧱 Component Patterns

### Buttons

```vue
<!-- Primary Button -->
<button class="btn btn-primary">
  Buy Now
</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">
  Add to Compare
</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">
  Learn More
</button>

<!-- Icon Button -->
<button class="btn btn-icon">
  <Icon name="heart" />
</button>
```

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.btn:focus-visible {
  box-shadow: var(--focus-ring);
}

.btn-primary {
  background: var(--accent);
  color: var(--text-inverse);
}

.btn-primary:hover {
  background: var(--accent-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  border-color: var(--border-hover);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-icon {
  padding: var(--space-2);
  width: 36px;
  height: 36px;
}
```

### Cards

```vue
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here...</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--border-hover);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--divider);
}

.card-body {
  padding: var(--space-4);
}

.card-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--divider);
  background: var(--bg-secondary);
}
```

### Input Fields

```vue
<div class="input-group">
  <label class="input-label">Email</label>
  <input
    type="email"
    class="input"
    placeholder="you@example.com"
  />
  <span class="input-hint">We'll never share your email</span>
</div>
```

```css
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.input-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-primary);
}

.input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: var(--text-base);
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: all 0.2s ease;
}

.input:hover {
  border-color: var(--border-hover);
}

.input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: var(--focus-ring);
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input-hint {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}
```

### Tooltips

```vue
<div class="tooltip-container">
  <button>Hover me</button>
  <div class="tooltip">
    Helpful tooltip text
  </div>
</div>
```

```css
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + var(--space-2));
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-3);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: var(--text-xs);
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

.tooltip-container:hover .tooltip {
  opacity: 1;
}
```

---

## 🎭 Animations

### Transition Timing
```css
:root {
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  --transition-slower: 500ms;

  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

### Common Animations
```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Usage */
.animate-fade-in {
  animation: fadeIn var(--transition-base) var(--ease-out);
}

.animate-slide-up {
  animation: slideUp var(--transition-slow) var(--ease-out);
}

.animate-scale-in {
  animation: scaleIn var(--transition-base) var(--ease-out);
}
```

---

## 📱 Responsive Breakpoints

```css
:root {
  --breakpoint-sm: 640px;   /* Mobile landscape */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
  --breakpoint-2xl: 1536px; /* Extra large */
}

/* Usage in media queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## ♿ Accessibility

### Focus Styles
```css
/* All interactive elements should have visible focus */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Or use custom focus ring */
.focus-ring:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
```

### Skip Links
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: white;
  padding: var(--space-2) var(--space-4);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### ARIA Labels
```vue
<!-- Always provide aria-label for icon-only buttons -->
<button aria-label="Add to favorites">
  <Icon name="heart" />
</button>

<!-- Use aria-describedby for additional context -->
<input
  id="email"
  aria-describedby="email-hint"
  type="email"
/>
<span id="email-hint">We'll never share your email</span>
```

---

## 🎯 Best Practices

### Component Composition
- Keep components small and focused
- Use composition over inheritance
- Prefer slots for flexibility
- Extract common patterns

### Performance
- Use `v-once` for static content
- Lazy load images with `loading="lazy"`
- Code-split routes
- Use `v-memo` for expensive lists

### Consistency
- Always use design tokens (CSS variables)
- Follow naming conventions
- Maintain spacing scale
- Use semantic HTML

### Dark Mode
- Test all components in both themes
- Use CSS variables for colors
- Avoid hardcoded colors
- Consider color contrast ratios

---

## 📦 Component Library Structure

```
components/
├── ui/              # Base components
│   ├── Button.vue
│   ├── Card.vue
│   ├── Input.vue
│   ├── Modal.vue
│   ├── Tooltip.vue
│   └── ...
├── product/         # Product-specific
│   ├── ProductCard.vue
│   ├── ProductGallery.vue
│   └── ...
├── layout/          # Layout components
│   ├── TopBar.vue
│   ├── Sidebar.vue
│   └── ...
└── common/          # Shared components
    ├── Icon.vue
    ├── Loading.vue
    └── ...
```

---

This design system ensures consistency, accessibility, and a beautiful user experience across the entire Tulana Darshaka platform.
