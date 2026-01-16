# Helper: Component Structure for Generator

To ensure easy maintenance and scalability, the Generator has been split into:

### `src/components/generator/`
1.  **`GeneratorForm.js`**: The main controller for the left side settings.
2.  **`GeneratorPreview.js`**: The right side visualizer with phone mockup.
3.  **`ThemeSelector.js`**: Visual cards for selecting themes (Dark, Orange, White).
4.  **`ResolutionPicker.js`**: Dropdown with presets for common phones (iPhone/Pixel).
5.  **`GoalSettings.js`**: Dedicated component for the goal tracking layer.
6.  **`ToggleRow.js`**: Reusable IOS-style toggle switch.

### `src/app/w/[token]/image.png/route.js`
- Updated to support the new theme dictionary.

This modular approach ensures that if you want to add a new theme or setting later, you only need to touch the relevant component.
