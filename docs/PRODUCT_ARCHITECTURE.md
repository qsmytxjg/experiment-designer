# Life Science Experiment Platform Vision

This document records the long-term product architecture for a life science experiment web application. The current app starts with the plate colorizer, but the intended direction is a modular experiment platform that can support planning, execution, logging, scheduling, and analysis.

## Product Positioning

The app should treat `Experiment` as the central object.

Instead of building one-off pages for each experimental workflow, the system should use modular components and templates to standardize non-standard lab work.

Core idea:

```text
Project -> Experiment -> Template / Components -> Execution / Log -> Calendar / Dashboard -> Data / Analysis
```

## Layer 1: UI / UX View

The user-facing layer should be composed of independent modules.

### Project / Experiment Dashboard

Purpose:

- Show recent experiments.
- Show pending tasks.
- Show experiment progress.
- Provide a high-level overview of active projects.

Future component candidates:

- `ProjectDashboard`
- `ExperimentOverview`
- `RecentExperiments`
- `TaskSummary`

### Calendar / Kanban

Purpose:

- Show experiment schedules.
- Show TODO items.
- Support day, week, month, and task-board views.

Important design rule:

The calendar should not be only manually entered data. It should also be derived from experiment plans, operation logs, and scheduling rules.

Future component candidates:

- `ExperimentCalendar`
- `TaskBoard`
- `ScheduleEventList`

### Experiment Record Page (ELN)

Purpose:

- Record experiment objectives.
- Record protocols and steps.
- Attach images, files, tables, and notes.
- Support semi-structured or unstructured records.

Future component candidates:

- `ExperimentNotebook`
- `ProtocolEditor`
- `AttachmentPanel`
- `OperationLogTimeline`

### Plate Designer

Purpose:

- Visualize 6, 12, 24, 48, 96, and 384-well plates.
- Support well coloring.
- Support sample-to-well mapping.
- Support plate-to-reaction mapping.

Current implementation:

- `src/components/plate-colorizer/`
- `src/hooks/usePlateColorizer.js`

Future component candidates:

- `PlateLayoutEditor`
- `WellAssignmentPanel`
- `SampleMappingTable`
- `WellReactionMapper`

### Reaction Setup Table

Purpose:

- Provide spreadsheet-like setup tables for PCR, digestion, transfection, and other systems.
- Support formulas.
- Support copy and paste from Excel.
- Calculate volumes and concentrations.

Future component candidates:

- `ReactionSetupTable`
- `FormulaCell`
- `ReagentCalculator`
- `ExcelPasteGrid`

### Animal Experiment Ledger

Purpose:

- Track animal subjects across time.
- Record body weight, dosing, sampling, and longitudinal measurements.
- Support measurement charts.

Future component candidates:

- `AnimalSubjectTable`
- `MeasurementRecordChart`
- `DosingSchedule`
- `SamplingTimeline`

## Layer 2: Service / Component Layer

This layer owns the rules behind the UI.

### Project and Workflow Management

Responsibilities:

- Create projects.
- Create experiments.
- Track experiment lifecycle state.
- Link experiments to templates and schedules.

### Template Engine

Responsibilities:

- Load experiment template JSON.
- Validate component definitions.
- Render component instances.
- Store template versions.

### Component Renderer

Responsibilities:

- Convert template component definitions into UI modules.
- Dispatch component types such as `text`, `table`, `plate_map`, and `animal_record`.
- Keep component rendering predictable and extensible.

### Formula Calculation Core

Responsibilities:

- Calculate reaction volumes.
- Calculate concentration conversions.
- Summarize reaction setup tables.
- Recompute derived values when input cells change.

### Well-Reaction Mapper

Responsibilities:

- Link wells to reaction setups.
- Support N:M relationships between `Well` and `ReactionSetup`.
- Support one reaction assigned to many wells.
- Support one well linked to multiple reaction records when needed.

Core relation:

```text
Well <-> ReactionSetup
via WellReactionAssignment
```

### Schedule and Task Generator

Responsibilities:

- Convert experiment plans into calendar events.
- Convert protocol steps into TODO tasks.
- Derive calendar views from experiment data and operation logs.

Important design rule:

Calendar data is a derived view, not an isolated source of truth.

### Operation Log and Audit Service

Responsibilities:

