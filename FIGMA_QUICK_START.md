# 🚀 Figma Quick Start Guide - ConsistencyGrid

Step-by-step guide to recreate ConsistencyGrid in Figma.

---

## 📋 Step 1: Set Up Your Figma File

### Create New File
1. Open Figma
2. Create new file: "ConsistencyGrid Design System"
3. Create pages:
   - 🎨 Design System
   - 🏠 Landing Page
   - 📊 Dashboard
   - 🎨 Generator
   - ✅ Habits
   - 🎯 Goals
   - 📈 Analytics
   - ⚙️ Settings

---

## 🎨 Step 2: Create Design System

### 2.1 Color Styles

Create color styles in Figma:

**Primary Colors**
- `Orange/Primary`: #F97316
- `Orange/Hover`: #EA580C
- `Orange/Light`: #FFEDD5
- `Orange/Dark`: #C2410C

**Grays**
- `Gray/50`: #F9FAFB
- `Gray/100`: #F3F4F6
- `Gray/200`: #E5E7EB
- `Gray/300`: #D1D5DB
- `Gray/400`: #9CA3AF
- `Gray/500`: #6B7280
- `Gray/600`: #4B5563
- `Gray/700`: #374151
- `Gray/800`: #1F2937
- `Gray/900`: #111827

**Backgrounds**
- `Background/Cream`: #FFFAF1
- `Background/White`: #FFFFFF

**Status Colors**
- `Success`: #10B981
- `Success/Light`: #D1FAE5
- `Error`: #EF4444
- `Error/Light`: #FEE2E2
- `Info`: #3B82F6
- `Info/Light`: #DBEAFE
- `Warning`: #F59E0B
- `Warning/Light`: #FEF3C7

### 2.2 Text Styles

Create text styles:

**Headings**
- `Heading/H1-Hero`: 72px, Bold, Gray/900, Line-height 1.1
- `Heading/H1`: 32px, Bold, Gray/900, Line-height 1.2
- `Heading/H2`: 24px, Bold, Gray/900, Line-height 1.3
- `Heading/H3`: 20px, Semibold, Gray/900, Line-height 1.4
- `Heading/H4`: 18px, Semibold, Gray/900, Line-height 1.4

**Body**
- `Body/Large`: 18px, Regular, Gray/600, Line-height 1.6
- `Body/Base`: 16px, Regular, Gray/900, Line-height 1.5
- `Body/Small`: 14px, Regular, Gray/600, Line-height 1.5
- `Body/XSmall`: 12px, Regular, Gray/500, Line-height 1.4
- `Body/Tiny`: 11px, Semibold, Gray/500, Uppercase, Letter-spacing 0.05em

### 2.3 Effect Styles (Shadows)

Create effect styles:

- `Shadow/Small`: 0px 1px 2px rgba(0, 0, 0, 0.05)
- `Shadow/Medium`: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)
- `Shadow/Large`: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)
- `Shadow/XL`: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)

---

## 🧩 Step 3: Create Components

### 3.1 Button Component

1. Create frame: 120px × 44px
2. Add rectangle: Fill Orange/Primary, Corner radius 12px
3. Add text: "Button", style Body/Small, color White, center aligned
4. Create variants:
   - Primary (Orange background)
   - Secondary (White background, border)
   - Ghost (Transparent background)
5. Add hover states
6. Make it a component

### 3.2 Card Component

1. Create frame: Auto layout, Padding 20px
2. Add rectangle: Fill White, Corner radius 16px, Border Gray/100, Shadow Small
3. Make it a component

### 3.3 Input Component

1. Create frame: Auto width × 44px
2. Add rectangle: Fill White, Border Gray/200, Corner radius 12px, Padding 12px 16px
3. Add text: "Placeholder", style Body/Small, color Gray/400
4. Create variants:
   - Default
   - Focus (Border Orange/Primary, Ring)
   - Error (Border Error, Background Error/Light)
5. Make it a component

### 3.4 Badge Component

1. Create frame: Auto width × 24px
2. Add rectangle: Fill Success/Light, Corner radius 9999px, Padding 4px 12px
3. Add text: "Badge", style Body/Tiny, color Success dark
4. Create variants for all status colors
5. Make it a component

---

## 🏠 Step 4: Build Landing Page

### 4.1 Create Frame

1. Frame: 1440px × 2000px (Desktop)
2. Background: Gradient from Cream to White

### 4.2 Header Section

1. Create frame: 1440px × 80px
2. Add logo: 32px × 32px square, Orange/Primary fill
3. Add text: "ConsistencyGrid", style Body/Base, Bold
4. Add button: "Log in", Secondary variant, right aligned

### 4.3 Hero Section

1. Create frame: Max-width 1280px, centered, Padding 48px
2. Add heading: "Your life in weeks as your wallpaper"
   - "weeks" in Orange/Primary
   - Style: Heading/H1-Hero, centered
