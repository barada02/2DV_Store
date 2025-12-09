# PixelMart AI

**PixelMart AI** is a 2D retro-style store simulator built with React and Tailwind CSS. It leverages the **Google Gemini API** to generate dynamic, humorous sales pitches and fluctuating prices for in-game items in real-time.

## Features

- **Retro 2D Exploration**: Navigate a pixel-art style store using keyboard controls.
- **Interactive Products**: Walk up to shelves to inspect items ranging from "Crimson Apples" to "Rusty Iron Swords".
- **AI Shopkeeper**: Every time you inspect an item, the Google Gemini 2.5 Flash model generates a unique, quirky sales pitch and description on the fly.
- **Dynamic Economy**: Prices are slightly randomized by the AI around a base value, simulating a haggling shopkeeper.

## Controls

| Action | Key / Input |
| :--- | :--- |
| **Move Up** | `W` or `Arrow Up` |
| **Move Down** | `S` or `Arrow Down` |
| **Move Left** | `A` or `Arrow Left` |
| **Move Right** | `D` or `Arrow Right` |
| **Inspect Item** | `T` (when facing item) or **Click** on item |
| **Close Menu** | `Esc` or `Click X` |

## Technical Details

### Architecture

- **Frontend**: React 19 (Hooks-based state management).
- **Styling**: Tailwind CSS for rapid UI development and pixel-art aesthetics (`image-rendering: pixelated`).
- **AI Integration**: Direct integration with `@google/genai` SDK using `gemini-2.5-flash` for low-latency text generation.

### Key Components

- **`TileMap`**: Renders the game grid based on a 2D array representing floors, walls, and shelves.
- **`PlayerSprite`**: Handles character positioning and directional rendering.
- **`geminiService`**: Manages API calls to Google's Generative AI, enforcing structured JSON output for consistent UI parsing.

### AI Implementation

The application uses a structured prompt to ensure the AI acts as a "medieval fantasy shopkeeper". It requests a JSON response schema containing:
- `description`: A short visual description.
- `salesPitch`: A funny, character-driven quote.
- `price`: A numeric value calculated by the model based on the base price.

## Environment Variables

The application requires a valid Google Gemini API key provided via `process.env.API_KEY`.