- Record user actions.
- Track changes over time.
- Preserve traceability.
- Support version history.

### File and Attachment Service

Responsibilities:

- Store uploaded files.
- Link files to experiments and component instances.
- Manage raw data, images, tables, and protocol attachments.

### Search and Filtering

Responsibilities:

- Search by project, experiment, date, sample, animal, or reagent.
- Filter across modules.
- Support future multi-dimensional retrieval.

## Layer 3: Data Schema Relations

The data model should preserve experiment traceability and module flexibility.

### Core Entities

```text
Project
Experiment
Template
ComponentInstance
PlateLayout
Well
ReactionSetup
WellReactionAssignment
OperationLog
ScheduleEvent
Attachment
AnimalSubject
MeasurementRecord
```

### Primary Relationships

```text
Project 1:N Experiment
Experiment N:1 Template
Template 1:N ComponentInstance
Experiment 1:N OperationLog
Experiment 1:N ScheduleEvent
Experiment 1:N Attachment
ComponentInstance 1:N PlateLayout
PlateLayout 1:N Well
Well N:M ReactionSetup
WellReactionAssignment joins Well and ReactionSetup
ReactionSetup 1:N AnimalSubject when applicable
AnimalSubject 1:N MeasurementRecord
```

## Template Engine Data Flow

The template engine should transform JSON into usable experiment pages.

### 1. Input: Experiment Template JSON

Example concept:

```json
{
  "experiment": "TETV4_PCR",
  "components": [
    { "type": "text", "title": "实验目的" },
    { "type": "table", "title": "PCR体系" },
    { "type": "plate_map", "title": "布板图" },
    { "type": "animal_record", "title": "体重记录" }
  ]
}
```

Design rule:

- `type` decides which component to render.
- `data` decides default content and persisted state.
- Validation should happen before rendering.

### 2. Template Engine / JSON Renderer

Responsibilities:

- Parse JSON.
- Validate fields.
- Dispatch components by `type`.
- Create `ComponentInstance` records.

### 3. Business Interaction Logic

User interactions should trigger service logic:

- Table edits trigger formula calculation.
- Well assignments trigger well-reaction mapping.
- Every meaningful action writes to `OperationLog`.
- Time-aware steps generate `ScheduleEvent` items.

### 4. Persistence and Derived Views

Data should be saved in normalized entities, then used to derive views:

- Dashboard from projects, experiments, tasks, and logs.
- Calendar from schedule events, logs, and protocol rules.
- Reports from experiment data and attachments.

## Lifecycle Pipeline

Single experiment lifecycle:

```text
1. Create template
2. Parse JSON
3. Render components
4. User fills, maps, calculates
5. Save experiment data
6. Generate logs and calendar views
```

## Current Implementation Status

Implemented:

- Modular React/Vite app.
- Plate colorizer component group.
- Custom hook for plate colorizer state and logic.
- GitHub Pages deployment workflow.

Not implemented yet:

- Project dashboard.
- Calendar and kanban views.
- ELN record page.
- Reaction setup formula table.
- Template engine and JSON renderer.
- Data persistence layer.
- Operation log service.
- Animal experiment ledger.
- Search and filtering.

## Recommended Next Milestones

### Milestone 1: Stabilize Plate Designer

- Add sample names to wells.
- Add import/export JSON for plate layouts.
- Add better legend export.
- Add tests for triplicate coloring logic.

### Milestone 2: Add Template JSON Prototype

- Define a small template schema.
- Render `text`, `table`, and `plate_map` components from JSON.
- Store template examples in `src/templates/`.

### Milestone 3: Add Reaction Setup Table

- Create a spreadsheet-like reaction table.
- Support formula calculation.
- Link reaction rows to wells.

### Milestone 4: Add Experiment Record Page

- Add experiment objective, steps, notes, and attachments.
- Record changes in a local operation log model.

### Milestone 5: Add Persistence

- Start with local JSON export/import.
- Later add backend/database support if needed.

### Milestone 6: Add Calendar as Derived View

- Generate schedule events from experiment templates and logs.
- Avoid treating calendar entries as disconnected manual records.

## Architecture Principle

Keep the system component-based and template-driven.

The app should not become a single hard-coded lab notebook page. Each experimental workflow should be expressible as a template composed of reusable components.
