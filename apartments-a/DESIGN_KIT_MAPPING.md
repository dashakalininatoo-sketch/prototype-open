# Design Kit mapping — apartments A

## Implementation model

The prototype stays vanilla HTML/CSS/JS. It reproduces Design System components, tokens, variants and states, but does not import React or `@cian/ui-kit`. Treat this as a DS-compatible imitation, not a real component integration.

Sources:

- Figma: page `407:89494`; frames `351:62791`, `351:62633`, `351:62888`.
- Web semantic colors: `Cian_UI_Kit_codex/docs/design-system/tokens/semanticPalette.css`.
- Typography: `tokens/desktop-typography.json`.
- Spacing and radius: `tokens/spacing.json`, `tokens/radius.json`.
- Badge: `components/badge`.
- Icons: `icons/16`, `icons/24`.

## Element mapping

| Prototype element | DS component / token source | Required mapping | Status |
| --- | --- | --- | --- |
| Page, rows, popovers, modal surfaces | Semantic colors | `background-primary`, `background-elevation` | Mirrored locally |
| Primary, secondary, disabled and link text | Semantic colors | `text-primary-default`, `text-secondary-default`, `text-primary-disabled`, `text-main-default`, `text-main-hovered` | Mirrored locally |
| Dividers, default borders and focus | Semantic colors | `stroke-divider-default`, `stroke-border-default`, `stroke-control-default`, `stroke-control-focused` | Mirrored locally |
| Popover border | Semantic colors | `stroke-border-neutral` = `#F3F5FA` | Mirrored locally |
| Selected filter border | Semantic colors | `stroke-border-main` = `#2178FD` | Exact Figma/DS match |
| Hover surfaces | Semantic colors | `surface-neutral-default`, `surface-neutral-selected` | Mirrored locally |
| Tabs | Figma custom variant | Preserve 28/36 typography and exact custom indicator; do not substitute current DS `Tabs` | Approved local exception |
| Room and filter controls | Figma `Button`, medium | Reproduce Button geometry and states; these are Buttons, not Chips | Vanilla imitation |
| Secondary CTA | `Button`, medium, secondary/main | `control-main-secondary-default`, hover `control-main-secondary-hovered`, pressed `control-main-secondary-pressed` | Vanilla imitation |
| Modal actions | `Button`, large | Primary/main and secondary/main variants; 56 px frame | Vanilla imitation |
| Text actions | `ActionLink` / link-button | 44 px touch target, 16 px icon, 8 px gap; preserve link versus action semantics | Vanilla imitation |
| Green sale badge | `components/badge`: secondary/green | Height `spacing.unit6`, radius `radius.oval`, padding `spacing.unit2`, typography `body2`; foreground uses approved Figma override `#1C6F01` | Vanilla imitation |
| Neutral finish badge | `components/badge`: secondary/gray | Height `spacing.unit6`, radius `radius.oval`, padding `spacing.unit2`, typography `body2`; background `accent-ghost-secondary` (`#E1E6F4`) | Vanilla imitation |
| Range fields | Figma custom field | Preserve custom 44 px neutral field and existing behavior; do not claim DS Input integration | Approved local exception |
| Row radius | Radius tokens | `radius.xxxl` = 20 px | Mirrored locally |
| Modal radius | Radius tokens | `radius.xxxxl` = 24 px | Mirrored locally |
| Badge radius | Radius tokens | `radius.oval` = 99 px | Mirrored locally |
| Standard spacing | Spacing tokens | Use `spacing.unit0`…`spacing.unit14`; 20 px link spacing is `spacing.unit5` | Mirrored locally |
| Backdrop | Semantic colors | `overlay-default` = 40% black | Mirrored locally |
| Action icons | DS icon library | Exact SVG names and geometry; color through semantic tokens or approved overrides | Copied locally, not component imports |

## Approved Figma and product overrides

- `#0468FF` — primary buttons and active tab indicator; keep instead of `control-main-primary-default` (`#006CFD`).
- `#1C6F01` — green badge text; keep instead of `text-positive-default` (`#227E01`).
- `#434F6C` — filter icons; keep instead of `icon-primary-default` (`#212C46`).
- `#97C355` — DOM.RF partner brand color; intentionally outside the Cian Design System.
- `#596273CC` — “Вы смотрели” product label; intentionally outside the Cian Design System.

## Remaining local values

- Figma media overlay 4% and shadows 8% remain local because the selected DS source has no exact equivalents.
- Inputs and pixel-perfect tabs remain custom by explicit product decision.

Do not transfer layout, card structure, data, grouping, modal behavior, filters, routing or interactions from A to B. Reuse only the component and token mappings above.
