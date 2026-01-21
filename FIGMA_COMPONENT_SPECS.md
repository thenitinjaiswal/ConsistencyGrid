# 🧩 ConsistencyGrid - Detailed Component Specifications for Figma

Detailed measurements and specifications for each component.

---

## 🔘 Buttons

### Primary Button
```
Width: Auto (min 120px)
Height: 44px
Padding: 12px 24px
Border Radius: 12px
Background: #F97316
Text: #FFFFFF
Font: 14px, Semibold (600)
Shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)

Hover State:
- Background: #EA580C
- Transform: Scale 105%
- Shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)

Disabled State:
- Opacity: 70%
- Cursor: not-allowed
```

### Secondary Button
```
Width: Auto (min 120px)
Height: 44px
Padding: 12px 24px
Border Radius: 12px
Background: #FFFFFF
Text: #1F2937
Border: 1px solid #E5E7EB
Font: 14px, Semibold (600)

Hover State:
- Background: #F9FAFB
- Border: 1px solid #D1D5DB
```

### Ghost Button
```
Width: Auto (min 100px)
Height: 40px
Padding: 10px 20px
Border Radius: 12px
Background: Transparent
Text: #374151
Font: 14px, Semibold (600)

Hover State:
- Background: #F3F4F6
```

### Icon Button (with icon)
```
Icon Size: 20px × 20px
Gap between icon and text: 8px
Icon Color: Inherit from text color
```

---

## 📦 Cards

### Standard Card
```
Width: Auto (fills container)
Min Height: 100px
Padding: 20px
Border Radius: 16px
Background: #FFFFFF
Border: 1px solid #F3F4F6
Shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)
```

### Stat Card
```
Width: Auto (fills grid cell)
Height: Auto (min 120px)
Padding: 16px
Border Radius: 16px
Background: #FFFFFF
Border: 1px solid #F3F4F6
Shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)

Content:
- Label: 12px, Semibold, #6B7280, Uppercase, Letter-spacing 0.05em
- Value: 32px, Bold, #111827
- Subtext: 12px, Regular, #9CA3AF

Hover State:
- Shadow: 0px 4px 6px rgba(0, 0, 0, 0.1)
- Transform: Scale 102%
```

### Wallpaper Preview Card
```
Width: Auto
Padding: 20px
Border Radius: 16px
Background: #FFFFFF
Border: 1px solid #F3F4F6

Header:
- Title: 14px, Bold, #111827
- Description: 12px, Regular, #6B7280
- Status Badge: Right aligned

Content Area:
- Grid: 2 columns, Gap 24px
- Left: Preview (240px width)
- Right: Actions (flex-1)
```

---

## 📝 Input Fields

### Text Input
```
Width: 100% (container width)
Height: 44px
Padding: 12px 16px
Border Radius: 12px
Background: #FFFFFF
Border: 1px solid #E5E7EB
Font: 14px, Regular, #111827
Placeholder: #9CA3AF

Focus State:
- Border: 2px solid #F97316
- Ring: 2px solid #F97316, 20% opacity, offset 2px
- Outline: None

Error State:
- Border: 2px solid #EF4444
- Background: #FEE2E2
```

### Label
```
Font: 12px, Semibold, #374151
Margin Bottom: 4px
```

### Helper Text
```
Font: 12px, Regular, #6B7280
Margin Top: 4px
```

---

## 🏷️ Badges

### Status Badge
```
Height: 24px
Padding: 4px 12px
Border Radius: 9999px
Font: 11px, Semibold, Uppercase, Letter-spacing 0.05em

Variants:
- Success: BG #D1FAE5, Text #065F46
- Warning: BG #FEF3C7, Text #92400E
- Error: BG #FEE2E2, Text #991B1B
- Info: BG #DBEAFE, Text #1E40AF
- Live: BG #D1FAE5, Text #065F46, Dot indicator
```

### Count Badge
```
Min Width: 20px
Height: 20px
Padding: 0px 6px
Border Radius: 10px
Background: #F97316
Text: #FFFFFF
Font: 11px, Bold
```

---

## 🧭 Navigation

### Sidebar Item (Inactive)
```
Width: 100%
Height: 40px
Padding: 10px 12px
Border Radius: 12px
Background: Transparent
Text: #374151
Font: 14px, Medium (500)
Icon: 20px × 20px, #6B7280
Gap: 12px (icon to text)

Hover State:
- Background: #FFFFFF, 70% opacity
- Text: #111827
```

### Sidebar Item (Active)
```
Width: 100%
Height: 40px
Padding: 10px 12px
Border Radius: 12px
Background: #F97316
Text: #FFFFFF
Font: 14px, Medium (500)
Icon: 20px × 20px, #FFFFFF
Shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)
```

### Bottom Navigation (Mobile)
```
Width: 100%
Height: 64px
Background: #FFFFFF
Border Top: 1px solid #E5E7EB
Padding: 8px
Position: Fixed bottom

Nav Item:
- Width: Equal distribution
- Height: 48px
- Icon: 24px × 24px
- Text: 11px, Regular, below icon
- Gap: 4px (icon to text)
- Active: Icon and text #F97316
- Inactive: Icon and text #6B7280
```

---

## 👤 User Profile Card

