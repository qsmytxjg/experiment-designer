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

## GitHub Workflow

- Default GitHub user: `qsmytxjg`.
- Default commit identity: `qsmytxjg <1536847012@qq.com>`.
- Use SSH remotes for GitHub instead of HTTPS when possible.
- Current repository remote: `git@github.com:qsmytxjg/experiment-designer.git`.
- Default branch: `main`.
- Public deployment is handled by GitHub Pages through `.github/workflows/deploy-pages.yml`.
- After local changes are committed, run `git push` to update GitHub; the public Pages site updates after the GitHub Actions deployment finishes.
- Do not store SSH private keys, access tokens, or passwords in this repository or in chat.
