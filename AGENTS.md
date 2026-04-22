<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# UI & Component Guidelines

## Shadcn UI Integration

- **Framework**: All UI components MUST be built using `shadcn/ui` (Radix UI + Tailwind CSS).
- **Structure**: Components are located in `@/components/ui`.
- **Logic**: Use Lucide React for icons and `tailwind-merge` with `clsx` for dynamic styling (already configured in `@/lib/utils`).

## Dashboard UI Focus

- **Purpose**: This project is focused on building a comprehensive Dashboard UI.
- **Aesthetics**: Follow the "Rich Aesthetics" guidelines (glassmorphism, vibrant but harmonious color palettes, smooth transitions).
- **Interactive**: Ensure all dashboard elements are highly interactive with hover states and micro-animations.

## Implementation Workflow

- When adding new UI elements, first check if a `shadcn/ui` component exists. If not, install it using `npx shadcn@latest add <component-name>`.
- Prioritize visual excellence and a premium feel in all UI tasks.
