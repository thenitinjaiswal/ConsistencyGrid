# 🎨 ConsistencyGrid - Figma Design Specification

Complete design system and specifications for recreating ConsistencyGrid in Figma.

---

## 📐 Design System

### Color Palette

#### Primary Colors
```
Orange Primary: #F97316 (rgb(249, 115, 22))
Orange Hover: #EA580C (rgb(234, 88, 12))
Orange Light: #FFEDD5 (rgb(255, 237, 213))
Orange Dark: #C2410C (rgb(194, 65, 12))
```

#### Background Colors
```
Cream Background: #FFFAF1 (rgb(255, 250, 241))
White: #FFFFFF (rgb(255, 255, 255))
Gray 50: #F9FAFB (rgb(249, 250, 251))
Gray 100: #F3F4F6 (rgb(243, 244, 246))
Gray 200: #E5E7EB (rgb(229, 231, 235))
Gray 300: #D1D5DB (rgb(209, 213, 219))
Gray 400: #9CA3AF (rgb(156, 163, 175))
Gray 500: #6B7280 (rgb(107, 114, 128))
Gray 600: #4B5563 (rgb(75, 85, 99))
Gray 700: #374151 (rgb(55, 65, 81))
Gray 800: #1F2937 (rgb(31, 41, 55))
Gray 900: #111827 (rgb(17, 24, 39))
```

#### Accent Colors
```
Green Success: #10B981 (rgb(16, 185, 129))
Green Light: #D1FAE5 (rgb(209, 250, 229))
Blue Info: #3B82F6 (rgb(59, 130, 246))
Blue Light: #DBEAFE (rgb(219, 234, 254))
Purple: #8B5CF6 (rgb(139, 92, 246))
Purple Light: #EDE9FE (rgb(237, 233, 254))
Red Error: #EF4444 (rgb(239, 68, 68))
Red Light: #FEE2E2 (rgb(254, 226, 226))
Yellow Warning: #F59E0B (rgb(245, 158, 11))
Yellow Light: #FEF3C7 (rgb(254, 243, 199))
```

#### Status Colors
```
Live/Active: #10B981 (Green)
Pending: #F59E0B (Yellow)
Error: #EF4444 (Red)
Info: #3B82F6 (Blue)
```

---

### Typography

#### Font Family
```
Primary: System Font Stack
- macOS/iOS: -apple-system, BlinkMacSystemFont
- Windows: Segoe UI
- Android: Roboto
- Fallback: sans-serif
```

#### Font Sizes & Weights

**Headings**
```
H1 (Hero): 72px / 4.5rem
  - Weight: 700 (Bold)
  - Line Height: 1.1
  - Letter Spacing: -0.02em

H1 (Page): 32px / 2rem
  - Weight: 700 (Bold)
  - Line Height: 1.2

H2: 24px / 1.5rem
  - Weight: 700 (Bold)
  - Line Height: 1.3

H3: 20px / 1.25rem
  - Weight: 600 (Semibold)
  - Line Height: 1.4

H4: 18px / 1.125rem
  - Weight: 600 (Semibold)
  - Line Height: 1.4
```

**Body Text**
```
Large: 18px / 1.125rem
  - Weight: 400 (Regular)
  - Line Height: 1.6

Base: 16px / 1rem
  - Weight: 400 (Regular)
  - Line Height: 1.5

Small: 14px / 0.875rem
  - Weight: 400 (Regular)
  - Line Height: 1.5

XSmall: 12px / 0.75rem
  - Weight: 400 (Regular)
  - Line Height: 1.4

Tiny: 11px / 0.6875rem
  - Weight: 600 (Semibold)
  - Line Height: 1.3
  - Letter Spacing: 0.05em (Uppercase labels)
```

---

### Spacing System

```
Base Unit: 4px

Spacing Scale:
- 1: 4px (0.25rem)
- 2: 8px (0.5rem)
- 3: 12px (0.75rem)
- 4: 16px (1rem)
- 5: 20px (1.25rem)
- 6: 24px (1.5rem)
- 8: 32px (2rem)
- 10: 40px (2.5rem)
- 12: 48px (3rem)
- 16: 64px (4rem)
- 20: 80px (5rem)
- 24: 96px (6rem)
```

---

### Border Radius

```
Small: 8px (0.5rem)
Medium: 12px (0.75rem)
Large: 16px (1rem)
XL: 24px (1.5rem)
2XL: 32px (2rem)
Full: 9999px (for pills/circles)
```

---

### Shadows

