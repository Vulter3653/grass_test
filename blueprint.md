# GitHub Grass Tracker Blueprint

## Overview
The GitHub Grass Tracker is a web application designed to monitor the contribution graphs (often called "grass") of multiple GitHub users in a single dashboard. It provides a clean, modern interface for tracking developer activity across different accounts.

## Current Project State
- Basic HTML/CSS/JS structure.
- Initialized with Firebase Studio.
- Connected to GitHub repository: `https://github.com/Vulter3653/grass_test`.

## Design & Style
- **Typography:** Expressive sans-serif fonts (e.g., Inter or system defaults).
- **Color Palette:** Vibrant greens (representing activity) and dark/light modes using `oklch` color space.
- **Visual Effects:** Multi-layered soft shadows, subtle noise texture for background depth, and glassmorphism elements.
- **Layout:** Responsive grid using CSS Grid and Flexbox, with container queries for individual user cards.

## Features
- **User Management:** Add and remove GitHub usernames.
- **Persistence:** Save the list of tracked users in the browser's LocalStorage.
- **Visual Activity:** Display the GitHub contribution graph for each user using the `ghchart` API.
- **Real-time Updates:** Input validation and immediate rendering upon adding a new user.

## Implementation Plan (Current Task)
1. **HTML Structure:** Define the main dashboard layout, search/add bar, and container for user cards.
2. **CSS Styling:** Implement the modern aesthetic defined in `GEMINI.md`, including `oklch` colors, `:has()` selectors, and responsive design.
3. **JavaScript Logic:**
   - Handle form submission for adding users.
   - Manage the list of users in `localStorage`.
   - Function to render user cards with their respective contribution charts.
   - Delete functionality for individual users.
4. **Validation:** Ensure the UI works across devices and handles errors (e.g., empty inputs).