3. Add subheading: Body/Large, Gray/600, centered, Max-width 672px
4. Add CTA buttons: 
   - Google button: Secondary variant
   - Sign up button: Primary variant
   - Gap: 16px, centered

### 4.4 Phone Mockup

1. Create frame: 240px × 520px
2. Add rectangle: Fill Black, Corner radius 30px, Border Gray/300
3. Add notch: 120px × 4px, Gray/400, top center
4. Add wallpaper preview inside

### 4.5 Features Section

1. Create grid: 3 columns, Gap 32px
2. For each feature:
   - Icon: 48px × 48px circle, colored background
   - Title: Heading/H3
   - Description: Body/Small
   - Wrap in Card component

### 4.6 Footer

1. Create frame: Full width, Padding 48px
2. Add border top: Gray/200
3. Create 4-column grid:
   - Column 1: Logo + description
   - Columns 2-4: Link lists
4. Add copyright at bottom

---

## 📊 Step 5: Build Dashboard

### 5.1 Create Frame

1. Frame: 1920px × 1080px
2. Background: Cream

### 5.2 Sidebar

1. Create frame: 240px × 1080px, fixed left
2. Background: Cream
3. Border right: Gray/200
4. Add logo section: 80px height
5. Add navigation items:
   - Use Sidebar Item component
   - Active item: Orange background
   - Inactive: Transparent
6. Add user profile card at bottom

### 5.3 Main Content

1. Create frame: Remaining width, Padding 24px
2. Add Top Header Card
3. Add Stats Row: 4-column grid
4. Add Content Grid: 3 columns
   - Columns 1-2: Wallpaper Card
   - Column 3: Today Progress Card

---

## 🎨 Step 6: Create Responsive Variants

### 6.1 Mobile Frame

1. Create frame: 375px × 812px
2. Copy desktop design
3. Adjust:
   - Single column layout
   - Smaller typography
   - Bottom navigation instead of sidebar
   - Full-width cards

### 6.2 Tablet Frame

1. Create frame: 768px × 1024px
2. Copy desktop design
3. Adjust:
   - 2-column grids where appropriate
   - Medium typography
   - Sidebar can be collapsible

---

## 🎭 Step 7: Add Interactions

### 7.1 Button Hover

1. Select button
2. Add interaction: On hover
3. Change: Background color to Hover variant
4. Add: Scale 105%

### 7.2 Navigation

1. Select nav item
2. Add interaction: On click
3. Navigate to: Corresponding page frame

### 7.3 Modal

1. Create modal component
2. Add interaction: On click (trigger button)
3. Show overlay + modal
4. Add animation: Scale in, 300ms

---

## 📐 Step 8: Create Auto Layouts

### 8.1 Card Auto Layout

1. Select card content
2. Add Auto Layout: Vertical
3. Padding: 20px
4. Gap: 16px
5. Fill container: Horizontal

### 8.2 Button Auto Layout

1. Select button
2. Add Auto Layout: Horizontal
3. Padding: 12px 24px
4. Gap: 8px (if has icon)
5. Alignment: Center

---

## 🎯 Step 9: Organize Components

### 9.1 Component Structure

```
Components/
├── Buttons/
│   ├── Primary
│   ├── Secondary
│   └── Ghost
├── Cards/
│   ├── Standard
│   ├── Stat
│   └── Wallpaper
├── Inputs/
│   ├── Text
│   ├── Textarea
│   └── Select
├── Navigation/
│   ├── Sidebar Item
│   └── Bottom Nav Item
└── Status/
    ├── Badge
    └── Progress Bar
```

---

## ✅ Step 10: Final Checklist

- [ ] All color styles created
- [ ] All text styles created
- [ ] All effect styles created
- [ ] All components created with variants
- [ ] Landing page designed
- [ ] Dashboard designed
- [ ] All other pages designed
- [ ] Mobile variants created
- [ ] Tablet variants created
- [ ] Interactions added
- [ ] Auto layouts applied
- [ ] Components organized
- [ ] Design system documented

---

## 🎨 Pro Tips

1. **Use Auto Layout**: Makes components responsive and easier to maintain
2. **Create Variants**: Use component variants for different states
3. **Name Consistently**: Use clear, consistent naming (e.g., "Button/Primary")
4. **Use Styles**: Always use color and text styles, never hardcode
5. **Organize Layers**: Keep layers organized with clear naming
6. **Use Constraints**: Set proper constraints for responsive design
7. **Create Prototypes**: Add interactions to show user flows
8. **Document**: Add notes and descriptions to complex components

---

## 📚 Reference Documents

- `FIGMA_DESIGN_SPEC.md` - Complete design system
- `FIGMA_COMPONENT_SPECS.md` - Detailed component specs
- `README.md` - Project overview

---

**You now have everything needed to create a professional Figma design!** 🎉

Start with the Design System, then build components, then create pages. Take it step by step and you'll have a complete design in no time!
