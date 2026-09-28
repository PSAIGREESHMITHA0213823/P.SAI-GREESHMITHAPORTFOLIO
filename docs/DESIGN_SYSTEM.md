# Design system

**Concept:** engineering blueprint meets product dashboard. Every section is a numbered *module* (`02 — ABOUT`) with a hairline top border, a mono index line and a display title.

## Tokens (`src/styles/tokens.css`)

| Group | Tokens |
|---|---|
| Color, dark (default) | `--bg #0b0d10` (cool near-black), `--bg-elev`, `--surface`, `--surface-2`, `--surface-3`, `--text #e9ebee`, `--text-muted`, `--text-faint`, `--border` (8% white), `--border-strong`, `--grid-line` |
| Color, light | Warm paper `--bg #f4f1ea`, ink `--text #16150f`, same token names |
| Accent (only one) | Signal amber: `--accent #ffb224` in dark, `#a65300` in light (AA on paper). Used only for status, active state, focus, key CTAs and data highlights |
| Type | Display: Instrument Serif · Body: IBM Plex Sans · Meta: IBM Plex Mono (uppercase, 0.14em tracking) |
| Scale | `--fs-display`, `--fs-title` and `--fs-body` (fluid `clamp()`), plus `--fs-meta` for labels. Three sizes per view |
| Space | 8px scale: `--s0` 8 · `--s1` 16 · `--s2` 24 · `--s3` 32 · `--s4` 48 · `--s5` 64 · `--s6` 96 · `--s7` 128 · `--s8` 192 |
| Layout | 12-column grid (`.grid-12`), `--max-w 1320px`, fluid `--gutter`. Grid guides are visible in the hero only |
| Motion | 150 / 220 / 300ms, `--ease-out cubic-bezier(.2,.8,.2,1)`. Only transform and opacity are animated. All durations drop to 0 under `prefers-reduced-motion` |

Theme is saved to `localStorage` (`sg-theme`), follows the OS until the visitor picks one, and is applied before first paint by an inline script in `index.html`.

## Components

| Component | File | Notes |
|---|---|---|
| Nav, ModeSwitch, ThemeToggle, MobileTabBar, Footer | `components/Shell.tsx` | Bottom tab bar and full-screen menu under 760px |
| CommandPalette | `components/CommandPalette.tsx` | Ctrl/⌘K. Combobox + listbox ARIA. Becomes a bottom sheet on mobile |
| KeyboardShortcuts, ShortcutsOverlay | `components/Shortcuts.tsx` | `G` then `P`/`F`/`E`/`S`/`C`/`H`, `/`, `T`, `?` |
| Sheet | `components/Sheet.tsx` | Native `<dialog>` used as drawer, bottom sheet or center modal |
| ProjectCard, TechList, TypeBadge | `components/ProjectCard.tsx` | Cursor spotlight + tilt, shared-element cover |
| ProjectCover | `components/ProjectCover.tsx` | Real `<picture>` (AVIF/WebP), or a deterministic sanitized wireframe |
| ArchitectureDiagram, ScrollyArchitecture | `components/Architecture.tsx` | Data-driven animated SVG. Transposes on mobile |
| SystemPanel | `components/SystemPanel.tsx` | Simulated trace log. Pauses off-screen and is static under reduced motion |
| Placeholder, Maybe, StatusBadge, PrivateBadge, Chip, ModuleHead, Kbd | `components/Primitives.tsx` | |
| LiveClock, Counter, Toaster | `components/Widgets.tsx` | Counter only runs for verified numbers |
