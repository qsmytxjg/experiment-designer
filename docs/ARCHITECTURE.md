# Experiment Designer Architecture Plan

This project should grow as a modular experiment-design web app. The current priority is to keep the plate colorizer easy to modify, easy to test, and fully traceable through Git history.

## Goals

- Keep each file small enough to read comfortably.
- Separate UI rendering from experiment-design logic.
- Make future modules easy to add without rewriting the existing colorizer.
- Keep Git commits focused so every major change can be traced or reverted.

## Current Direction

The plate colorizer is the first core feature. It supports:

- Multi-language UI.
- 6, 12, 24, 48, 96, and 384-well plates.
- Western blot gel lane layouts.
- Color palette selection.
- HEX color input.
- Single-well and triplicate coloring modes.
- Eraser and specific-color clearing.
- Auto-generated legend labels.
- Zoom controls.
- PNG export.

This feature has been split into focused UI components and a custom hook. Future work should preserve this separation before adding larger experiment-design modules.

## Recommended File Structure

```text
src/components/plate-colorizer/
  PlateColorizer.jsx
  ColorizerHeader.jsx
  BasicSettings.jsx
  ColoringTools.jsx
  ColorPicker.jsx
  FillModeControls.jsx
  LegendSection.jsx
  CanvasToolbar.jsx
  ColorizerCanvas.jsx
  PlateCanvas.jsx
  GelCanvas.jsx
  plateColorizerData.js

src/hooks/
  usePlateColorizer.js
```

## Component Responsibilities

### `PlateColorizer.jsx`

Main container for the module.

It should only:

- Call `usePlateColorizer`.
- Arrange the page layout.
- Pass state and handlers to child components.

It should not contain detailed plate-coloring logic.

### `ColorizerHeader.jsx`

Top navigation area.

Responsible for:

- App title.
- Language switcher.
- Clear canvas button.
- Export image button.

### `BasicSettings.jsx`

Basic experiment diagram settings.

Responsible for:

- Plate or gel format selection.
- Diagram title input.

### `ColorPicker.jsx`

Color selection panel.

Responsible for:

- Palette scheme selector.
- Color swatches.
- Native color picker.
- HEX input.

### `FillModeControls.jsx`

Fill behavior controls.

Responsible for:

- Single-well mode.
- Horizontal triplicate mode.
- Vertical triplicate mode.
- Eraser toggle.
- Clear current color.

### `LegendSection.jsx`

Legend editor.

Responsible for:

- Showing active colors.
- Editing labels for each color.
- Displaying empty-state helper text.

### `CanvasToolbar.jsx`

Canvas helper controls.

Responsible for:

- Plate or gel usage hint.
- Zoom in.
- Zoom out.
- Reset zoom.

### `PlateCanvas.jsx`

SVG renderer for plate layouts.

Responsible for:

- Row and column labels.
- Wells.
- Click, drag, double-click interactions for plate wells.

### `GelCanvas.jsx`

SVG renderer for Western blot gel layouts.

Responsible for:

- Lane labels.
- Loading wells.
- Lane body guides.
- Click, drag, double-click interactions for lanes.

### `plateColorizerData.js`

Stable data and dictionaries.

Should contain:

- Supported formats.
- Translation dictionaries.
- Color palette schemes.
- Row labels.

## Custom Hook Plan

Use `src/hooks/usePlateColorizer.js`.

This hook should own the colorizer state and behavior:

- `lang`
- `selectedFormat`
- `colors`
- `title`
- `legends`
- `selectedSchemeKey`
- `currentColor`
- `hexInput`
- `isEraser`
- `isDrawing`
- `fillMode`
- `zoom`
- `handleFormatChange`
- `selectColor`
- `handleHexInputChange`
- `handleColorPickerChange`
- `handleColorWell`
- `handleColClick`
- `handleRowClick`
- `clearSpecificColor`
- `exportAsImage`

The hook should make the UI components mostly declarative. Components should describe what appears on screen; the hook should decide how state changes.

## State Management Strategy

Use React local state and custom hooks first.

Do not add Zustand or another global state library yet. Add it only when at least two major modules need shared state, such as:

- Plate colorizer.
- Sample table.
- Randomization module.
- Export/report module.
- Protocol summary.

When shared state becomes necessary, prefer a small store such as Zustand for:

- Current language.
- Current experiment metadata.
- Shared sample list.
- Shared layout assignments.
- Export settings.

Avoid global state for temporary UI-only state unless several distant components truly need it.

## Git Workflow

Use focused commits for each meaningful change.

Recommended commit sequence:

```bash
feat: add full plate colorizer module
refactor: split plate colorizer components
refactor: move plate colorizer logic into hook
feat: add sample table integration
feat: add experiment export summary
```

Use a feature branch for larger changes:

```bash
git checkout -b feature/split-plate-colorizer
```

After the change is working:

```bash
git checkout master
git merge feature/split-plate-colorizer
```

If the experiment fails:

```bash
git checkout master
git branch -D feature/split-plate-colorizer
```

## Completed Refactor Checklist

- Constants moved into `plateColorizerData.js`.
- State and handlers moved into `usePlateColorizer.js`.
- Toolbar, settings, color picker, legend, and canvas split into separate components.
- `PlateColorizer.jsx` kept as the composition layer.
- Build verified after Node became available.
- Refactor recorded as a focused Git commit.

## Near-Term Product Checklist

- Add a sample table that can connect samples to wells.
- Add randomized well assignment.
- Add export to JSON, CSV, or Excel.
- Add save/load for reusable experiment templates.

## Long-Term Expansion Ideas

- Sample table connected to plate wells.
- Randomized well assignment.
- Replicate-aware design generation.
- Export to PNG, JSON, CSV, and Excel.
- Save and load experiment templates.
- Protocol summary generated from the current design.
- Multi-module experiment workspace.