```
Small: 
  - 0px 1px 2px rgba(0, 0, 0, 0.05)
  
Medium:
  - 0px 1px 3px rgba(0, 0, 0, 0.1)
  - 0px 1px 2px rgba(0, 0, 0, 0.06)

Large:
  - 0px 4px 6px rgba(0, 0, 0, 0.1)
  - 0px 2px 4px rgba(0, 0, 0, 0.06)

XL:
  - 0px 10px 15px rgba(0, 0, 0, 0.1)
  - 0px 4px 6px rgba(0, 0, 0, 0.05)

2XL:
  - 0px 20px 25px rgba(0, 0, 0, 0.1)
  - 0px 10px 10px rgba(0, 0, 0, 0.04)
```

---

## 🧩 Components

### Buttons

#### Primary Button
```
Background: #F97316 (Orange Primary)
Text: #FFFFFF (White)
Padding: 16px 32px (Vertical: 16px, Horizontal: 32px)
Border Radius: 12px
Font Size: 14px
Font Weight: 600 (Semibold)
Shadow: Medium
Hover: Background #EA580C, Scale 1.05
Transition: All 200ms ease
```

#### Secondary Button
```
Background: #FFFFFF (White)
Text: #1F2937 (Gray 800)
Border: 1px solid #E5E7EB (Gray 200)
Padding: 16px 32px
Border Radius: 12px
Font Size: 14px
Font Weight: 600
Hover: Background #F9FAFB (Gray 50)
```

#### Ghost Button
```
Background: Transparent
Text: #374151 (Gray 700)
Padding: 12px 24px
Border Radius: 12px
Font Size: 14px
Font Weight: 600
Hover: Background #F3F4F6 (Gray 100)
```

---

### Cards

#### Standard Card
```
Background: #FFFFFF (White)
Border: 1px solid #F3F4F6 (Gray 100)
Border Radius: 16px (Large)
Padding: 20px
Shadow: Small
```

#### Stat Card
```
Background: #FFFFFF (White)
Border: 1px solid #F3F4F6 (Gray 100)
Border Radius: 16px
Padding: 16px
Shadow: Small
Hover: Shadow Medium, Scale 1.02
```

---

### Input Fields

#### Text Input
```
Background: #FFFFFF (White)
Border: 1px solid #E5E7EB (Gray 200)
Border Radius: 12px (Medium)
Padding: 12px 16px
Font Size: 14px
Focus: Border #F97316, Ring 2px #F97316 with 20% opacity
```

#### Textarea
```
Same as Text Input
Min Height: 100px
Resize: Vertical
```

---

### Badges

#### Status Badge
```
Padding: 4px 12px
Border Radius: 9999px (Full)
Font Size: 11px
Font Weight: 600
Letter Spacing: 0.05em
```

**Variants:**
- Success: Background #D1FAE5, Text #065F46
- Warning: Background #FEF3C7, Text #92400E
- Error: Background #FEE2E2, Text #991B1B
- Info: Background #DBEAFE, Text #1E40AF

---

## 📱 Layout Grids

### Breakpoints
```
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px - 1440px
Large Desktop: 1441px+
```

### Container Widths
```
Mobile: Full width with 16px padding
Tablet: Max-width 768px, centered
Desktop: Max-width 1280px, centered
Large Desktop: Max-width 1536px, centered
```

### Grid System
```
Desktop: 12 columns
Tablet: 8 columns
Mobile: 4 columns
Gutter: 24px
Margin: 16px (mobile), 24px (tablet+)
```

---

## 🎨 Page Layouts

### Landing Page

#### Hero Section
```
Background: Gradient from #FFFAF1 to #FFFFFF
Container: Max-width 1280px, centered
Padding: 48px 24px (Desktop), 32px 16px (Mobile)

Elements:
- Logo: Top left, 32px height
- Login Button: Top right, Secondary button style
- Headline: Centered, H1 Hero style
  - "Your life in" (Gray 900)
  - "weeks" (Orange Primary)
  - "as your wallpaper" (Gray 700)
- Subheadline: Centered, 18px, Gray 600, Max-width 672px
- CTA Buttons: Centered, Gap 16px
  - Google Button: Secondary style, 200px width
  - Sign Up Button: Primary style, 200px width
- Phone Mockup: Centered, 400px height, 225px width
```

#### Features Section
```
Background: #FFFFFF (White)
Container: Max-width 1280px
Padding: 80px 24px
Grid: 3 columns (Desktop), 1 column (Mobile)
Gap: 32px

Feature Card:
- Icon: 48px × 48px, Colored background (Orange/Blue/Green)
- Title: H3 style
- Description: 14px, Gray 600
- Padding: 24px
- Border Radius: 16px
- Shadow: Small
- Hover: Shadow Medium
```