```
Width: 100%
Padding: 12px
Border Radius: 12px
Background: #FFFFFF
Shadow: 0px 1px 2px rgba(0, 0, 0, 0.05)

Avatar:
- Size: 40px × 40px
- Border Radius: 20px (circle)
- Background: Gradient from #FB923C to #F97316
- Text: 16px, Bold, #FFFFFF (first letter of name)

User Info:
- Name: 14px, Semibold, #111827
- Email: 12px, Regular, #6B7280
- Gap: 4px between name and email
```

---

## 📊 Progress Bars

### Horizontal Progress Bar
```
Width: 100%
Height: 8px
Background: #F3F4F6
Border Radius: 4px
Overflow: Hidden

Fill:
- Height: 100%
- Background: #F97316 (or status color)
- Border Radius: 4px
- Transition: Width 300ms ease
```

### Progress Bar with Label
```
Container:
- Width: 100%
- Gap: 8px (label to bar)

Label Row:
- Font: 12px, Regular, #6B7280
- Justify: Space-between

Bar:
- Height: 8px
- Background: #F3F4F6
- Fill: #F97316
```

---

## 🎨 Phone Mockup

### Phone Frame
```
Width: 240px (Desktop), 180px (Mobile)
Height: Auto (maintains 9:19.5 aspect ratio)
Border Radius: 30px
Border: 2px solid #D1D5DB
Background: #000000
Shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)

Notch:
- Width: 120px
- Height: 4px
- Border Radius: 2px
- Background: #9CA3AF
- Position: Top center, 16px from top
```

### Wallpaper Preview Inside
```
Width: 100% (fills phone frame minus border)
Height: Auto
Border Radius: 28px (slightly smaller than frame)
```

---

## 📅 Calendar Grid

### Calendar Cell
```
Width: Equal distribution (7 columns)
Height: Auto (min 40px)
Padding: 8px
Border: 1px solid #E5E7EB
Background: #FFFFFF

Today:
- Border: 2px solid #F97316
- Background: #FFEDD5

Completed:
- Background: #F97316
- Border: 1px solid #EA580C

Partial:
- Background: #FFEDD5
- Border: 1px solid #F97316
```

---

## 🔔 Toast Notification

```
Min Width: 300px
Max Width: 400px
Padding: 16px
Border Radius: 12px
Background: #FFFFFF
Border: 1px solid #E5E7EB
Shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)

Content:
- Icon: 20px × 20px (left)
- Message: 14px, Regular, #111827 (middle)
- Close Button: 20px × 20px (right)
- Gap: 12px

Success Variant:
- Border Left: 4px solid #10B981
- Icon: #10B981

Error Variant:
- Border Left: 4px solid #EF4444
- Icon: #EF4444
```

---

## 🎯 Toggle Switch

### Toggle Container
```
Width: 44px
Height: 24px
Border Radius: 12px
Background: #D1D5DB (inactive), #F97316 (active)
Padding: 2px
Transition: Background 200ms ease

Toggle Circle:
- Width: 20px
- Height: 20px
- Border Radius: 10px (circle)
- Background: #FFFFFF
- Position: Left 2px (inactive), Right 2px (active)
- Transition: Transform 200ms ease
- Shadow: 0px 1px 2px rgba(0, 0, 0, 0.1)
```

---

## 📋 Dropdown Menu

### Dropdown Container
```
Min Width: 200px
Max Width: 300px
Padding: 8px
Border Radius: 12px
Background: #FFFFFF
Border: 1px solid #E5E7EB
Shadow: 0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)

Menu Item:
- Height: 40px
- Padding: 10px 12px
- Border Radius: 8px
- Font: 14px, Regular, #111827
- Gap: 12px (icon to text)

Hover State:
- Background: #F3F4F6
```

---

## 🎨 Modal/Dialog

### Modal Overlay
```
Width: 100vw
Height: 100vh
Background: rgba(0, 0, 0, 0.5)
Position: Fixed
Backdrop Filter: Blur(4px)
```

### Modal Content
```
Width: 90% (max 500px)
Padding: 24px
Border Radius: 16px
Background: #FFFFFF
Shadow: 0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)
Position: Centered

Header:
- Title: 20px, Bold, #111827
- Close Button: 24px × 24px, top right

Content:
- Padding: 24px 0px
- Max Height: 60vh
- Overflow: Auto

Footer:
- Padding Top: 24px
- Border Top: 1px solid #E5E7EB
- Gap: 12px (buttons)
```

---

## 📐 Spacing Guide

### Component Internal Spacing
```
Card Padding: 20px
Section Gap: 24px
Element Gap: 16px
Small Gap: 8px
Tiny Gap: 4px
```

### Page Layout Spacing
```
Page Padding: 24px (Desktop), 16px (Mobile)
Section Margin: 48px vertical
Card Margin: 24px vertical
Grid Gap: 24px
```

---

## 🎭 Animation Specs

### Fade In
```
Duration: 600ms
Easing: ease-out
From: opacity 0, translateY 20px
To: opacity 1, translateY 0
```

### Slide Up
```
Duration: 500ms
Easing: ease-out
From: opacity 0, translateY 30px
To: opacity 1, translateY 0
```

### Scale In
```
Duration: 300ms
Easing: ease-out
From: opacity 0, scale 0.95
To: opacity 1, scale 1
```

### Hover Scale
```
Duration: 200ms
Easing: ease-in-out
Transform: scale 1.05
```

---

**Use these specifications to create pixel-perfect components in Figma!** 🎨
