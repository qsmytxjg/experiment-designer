# Project Agent Instructions

This project is a modular React web app for experiment design.

## Structure

- `src/App.jsx`: combines feature modules into the main app shell.
- `src/components/`: independent UI modules.
- `src/hooks/`: shared state and experiment-design logic.
- `src/data/`: stable configuration such as plate formats and default groups.

## Development Rules

- Keep each experiment-design feature isolated in its own component.
- Put reusable state transitions in hooks instead of duplicating them inside components.
- Avoid committing generated folders such as `node_modules`, `dist`, caches, large datasets, or analysis outputs.
- Use focused Git commits with clear messages, preferably Conventional Commit style.