#### CTA Section
```
Background: Gradient from #FFFFFF to #FFEDD5 (Orange Light)
Container: Max-width 1280px
Padding: 48px 24px
Border Radius: 16px
Border: 1px solid #FFEDD5

Content:
- Title: H2 style, centered
- Description: 18px, Gray 600, centered, Max-width 672px
- Button: Primary style, centered
```

#### Footer
```
Background: #FFFFFF (White)
Border Top: 1px solid #E5E7EB
Padding: 48px 24px

Grid: 4 columns (Desktop), 1 column (Mobile)
- Column 1: Logo + Description (Max-width 300px)
- Columns 2-4: Link lists

Links:
- Title: 14px, Semibold, Gray 900
- Links: 14px, Regular, Gray 600
- Hover: Orange Primary

Bottom:
- Copyright: 12px, Gray 500
- Tagline: 12px, Gray 500
```

---

### Dashboard Layout

#### Sidebar (240px width)
```
Background: #FFFAF1 (Cream)
Border Right: 1px solid #E5E7EB
Height: 100vh
Fixed Position

Logo Section:
- Height: 80px
- Padding: 20px
- Border Bottom: 1px solid #E5E7EB
- Logo: 32px × 32px, Orange background
- Text: 14px, Bold, Gray 900

Navigation:
- Padding: 16px 12px
- Gap: 4px between items

Nav Item:
- Padding: 10px 12px
- Border Radius: 12px
- Font Size: 14px
- Font Weight: 500
- Icon: 20px × 20px
- Gap: 12px (icon to text)

Active State:
- Background: #F97316 (Orange)
- Text: #FFFFFF (White)
- Shadow: Small

Inactive State:
- Background: Transparent
- Text: #374151 (Gray 700)
- Hover: Background #FFFFFF with 70% opacity

Bottom Section:
- Border Top: 1px solid #E5E7EB
- Padding: 16px 12px
- Gap: 8px

User Profile Card:
- Background: #FFFFFF
- Padding: 12px
- Border Radius: 12px
- Shadow: Small
- Avatar: 40px × 40px, Gradient Orange
- Name: 14px, Semibold, Gray 900
- Email: 12px, Gray 500
```

#### Main Content Area
```
Background: #FFFAF1 (Cream)
Padding: 24px
Min Height: 100vh
Max Width: 1536px
```

#### Top Header Card
```
Background: #FFFFFF
Border: 1px solid #F3F4F6
Border Radius: 16px
Padding: 20px
Shadow: Small

Layout: Flex, Space-between
- Left: Welcome message
- Right: Action buttons (Gap: 8px)
```

#### Stats Row
```
Grid: 4 columns (Desktop), 2 columns (Tablet), 1 column (Mobile)
Gap: 16px
Margin Top: 24px
```

#### Content Grid
```
Grid: 3 columns (Desktop), 1 column (Mobile)
Gap: 24px
Margin Top: 24px

Column 1-2: Wallpaper Card (2/3 width)
Column 3: Today Progress Card (1/3 width)
```

---

### Generator Page

#### Layout
```
Grid: 12 columns
Gap: 32px

Left Panel (7 columns):
- Form sections stacked vertically
- Gap: 24px between sections

Right Panel (5 columns):
- Preview card
- Fixed position (sticky)
```

#### Form Section
```
Background: #FFFFFF
Border: 1px solid #F3F4F6
Border Radius: 16px
Padding: 24px

Title: 14px, Bold, Gray 900
Description: 12px, Gray 500
Gap: 16px between title and content
```

#### Preview Card
```
Background: #FFFFFF
Border: 1px solid #F3F4F6
Border Radius: 16px
Padding: 24px
Shadow: Medium

Phone Mockup:
- Width: 240px
- Height: Auto (maintains aspect ratio)
- Border Radius: 30px
- Border: 2px solid #D1D5DB
- Shadow: Large
```

---

### Habits Page

#### Header
```
Margin Bottom: 24px

Title: H1 style
Description: 14px, Gray 500
Add Button: Primary style, aligned right
```

#### Habit Card
```
Background: #FFFFFF
Border: 1px solid #F3F4F6
Border Radius: 16px
Padding: 20px
Margin Bottom: 16px
Shadow: Small

Layout:
- Checkbox: 24px × 24px, Left
- Content: Flex-1, Middle
- Actions: Right

Habit Title: 16px, Semibold, Gray 900
Habit Description: 14px, Gray 500
Streak Badge: Status Badge style, Orange
```

