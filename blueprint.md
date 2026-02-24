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
- **Persistence:** Synchronize the list of tracked users across all devices using Firebase Firestore.
- **Access Control:** "Delete Only if Added By Me" logic using a persistent browser-specific `visitorId`.
- **Visual Activity:** Display the GitHub contribution graph for each user using the `ghchart` API.
- **Real-time Updates:** Automatic dashboard refresh when any user adds/removes a GitHub profile.

## Implementation Plan (Current Task)
1. **Firebase Integration:**
   - Link Firebase SDK (App, Firestore) in `index.html`.
   - Initialize Firebase in `main.js` with project configuration.
2. **Visitor Identification:**
   - Generate and store a unique `visitorId` in `localStorage` to identify the browser session.
3. **Firestore Logic:**
   - Replace `localStorage` tracking with Firestore collection (`grass_trackers`).
   - Store documents with `{ username, addedBy, createdAt }`.
4. **UI Updates:**
   - Only show the "Remove" button if the `visitorId` matches the `addedBy` field.
   - Real-time listener using `onSnapshot` for immediate UI updates across all clients.
