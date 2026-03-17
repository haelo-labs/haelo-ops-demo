# Haelō Ops Demo

This repo is a small Vite + React demo app for quickly trying Exocor in an operations dashboard.

It simulates a more traditional product UI with equipment tracking, tickets, inspections, and team views so you can see how Exocor behaves inside a dashboard-style workflow.

## What This Demo Is For

- Trying Exocor quickly in a familiar SaaS-style interface
- Evaluating the SDK inside tickets, kanban, inspections, and operational views
- Sharing a simple, runnable example with other developers

This is a demo app, not a production starter.

## Quick Start

1. Copy `.env.example` to `.env`
2. Add your own Anthropic API key to `ANTHROPIC_API_KEY`
3. Install dependencies with `npm install`
4. Start the app with `npm run dev`
5. Open the local Vite URL shown in the terminal

Once the Exocor package is available as a normal dependency, the intended setup is just: create `.env`, install dependencies, and run the app.

If you are trying the demo before the package is publicly published, make sure `exocor` is available locally in your environment first.

## Environment Variables

- `ANTHROPIC_API_KEY`: your Anthropic API key for the Exocor-powered experience
- `VITE_EXOCOR_DEBUG`: optional debug flag for local SDK debugging

## Scripts

- `npm run dev`: start the local development server
- `npm run build`: create a production build
- `npm run preview`: preview the production build locally

## License

MIT. See [`LICENSE`](./LICENSE).