---

## 🎭 States & Interactions

### Hover States
```
Buttons: Scale 1.05, Shadow increase
Cards: Shadow increase, Scale 1.02
Links: Color change to Orange Primary
```

### Focus States
```
Inputs: 2px solid Orange, Ring 2px with 20% opacity
Buttons: 2px solid Orange, Ring 2px with 20% opacity
```

### Loading States
```
Skeleton: 
- Background: #E5E7EB (Gray 200)
- Border Radius: 8px
- Animation: Pulse (opacity 0.5 to 1)

Spinner:
- Size: 32px × 32px
- Border: 4px solid Orange, transparent top
- Animation: Rotate 360deg
```

### Error States
```
Error Text: #EF4444 (Red)
Error Border: 1px solid #EF4444
Error Background: #FEE2E2 (Red Light)
```

---

## 📐 Icon System

### Icon Sizes
```
Small: 16px × 16px
Medium: 20px × 20px
Large: 24px × 24px
XL: 32px × 32px
```

### Icon Colors
```
Default: #6B7280 (Gray 500)
Active: #F97316 (Orange)
Hover: #374151 (Gray 700)
Disabled: #D1D5DB (Gray 300)
```

---

## 🎨 Wallpaper Themes

### Dark Minimal
```
Background: #000000 (Black)
Text: #FFFFFF (White)
Accent: #333333 (Dark Gray)
Grid: #1F1F1F (Very Dark Gray)
```

### Orange Glow
```
Background: #000000 (Black)
Text: #FFFFFF (White)
Accent: #F97316 (Orange)
Grid: #1F1F1F (Very Dark Gray)
```

### White Clean
```
Background: #FFFFFF (White)
Text: #111827 (Gray 900)
Accent: #F97316 (Orange)
Grid: #F3F4F6 (Gray 100)
```

### AMOLED Black
```
Background: #000000 (Pure Black)
Text: #FFFFFF (White)
Accent: #F97316 (Orange)
Grid: #0A0A0A (Almost Black)
```

---

## 📱 Mobile Adaptations

### Navigation
```
Desktop: Sidebar (240px fixed)
Mobile: Bottom Navigation Bar (Fixed bottom)

Bottom Nav:
- Height: 64px
- Background: #FFFFFF
- Border Top: 1px solid #E5E7EB
- Padding: 8px
- Icons: 24px × 24px
- Text: 11px, below icon
```

### Cards
```
Desktop: Multi-column grid
Mobile: Single column, full width
Padding: 16px (Mobile), 24px (Desktop)
```

### Typography
```
Mobile Headings: Reduce by 1 size level
Mobile Body: 14px base (instead of 16px)
Mobile Buttons: Full width, larger touch targets (44px min)
```

---

## 🎯 Design Principles

1. **Consistency**: Use design tokens consistently across all pages
2. **Hierarchy**: Clear visual hierarchy with typography and spacing
3. **Accessibility**: Minimum 44px touch targets, proper contrast ratios
4. **Responsiveness**: Mobile-first approach, progressive enhancement
5. **Performance**: Optimize images, use efficient animations
6. **Clarity**: Clear labels, helpful tooltips, intuitive interactions

---

## 📋 Figma Setup Checklist

### Create in Figma:
1. ✅ Design System Page
   - Color Styles
   - Text Styles
   - Effect Styles (Shadows)
   - Component Library

2. ✅ Components
   - Buttons (All variants)
   - Cards
   - Input Fields
   - Badges
   - Navigation Items
   - Icons

3. ✅ Page Templates
   - Landing Page
   - Dashboard
   - Generator
   - Habits
   - Goals
   - Analytics
   - Settings
   - Help

4. ✅ Responsive Frames
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)

5. ✅ Prototype Interactions
   - Button hover states
   - Navigation transitions
   - Modal animations
   - Form interactions

---

## 🚀 Quick Start Guide for Figma

1. **Create Color Styles**
   - Add all colors from palette as styles
   - Name them: "Orange/Primary", "Gray/900", etc.

2. **Create Text Styles**
   - Set up all heading and body text styles
   - Use consistent naming: "Heading/H1", "Body/Large"

3. **Create Components**
   - Build reusable button components
   - Create card components
   - Set up input components

4. **Build Pages**
   - Start with Landing Page
   - Then Dashboard
   - Then other pages

5. **Add Interactions**
   - Set up hover states
   - Add click interactions
   - Create navigation flows

---

**This specification provides everything needed to recreate ConsistencyGrid in Figma!** 🎨
