# Haelō Ops Demo

An operations dashboard demo for trying [Exocor](https://github.com/haelo-labs/exocor) inside a familiar SaaS-style workflow.

This app simulates equipment tracking, tickets, inspections, and team views so you can see how Exocor behaves in a dense product UI rather than a toy form.

## What You Can Try

- Navigate across dashboard, equipment, tickets, inspections, and team views
- Open equipment and ticket details
- Create tickets and inspections
- Move and update tickets
- Compare Exocor's learned app model with the app-native tools this demo exposes through `SpatialProvider`

This is a demo app, not a production starter.

## Quick Start

1. Copy `.env.example` to `.env`
2. Add your Anthropic API key to `ANTHROPIC_API_KEY`
3. Install dependencies with `npm install`
4. In one terminal, run `npx exocor dev`
5. In a second terminal, run `npm run dev`
6. Open the local Vite URL shown in the terminal

Run `npx exocor dev` from this repo root so the local relay can read `.env` or `.env.local`.

## Exocor Version

This repo is pinned to `exocor@0.2.1`.

The demo uses the published package by default so the GitHub repo is clone-and-run friendly.

## App-Native Tools

This demo registers app-native tools for workflows the UI already supports today.

- Global navigation across the main views
- Equipment filtering, equipment details, and ticket creation from equipment
- Ticket creation, ticket details, ticket updates, and ticket movement
- Inspection filtering and inspection creation
- Team member details

The rest of the experience still works through Exocor's normal learned app structure and DOM fallback behavior.

## Environment Variables

- `ANTHROPIC_API_KEY`: used by the local Exocor relay from `.env` or `.env.local`
- `VITE_EXOCOR_DEBUG`: optional debug flag for local SDK debugging

## Scripts

- `npm run dev`: start the local development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally
- `npx exocor dev`: start the local Exocor relay for localhost testing

## License

MIT. See [`LICENSE`](./LICENSE).
